import * as THREE from 'three'
import { TextureLoader } from 'three'

const textureLoader = new TextureLoader()
const textureCache = new Map()

/**
 * Loads a texture from the public folder with caching
 * Three.js handles async loading - texture will be ready when loaded
 */
function loadTexture(path, flipY = false) {
  const cached = textureCache.get(path)
  if (cached) {
    if (cached.flipY !== flipY) {
      cached.flipY = flipY
      cached.needsUpdate = true
    }
    return cached
  }

  const texture = textureLoader.load(path)
  texture.flipY = flipY
  textureCache.set(path, texture)
  return texture
}

/**
 * Collects all unique texture paths from MATERIAL_CONFIG
 */
function collectAllTexturePaths() {
  const paths = new Set()

  for (const config of Object.values(MATERIAL_CONFIG)) {
    if (config.type === 'standard') {
      if (config.diffuseMap) paths.add(config.diffuseMap)
    }
  }

  return Array.from(paths)
}

/**
 * Preloads all textures in parallel (fire and forget)
 * Three.js handles async loading - textures will be ready when loaded
 */
export function preloadAllTextures() {
  const paths = collectAllTexturePaths()
  paths.forEach(path => {
    if (!textureCache.has(path)) {
      loadTexture(path) // Start loading immediately (parallel)
    }
  })
}

/**
 * Creates an unlit material with optional textures
 * Assumes textures are already loaded (or will be loaded by Three.js)
 */
function createStandardMaterial(config = {}) {
  const {
    name = 'BasicMaterial',
    diffuseMap,
    color = { r: 1, g: 1, b: 1 },
    transparent = false,
    opacity = 1.0,
    side = THREE.FrontSide
  } = config

  const material = new THREE.MeshBasicMaterial({
    name,
    color: new THREE.Color(color.r, color.g, color.b),
    transparent,
    opacity,
    side
  })

  // Assign textures (use cached or load - Three.js handles async loading)
  if (diffuseMap) {
    const texture = loadTexture(diffuseMap, false) // flipY = false for petal materials
    texture.colorSpace = THREE.SRGBColorSpace // SRGB encoding for diffuse maps
    material.map = texture
  }

  return material
}

/**
 * Material configuration - each material can be applied to multiple meshes
 * Update mesh names to match your petals GLB model
 */
const MATERIAL_CONFIG = {
  // Example petal material - adjust mesh names to match your GLB
  petal_alata_material: {
    meshes: ['petal'], // Add your mesh names here, e.g., ['petal', 'petals', 'petal_001']
    type: 'standard',
    diffuseMap: '/textures/purpurea_petal_diffuse.jpg'
  }
}

const meshToMaterialMap = new Map()
const materialInstanceCache = new Map()
let materialsBuilt = false

/**
 * Builds the reverse lookup map from MATERIAL_CONFIG
 */
function buildMeshToMaterialMap() {
  meshToMaterialMap.clear()

  for (const [materialName, config] of Object.entries(MATERIAL_CONFIG)) {
    if (Array.isArray(config.meshes)) {
      for (const meshName of config.meshes) {
        if (meshName) { // Skip empty strings
          meshToMaterialMap.set(meshName, { materialName, config })
        }
      }
    }
  }
}

buildMeshToMaterialMap()

// Default material cache
const defaultMaterial = new THREE.MeshBasicMaterial({
  name: 'default',
  color: 0xffffff
})

/**
 * Builds all materials upfront for better performance
 * This should be called before applying materials to scenes
 * Textures are loaded in parallel automatically
 */
export function buildAllMaterials() {
  if (materialsBuilt) return

  // Start loading all textures in parallel (fire and forget)
  preloadAllTextures()

  // Build all materials upfront (textures will populate as they load)
  for (const [materialName, config] of Object.entries(MATERIAL_CONFIG)) {
    if (config.type === 'standard' && !materialInstanceCache.has(materialName)) {
      const material = createStandardMaterial({ name: materialName, ...config })
      materialInstanceCache.set(materialName, material)
    }
  }

  materialsBuilt = true
}

/**
 * Creates a material for a specific mesh based on configuration
 * Uses pre-built materials from cache when available
 */
export function createMaterialForMesh(meshName) {
  const materialMapping = meshToMaterialMap.get(meshName)

  if (!materialMapping) {
    return defaultMaterial
  }

  const { materialName, config } = materialMapping

  // Check cache first (materials should be pre-built)
  const cached = materialInstanceCache.get(materialName)
  if (cached) return cached

  // Fallback: build material on-demand if not pre-built
  let material = null
  if (config.type === 'standard') {
    material = createStandardMaterial({ name: materialName, ...config })
    materialInstanceCache.set(materialName, material)
  } else {
    material = defaultMaterial
  }

  return material
}

/**
 * Applies materials to all meshes in a GLB scene
 * Materials should be pre-built via buildAllMaterials() for best performance
 */
export function applyMaterialsToScene(scene, options = {}) {
  const { overrideExisting = true, materialCallback = null } = options

  if (!scene) return new Map()

  // Ensure materials are built before applying
  if (!materialsBuilt) {
    buildAllMaterials()
  }

  const appliedMaterials = new Map()

  scene.traverse((child) => {
    if (!child.isMesh) return

    const meshName = child.name || 'unnamed_mesh'

    if (!overrideExisting && child.material) return

    const material = createMaterialForMesh(meshName)

    if (!material) return

    child.material = material
    appliedMaterials.set(meshName, material)
    if (materialCallback) materialCallback(child, material)
  })

  return appliedMaterials
}

/**
 * Gets the material configuration for a specific mesh
 */
export function getMaterialConfig(meshName) {
  const mapping = meshToMaterialMap.get(meshName)
  return mapping ? mapping.config : null
}

/**
 * Gets the material name for a specific mesh
 */
export function getMaterialNameForMesh(meshName) {
  const mapping = meshToMaterialMap.get(meshName)
  return mapping ? mapping.materialName : null
}

/**
 * Updates the material configuration
 */
export function updateMaterialConfig(materialName, config) {
  if (!Array.isArray(config.meshes)) return

  MATERIAL_CONFIG[materialName] = config
  buildMeshToMaterialMap()
  materialInstanceCache.delete(materialName) // Remove from cache to force rebuild
  materialsBuilt = false // Mark as needing rebuild
}

/**
 * Adds a new material configuration
 */
export function addMaterialConfig(materialName, config) {
  updateMaterialConfig(materialName, config)
}

/**
 * Gets all mesh names that use a specific material
 */
export function getMeshesForMaterial(materialName) {
  const config = MATERIAL_CONFIG[materialName]
  return config?.meshes ? [...config.meshes].filter(Boolean) : []
}

/**
 * Morph target to texture mapping
 * Maps each morph target name to its corresponding texture path
 * Update this to match your morph targets and available textures
 */
const MORPH_TEXTURE_MAP = {
  'PurpureaPurpurea': '/textures/petal_outside.jpg',
  'Alata': '/textures/alata_petal_diffuse.jpg',
  'Flava': '/textures/flava_petal_diffuse.jpg',
  'Leucophylla': '/textures/leucophylla_petal_diffuse.jpg',
  'RubraRubra': '/textures/rubra_petal_diffuse.jpg',
  'Minor': '/textures/minor_petal_diffuse.jpg',
  'Psittacina': '/textures/psittacina_petal_diffuse.jpg',
  'PurpureaVenosa': '/textures/rosea_petal_diffuse.jpg',
}

/**
 * Morph target to UV attribute mapping
 * Maps each morph target name to its corresponding UV attribute name
 * Options: 'uv', 'uv1', 'uv2', 'uv3', etc.
 * Default to 'uv' if not specified
 */
const MORPH_UV_MAP = {
  'PurpureaPurpurea': 'uv',
  'Alata': 'uv1',
  'Flava': 'uv2',
  'Leucophylla': 'uv3',
  'RubraRubra': 'texcoord_4',
  'Minor': 'texcoord_5',
  'Psittacina': 'texcoord_6',
  'PurpureaVenosa': 'texcoord_7',
}

// Cache of textures for morph targets
const morphTextureCache = new Map()

/**
 * Gets the UV attribute name for a specific morph target
 * @param {string} morphName - The morph target name
 * @returns {string} - The UV attribute name (defaults to 'uv')
 */
export function getUVForMorph(morphName) {
  return MORPH_UV_MAP[morphName] || 'uv'
}

/**
 * Checks available UV attributes on a geometry
 * @param {THREE.BufferGeometry} geometry - The geometry to check
 * @returns {string[]} - Array of available UV attribute names
 */
export function getAvailableUVAttributes(geometry) {
  if (!geometry || !geometry.attributes) return []

  const available = []
  const uvAttributes = ['uv', 'uv1', 'uv2', 'uv3', 'uv4', 'uv5', 'uv6', 'uv7']

  uvAttributes.forEach(attrName => {
    if (geometry.attributes[attrName]) {
      available.push(attrName)
    }
  })

  // Also check for custom named UV attributes (like 'uv_flava', 'uv_leucophylla')
  Object.keys(geometry.attributes).forEach(attrName => {
    if (attrName.startsWith('uv') && !available.includes(attrName)) {
      available.push(attrName)
    }
  })

  return available
}

/**
 * Updates the geometry's main UV attribute to use a different UV set
 * @param {THREE.BufferGeometry} geometry - The geometry to update
 * @param {string} uvAttributeName - The UV attribute name to copy from (e.g., 'uv', 'uv1', 'uv_flava')
 * @returns {boolean} - True if successful, false if UV set not found
 */
export function switchGeometryUV(geometry, uvAttributeName) {
  if (!geometry || !geometry.attributes) {
    console.warn('Geometry or attributes not found')
    return false
  }

  // If requesting the default UV, ensure it exists
  if (uvAttributeName === 'uv') {
    if (!geometry.attributes.uv) {
      console.warn('Default UV attribute not found')
      return false
    }
    // Already using default UV, no need to switch
    return true
  }

  // Get the source UV attribute
  const sourceUV = geometry.attributes[uvAttributeName]
  if (!sourceUV) {
    console.warn(`UV attribute "${uvAttributeName}" not found on geometry`)
    return false
  }

  // Ensure the main UV attribute exists
  if (!geometry.attributes.uv) {
    // Create a new UV attribute if it doesn't exist
    geometry.setAttribute('uv', sourceUV.clone())
  } else {
    // Copy the source UV data to the main UV attribute
    const uvAttribute = geometry.attributes.uv
    const sourceArray = sourceUV.array
    const uvArray = uvAttribute.array

    if (sourceArray.length !== uvArray.length) {
      // If sizes don't match, replace the attribute
      geometry.setAttribute('uv', sourceUV.clone())
    } else {
      // Copy the values
      uvArray.set(sourceArray)
      uvAttribute.needsUpdate = true
    }
  }

  return true
}

/**
 * Gets the texture for a specific morph target
 * @param {string} morphName - The morph target name
 * @returns {THREE.Texture|null} - The texture or null if not found
 */
export function getTextureForMorph(morphName) {
  if (!morphName) return null

  // Check cache first
  if (morphTextureCache.has(morphName)) {
    const cached = morphTextureCache.get(morphName)
    // Ensure SRGB encoding
    if (cached.colorSpace !== THREE.SRGBColorSpace) {
      cached.colorSpace = THREE.SRGBColorSpace
    }
    return cached
  }

  // Get texture path from mapping
  const texturePath = MORPH_TEXTURE_MAP[morphName]
  if (!texturePath) {
    console.warn(`No texture mapping found for morph: ${morphName}`)
    return null
  }

  // Load texture with flipY = false for petal materials
  const texture = loadTexture(texturePath, false)
  texture.colorSpace = THREE.SRGBColorSpace
  morphTextureCache.set(morphName, texture)

  return texture
}

/**
 * Preloads all morph textures in parallel
 */
export function preloadMorphTextures() {
  const uniquePaths = new Set(Object.values(MORPH_TEXTURE_MAP))
  uniquePaths.forEach(path => {
    // Always load with flipY = false, even if cached (loadTexture will update flipY if different)
    loadTexture(path, false) // flipY = false for petal materials
  })
}

/**
 * Updates the material texture and UV set for a mesh based on morph target name
 * @param {THREE.Mesh} mesh - The mesh to update
 * @param {string} morphName - The morph target name
 */
export function updateMaterialTextureForMorph(mesh, morphName) {
  if (!mesh || !mesh.material) {
    console.warn('Mesh or material not found for texture update')
    return
  }

  const texture = getTextureForMorph(morphName)
  if (!texture) {
    console.warn(`Could not get texture for morph: ${morphName}`)
    return
  }

  // Get the UV attribute name for this morph
  const uvAttributeName = getUVForMorph(morphName)

  // Update the geometry's UV attribute if needed
  if (mesh.geometry) {
    const switched = switchGeometryUV(mesh.geometry, uvAttributeName)
    if (!switched) {
      console.warn(`Could not switch to UV attribute "${uvAttributeName}" for morph: ${morphName}`)
    }
  }

  // Handle both single material and material arrays
  const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]

  materials.forEach(material => {
    if (material && material.isMeshBasicMaterial) {
      material.map = texture
      material.needsUpdate = true
    }
  })
}

export { MATERIAL_CONFIG }
