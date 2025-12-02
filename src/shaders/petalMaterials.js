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
    if (cached.flipY !== flipY) cached.flipY = flipY
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
      if (config.normalMap) paths.add(config.normalMap)
      if (config.roughnessMap) paths.add(config.roughnessMap)
      if (config.metalnessMap) paths.add(config.metalnessMap)
      if (config.aoMap) paths.add(config.aoMap)
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
 * Creates a standard PBR material with optional textures
 * Assumes textures are already loaded (or will be loaded by Three.js)
 */
function createStandardMaterial(config = {}) {
  const {
    name = 'StandardMaterial',
    diffuseMap,
    normalMap,
    roughnessMap,
    metalnessMap,
    aoMap,
    color = { r: 1, g: 1, b: 1 },
    roughness = 0.5,
    metalness = 0.0,
    transparent = false,
    opacity = 1.0,
    side = THREE.FrontSide
  } = config

  const material = new THREE.MeshStandardMaterial({
    name,
    color: new THREE.Color(color.r, color.g, color.b),
    roughness,
    metalness,
    transparent,
    opacity,
    side
  })

  // Assign textures (use cached or load - Three.js handles async loading)
  if (diffuseMap) {
    const texture = loadTexture(diffuseMap)
    texture.colorSpace = THREE.SRGBColorSpace
    material.map = texture
  }
  if (normalMap) {
    const texture = loadTexture(normalMap)
    texture.colorSpace = THREE.LinearSRGBColorSpace
    material.normalMap = texture
  }
  if (roughnessMap) {
    const texture = loadTexture(roughnessMap)
    texture.colorSpace = THREE.LinearSRGBColorSpace
    material.roughnessMap = texture
  }
  if (metalnessMap) {
    const texture = loadTexture(metalnessMap)
    texture.colorSpace = THREE.LinearSRGBColorSpace
    material.metalnessMap = texture
  }
  if (aoMap) {
    const texture = loadTexture(aoMap)
    texture.colorSpace = THREE.LinearSRGBColorSpace
    material.aoMap = texture
  }

  return material
}

/**
 * Material configuration - each material can be applied to multiple meshes
 * Update mesh names to match your petals GLB model
 */
const MATERIAL_CONFIG = {
  // Example petal material - adjust mesh names to match your GLB
  petal_material: {
    meshes: [''], // Add your mesh names here, e.g., ['petal', 'petals', 'petal_001']
    type: 'standard',
    diffuseMap: '/textures/petal_outside.jpg',
    color: { r: 0.9, g: 0.9, b: 0.95 },
    roughness: 0.9,
    metalness: 0.0
  },
  petal_flava_material: {
    meshes: ['petal'], // Add your mesh names here, e.g., ['petal', 'petals', 'petal_001']
    type: 'standard',
    diffuseMap: '/textures/sepal_outside.jpg',
    color: { r: 0.9, g: 0.9, b: 0.95 },
    roughness: 0.9,
    metalness: 0.0
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
const defaultMaterial = new THREE.MeshStandardMaterial({
  name: 'default',
  color: 0xffffff,
  roughness: 0.5,
  metalness: 0.0
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

export { MATERIAL_CONFIG }
