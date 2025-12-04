import * as THREE from 'three'
import { TextureLoader } from 'three'
import { createArrowMaterial } from './arrowShader'

const textureLoader = new TextureLoader()
const textureCache = new Map()

/**
 * Loads a texture from the public folder with caching
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
 * Creates a standard PBR material with optional textures
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

  // Batch texture loading
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
 */
const MATERIAL_CONFIG = {
  enter_arrow_material: {
    meshes: ['enter_arrow'],
    type: 'arrow',
    color: { r: 0.0, g: 1.0, b: 0.0 }
  },
  exit_arrow_material: {
    meshes: ['exit_arrow'],
    type: 'arrow',
    color: { r: 1.0, g: 0.0, b: 0.0 }
  },
  anther_material: {
    meshes: ['anthers'],
    type: 'standard',
    diffuseMap: '/textures/anthersovary_diffuse.jpg',
    color: { r: 0.9, g: 0.9, b: 0.95 },
    roughness: 0.9,
    metalness: 0.0
  },
  scape_material: {
    meshes: ['scape'],
    type: 'standard',
    diffuseMap: '/textures/sepal_outside.jpg',
    color: { r: 0.9, g: 0.9, b: 0.95 },
    roughness: 0.9,
    metalness: 0.0
  },
  petal_dual_material: {
    meshes: ['petal_001','petal_002', 'petal_003', 'petal_004', 'petal_005', 'petals_scape'],
    frontMaterial: 'petal_outside_material',
    backMaterial: 'petal_inside_material'
  },
  petal_outside_material: {
    meshes: [],
    type: 'standard',
    diffuseMap: '/textures/petal_outside.jpg',
    color: { r: 0.9, g: 0.9, b: 0.95 },
    roughness: 0.9,
    metalness: 0.0
  },
  petal_inside_material: {
    meshes: [],
    type: 'standard',
    diffuseMap: '/textures/petal_inside.jpg',
    color: { r: 0.9, g: 0.9, b: 0.95 },
    roughness: 0.9,
    metalness: 0.0
  },
  style_dual_material: {
    meshes: ['style'],
    frontMaterial: 'style_outside_material',
    backMaterial: 'style_inside_material'
  },
  style_inside_material: {
    meshes: [],
    type: 'standard',
    diffuseMap: '/textures/style_inside.jpg',
    color: { r: 0.8, g: 0.8, b: 0.85 },
    roughness: 0.7,
    metalness: 0.0,
    side: THREE.DoubleSide
  },
  style_outside_material: {
    meshes: [],
    type: 'standard',
    diffuseMap: '/textures/style_outside.jpg',
    color: { r: 0.8, g: 0.8, b: 0.85 },
    roughness: 0.7,
    metalness: 0.0
  },
  sepal_dual_material: {
    meshes: ['sepal', 'bract'],
    frontMaterial: 'sepal_outside_material',
    backMaterial: 'sepal_inside_material'
  },
  sepal_outside_material: {
    meshes: [],
    type: 'standard',
    side: THREE.FrontSide,
    diffuseMap: '/textures/sepal_outside.jpg',
    color: { r: 0.85, g: 0.9, b: 0.85 },
    roughness: 1.0,
    metalness: 0.0
  },
  sepal_inside_material: {
    meshes: [],
    type: 'standard',
    side: THREE.BackSide,
    diffuseMap: '/textures/sepal_inside.jpg',
    color: { r: 0.9, g: 0.85, b: 0.9 },
    roughness: 0.8,
    metalness: 0.0
  }
}

const meshToMaterialMap = new Map()
const materialInstanceCache = new Map()

/**
 * Builds the reverse lookup map from MATERIAL_CONFIG
 * Optimized single-pass algorithm
 */
function buildMeshToMaterialMap() {
  meshToMaterialMap.clear()
  
  const referencedMaterials = new Set()
  const dualSidedMaterials = []
  const regularMaterials = []
  
  // Single pass to categorize materials
  for (const [materialName, config] of Object.entries(MATERIAL_CONFIG)) {
    if (config.frontMaterial) referencedMaterials.add(config.frontMaterial)
    if (config.backMaterial) referencedMaterials.add(config.backMaterial)
    
    if (config.frontMaterial && config.backMaterial) {
      dualSidedMaterials.push([materialName, config])
    } else if (!referencedMaterials.has(materialName)) {
      regularMaterials.push([materialName, config])
    }
  }
  
  // Process dual-sided materials first (priority)
  for (const [materialName, config] of dualSidedMaterials) {
    if (Array.isArray(config.meshes)) {
      for (const meshName of config.meshes) {
        meshToMaterialMap.set(meshName, { materialName, config })
      }
    }
  }
  
  // Process regular materials
  for (const [materialName, config] of regularMaterials) {
    if (Array.isArray(config.meshes)) {
      for (const meshName of config.meshes) {
        if (!meshToMaterialMap.has(meshName)) {
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
 * Creates a material for a specific mesh based on configuration
 */
export function createMaterialForMesh(meshName) {
  const materialMapping = meshToMaterialMap.get(meshName)
  
  if (!materialMapping) {
    return defaultMaterial
  }

  const { materialName, config } = materialMapping

  // Check cache first
  const cached = materialInstanceCache.get(materialName)
  if (cached) return cached

  let material = null

  // Handle dual-sided materials
  if (config.frontMaterial && config.backMaterial) {
    const frontConfig = MATERIAL_CONFIG[config.frontMaterial]
    const backConfig = MATERIAL_CONFIG[config.backMaterial]
    
    if (!frontConfig || !backConfig) {
      material = defaultMaterial
    } else {
      const frontMaterial = frontConfig.type === 'standard'
        ? createStandardMaterial({ name: `${materialName}_front`, ...frontConfig, side: THREE.FrontSide })
        : new THREE.MeshStandardMaterial({ name: `${materialName}_front`, color: 0xffffff, side: THREE.FrontSide })
      
      const backMaterial = backConfig.type === 'standard'
        ? createStandardMaterial({ name: `${materialName}_back`, ...backConfig, side: THREE.BackSide })
        : new THREE.MeshStandardMaterial({ name: `${materialName}_back`, color: 0xffffff, side: THREE.BackSide })
      
      material = [frontMaterial, backMaterial]
    }
  } else if (config.type === 'arrow') {
    material = createArrowMaterial(config.color)
    if (config.side !== undefined) material.side = config.side
  } else if (config.type === 'standard') {
    material = createStandardMaterial({ name: materialName, ...config })
  } else {
    material = defaultMaterial
  }

  if (material) {
    materialInstanceCache.set(materialName, material)
  }

  return material
}

/**
 * Applies materials to all meshes in a GLB scene
 */
export function applyMaterialsToScene(scene, options = {}) {
  const { overrideExisting = true, materialCallback = null } = options

  if (!scene) return new Map()

  const appliedMaterials = new Map()
  const dualSidedMeshes = []
  
  // Single traverse pass
  scene.traverse((child) => {
    if (!child.isMesh) return
    
    const meshName = child.name || 'unnamed_mesh'
    
    if (!overrideExisting && child.material) return

    const material = createMaterialForMesh(meshName)
    
    if (!material) return

    if (Array.isArray(material) && material.length === 2) {
      dualSidedMeshes.push({ mesh: child, meshName, materials: material })
    } else {
      child.material = material
      appliedMaterials.set(meshName, material)
      if (materialCallback) materialCallback(child, material)
    }
  })
  
  // Process dual-sided meshes
  for (const { mesh, meshName, materials } of dualSidedMeshes) {
    const [frontMaterial, backMaterial] = materials
    
    mesh.material = frontMaterial
    
    const backMesh = new THREE.Mesh(mesh.geometry, backMaterial)
    backMesh.name = `${meshName}_back`
    
    // Initialize morph targets if present
    const morphAttrs = mesh.geometry.morphAttributes?.position
    if (morphAttrs && morphAttrs.length > 0) {
      backMesh.morphTargetInfluences = new Array(morphAttrs.length).fill(0)
      if (mesh.morphTargetDictionary) {
        backMesh.morphTargetDictionary = mesh.morphTargetDictionary
      }
    }
    
    mesh.userData.dualSidedBackMesh = backMesh
    mesh.add(backMesh)
    
    appliedMaterials.set(meshName, materials)
    if (materialCallback) materialCallback(mesh, materials)
  }

  return appliedMaterials
}

/**
 * Preloads all textures defined in MATERIAL_CONFIG
 */
export function preloadAllTextures() {
  for (const config of Object.values(MATERIAL_CONFIG)) {
    if (config.type === 'standard') {
      const paths = [
        config.diffuseMap,
        config.normalMap,
        config.roughnessMap,
        config.metalnessMap,
        config.aoMap
      ].filter(Boolean)
      
      for (const path of paths) {
        if (!textureCache.has(path)) {
          loadTexture(path)
        }
      }
    }
  }
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
  materialInstanceCache.clear()
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
  return config?.meshes ? [...config.meshes] : []
}

export { MATERIAL_CONFIG }
