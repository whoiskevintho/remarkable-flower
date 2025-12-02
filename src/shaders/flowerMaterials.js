import * as THREE from 'three'
import { TextureLoader } from 'three'
import { createArrowMaterial } from './arrowShader'

// Texture loader instance (shared across all materials)
const textureLoader = new TextureLoader()

// Cache for loaded textures to avoid reloading
const textureCache = new Map()

/**
 * Loads a texture from the public folder with caching
 * Textures are shared across materials (standard Three.js pattern)
 * @param {string} path - Path to texture relative to public folder (e.g., '/textures/diffuse.jpg')
 * @param {boolean} flipY - Whether to flip the texture on Y-axis (default: false)
 * @returns {THREE.Texture} Loaded texture
 */
function loadTexture(path, flipY = false) {
  if (textureCache.has(path)) {
    const cachedTexture = textureCache.get(path)
    // Ensure flipY is set correctly even for cached textures
    if (cachedTexture.flipY !== flipY) {
      cachedTexture.flipY = flipY
    }
    return cachedTexture
  }
  
  const texture = textureLoader.load(path)
  texture.flipY = flipY
  textureCache.set(path, texture)
  return texture
}

/**
 * Creates a standard PBR material with optional textures
 * @param {Object} config - Material configuration
 * @param {string} config.name - Material name (for debugging)
 * @param {string} config.diffuseMap - Path to diffuse/albedo texture
 * @param {string} config.normalMap - Path to normal map texture
 * @param {string} config.roughnessMap - Path to roughness map texture
 * @param {string} config.metalnessMap - Path to metalness map texture
 * @param {string} config.aoMap - Path to ambient occlusion map texture
 * @param {Object} config.color - Base color (r, g, b) if no diffuse map
 * @param {number} config.roughness - Roughness value (0-1)
 * @param {number} config.metalness - Metalness value (0-1)
 * @param {boolean} config.transparent - Whether material is transparent
 * @param {number} config.opacity - Opacity value (0-1)
 * @param {number} config.side - Side to render: THREE.FrontSide (0), THREE.BackSide (1), THREE.DoubleSide (2). Default: THREE.FrontSide
 * @returns {THREE.MeshStandardMaterial} Created material
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

  // Load and assign textures
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
 * Add your texture paths here. Textures should be in the public folder.
 * 
 * Example structure:
 * {
 *   materialName: {
 *     meshes: ['mesh1', 'mesh2', 'mesh3'], // Array of mesh names to apply this material to
 *     type: 'standard' | 'arrow',
 *     // For standard materials:
 *     diffuseMap: '/textures/materialName_diffuse.jpg',
 *     normalMap: '/textures/materialName_normal.jpg',
 *     // ... other texture maps
 *     side: THREE.FrontSide | THREE.BackSide | THREE.DoubleSide, // Optional: which side to render (default: FrontSide)
 *     // For arrow materials:
 *     color: { r: 1.0, g: 0.0, b: 0.0 },
 *     side: THREE.FrontSide | THREE.BackSide | THREE.DoubleSide, // Optional
 *     // For dual-sided materials (different materials on front and back):
 *     frontMaterial: 'materialNameForFront', // Reference to another material config for front side
 *     backMaterial: 'materialNameForBack'     // Reference to another material config for back side
 *   }
 * }
 */
const MATERIAL_CONFIG = {
  // Arrow materials (using shader)
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
  
  // Flower part materials (add texture paths as needed)
  // Example configurations - update with your actual texture paths:
  petal_material: {
    meshes: ['petal_002', 'petal_005'],
    type: 'standard',
    diffuseMap: '/textures/petal_outside.jpg',
    // normalMap: '/textures/petal_normal.jpg',
    color: { r: 0.9, g: 0.9, b: 0.95 },
    roughness: 0.6,
    metalness: 0.0
  },
  style_material: {
    meshes: ['style'],
    type: 'standard',
    // diffuseMap: '/textures/style_diffuse.jpg',
    color: { r: 0.8, g: 0.8, b: 0.85 },
    roughness: 0.7,
    metalness: 0.0
  },
  // Example: Dual-sided material (different materials on front and back)
  sepal_dual_material: {
    meshes: ['sepal', 'sepals'],  // Meshes that use this dual-sided material
    frontMaterial: 'sepal_outside_material',  // Material for front faces
    backMaterial: 'sepal_inside_material'    // Material for back faces
  },
  sepal_outside_material: {
    meshes: [], // Not directly applied, only used via frontMaterial/backMaterial
    type: 'standard',
    side: THREE.FrontSide,  // Will be overridden to FrontSide when used in dual material
    diffuseMap: '/textures/sepal_outside.jpg',
    color: { r: 0.85, g: 0.9, b: 0.85 },
    roughness: 1.0,
    metalness: 0.0
  },
  sepal_inside_material: {
    meshes: [], // Not directly applied, only used via frontMaterial/backMaterial
    type: 'standard',
    side: THREE.BackSide,
    diffuseMap: '/textures/sepal_inside.jpg',
    color: { r: 0.9, g: 0.85, b: 0.9 },
    roughness: 0.8,
    metalness: 0.0
  },
  // Add more materials here as needed
}

// Create a reverse lookup map: meshName -> materialConfig
// This is built automatically from MATERIAL_CONFIG
const meshToMaterialMap = new Map()

/**
 * Builds the reverse lookup map from MATERIAL_CONFIG
 * Call this whenever MATERIAL_CONFIG changes
 * Prioritizes dual-sided materials and excludes materials that are only referenced
 */
function buildMeshToMaterialMap() {
  meshToMaterialMap.clear()
  
  // First pass: Find all materials that are referenced by frontMaterial/backMaterial
  const referencedMaterials = new Set()
  Object.values(MATERIAL_CONFIG).forEach((config) => {
    if (config.frontMaterial) {
      referencedMaterials.add(config.frontMaterial)
    }
    if (config.backMaterial) {
      referencedMaterials.add(config.backMaterial)
    }
  })
  
  // Second pass: Build the map, prioritizing dual-sided materials
  // Process dual-sided materials first, then regular materials
  const dualSidedMaterials = []
  const regularMaterials = []
  
  Object.entries(MATERIAL_CONFIG).forEach(([materialName, config]) => {
    if (config.frontMaterial && config.backMaterial) {
      dualSidedMaterials.push([materialName, config])
    } else if (!referencedMaterials.has(materialName)) {
      // Only add materials that aren't just referenced by others
      regularMaterials.push([materialName, config])
    }
  })
  
  // Process dual-sided materials first (they take priority)
  dualSidedMaterials.forEach(([materialName, config]) => {
    if (config.meshes && Array.isArray(config.meshes)) {
      config.meshes.forEach((meshName) => {
        meshToMaterialMap.set(meshName, { materialName, config })
        console.log(`Mapped mesh "${meshName}" to dual-sided material "${materialName}"`)
      })
    }
  })
  
  // Then process regular materials (only if mesh not already mapped)
  regularMaterials.forEach(([materialName, config]) => {
    if (config.meshes && Array.isArray(config.meshes)) {
      config.meshes.forEach((meshName) => {
        // Only set if not already mapped (dual-sided takes priority)
        if (!meshToMaterialMap.has(meshName)) {
          meshToMaterialMap.set(meshName, { materialName, config })
        }
      })
    }
  })
}

// Build the map on module load
buildMeshToMaterialMap()

// Material instance cache - stores created material instances
// Key: materialName, Value: THREE.Material instance
const materialInstanceCache = new Map()

/**
 * Creates a material for a specific mesh based on configuration
 * Materials are cached and reused for meshes that share the same material
 * Supports dual-sided materials (different materials for front and back)
 * @param {string} meshName - Name of the mesh
 * @returns {THREE.Material|THREE.Material[]} Created material(s) or default material if not configured
 */
export function createMaterialForMesh(meshName) {
  const materialMapping = meshToMaterialMap.get(meshName)
  
  if (!materialMapping) {
    console.warn(`No material configuration found for mesh: ${meshName}`)
    // Return a default material if not configured
    return new THREE.MeshStandardMaterial({
      name: `${meshName}_default`,
      color: 0xffffff,
      roughness: 0.5,
      metalness: 0.0
    })
  }

  const { materialName, config } = materialMapping

  // Check if we already created this material instance
  if (materialInstanceCache.has(materialName)) {
    return materialInstanceCache.get(materialName)
  }

  // Handle dual-sided materials (different materials for front and back)
  if (config.frontMaterial && config.backMaterial) {
    const frontMaterialConfig = MATERIAL_CONFIG[config.frontMaterial]
    const backMaterialConfig = MATERIAL_CONFIG[config.backMaterial]
    
    if (!frontMaterialConfig || !backMaterialConfig) {
      console.warn(`Front or back material config not found for ${materialName}. Front: ${config.frontMaterial}, Back: ${config.backMaterial}`)
      return new THREE.MeshStandardMaterial({
        name: `${materialName}_fallback`,
        color: 0xffffff
      })
    }

    // Create front material (renders front faces)
    let frontMaterial = null
    if (frontMaterialConfig.type === 'standard') {
      frontMaterial = createStandardMaterial({
        name: `${materialName}_front`,
        ...frontMaterialConfig,
        side: THREE.FrontSide  // Use FrontSide for front mesh
      })
    } else {
      console.warn(`Unsupported front material type: ${frontMaterialConfig.type}`)
      frontMaterial = new THREE.MeshStandardMaterial({
        name: `${materialName}_front_fallback`,
        color: 0xffffff,
        side: THREE.FrontSide
      })
    }

    // Create back material (renders back faces)
    let backMaterial = null
    if (backMaterialConfig.type === 'standard') {
      backMaterial = createStandardMaterial({
        name: `${materialName}_back`,
        ...backMaterialConfig,
        side: THREE.BackSide  // Use BackSide for back mesh
      })
    } else {
      console.warn(`Unsupported back material type: ${backMaterialConfig.type}`)
      backMaterial = new THREE.MeshStandardMaterial({
        name: `${materialName}_back_fallback`,
        color: 0xffffff,
        side: THREE.BackSide
      })
    }

    // Return array of materials for dual-sided rendering
    const materials = [frontMaterial, backMaterial]
    materialInstanceCache.set(materialName, materials)
    return materials
  }

  // Standard single material
  let material = null

  if (config.type === 'arrow') {
    material = createArrowMaterial(config.color)
    if (config.side !== undefined) {
      material.side = config.side
    }
  } else if (config.type === 'standard') {
    material = createStandardMaterial({
      name: materialName,
      ...config
    })
  } else {
    console.warn(`Unknown material type for material ${materialName}: ${config.type}`)
    material = new THREE.MeshStandardMaterial({
      name: `${materialName}_fallback`,
      color: 0xffffff
    })
  }

  // Cache the material instance
  if (material) {
    materialInstanceCache.set(materialName, material)
  }

  return material
}

/**
 * Applies materials to all meshes in a GLB scene
 * This function traverses the scene and applies materials based on mesh names
 * @param {THREE.Scene|THREE.Object3D} scene - The GLB scene or object to process
 * @param {Object} options - Options for material application
 * @param {boolean} options.overrideExisting - Whether to override existing materials (default: true)
 * @param {Function} options.materialCallback - Optional callback for each mesh (mesh, material) => void
 * @returns {Object} Map of mesh names to applied materials
 */
export function applyMaterialsToScene(scene, options = {}) {
  const {
    overrideExisting = true,
    materialCallback = null
  } = options

  const appliedMaterials = new Map()

  if (!scene) {
    console.warn('No scene provided to applyMaterialsToScene')
    return appliedMaterials
  }

  // Collect meshes that need dual-sided treatment
  const dualSidedMeshes = []
  
  scene.traverse((child) => {
    if (child.isMesh) {
      const meshName = child.name || 'unnamed_mesh'
      
      // Skip if material already exists and we're not overriding
      if (!overrideExisting && child.material) {
        return
      }

      // Create material for this mesh
      const material = createMaterialForMesh(meshName)
      
      if (material) {
        // Check if this is a dual-sided material (array of materials)
        if (Array.isArray(material) && material.length === 2) {
          console.log(`Found dual-sided material for mesh: ${meshName}`, material)
          // Store for dual-sided processing
          dualSidedMeshes.push({ mesh: child, meshName, materials: material })
        } else {
          // Single material - apply directly
          child.material = material
          appliedMaterials.set(meshName, material)
          
          // Call optional callback
          if (materialCallback) {
            materialCallback(child, material)
          }
        }
      } else {
        console.warn(`No material created for mesh: ${meshName}`)
      }
    }
  })
  
  // Process dual-sided meshes by creating separate front/back meshes
  console.log(`Processing ${dualSidedMeshes.length} dual-sided meshes`)
  dualSidedMeshes.forEach(({ mesh, meshName, materials }) => {
    const [frontMaterial, backMaterial] = materials
    console.log(`Creating dual-sided mesh for: ${meshName}`, { frontMaterial, backMaterial })
    
    // Set the front material on the original mesh
    mesh.material = frontMaterial
    // Keep original name so morph target lookups still work
    // The back mesh will be a child, so it won't interfere
    
    // Create back mesh with same geometry and back material
    const backMesh = new THREE.Mesh(mesh.geometry, backMaterial)
    backMesh.name = `${meshName}_back`
    
    // Initialize morph targets on back mesh if the geometry has them
    if (mesh.geometry.morphAttributes && mesh.geometry.morphAttributes.position) {
      const morphTargetCount = mesh.geometry.morphAttributes.position.length
      if (morphTargetCount > 0) {
        // Initialize morphTargetInfluences array on back mesh
        backMesh.morphTargetInfluences = new Array(morphTargetCount).fill(0)
        // Copy morphTargetDictionary from front mesh (they share the same geometry)
        if (mesh.morphTargetDictionary) {
          backMesh.morphTargetDictionary = mesh.morphTargetDictionary
        }
        console.log(`Initialized ${morphTargetCount} morph targets on back mesh for ${meshName}`)
      }
    }
    
    // Store reference to back mesh on front mesh for easy access
    mesh.userData.dualSidedBackMesh = backMesh
    
    // Add back mesh as child of front mesh (like the example: plane.add(plane2))
    mesh.add(backMesh)
    
    appliedMaterials.set(meshName, materials)
    
    // Call optional callback for the mesh
    if (materialCallback) {
      materialCallback(mesh, materials)
    }
  })

  return appliedMaterials
}

/**
 * Preloads all textures defined in MATERIAL_CONFIG
 * Call this early in your app to preload textures
 */
export function preloadAllTextures() {
  Object.values(MATERIAL_CONFIG).forEach((config) => {
    if (config.type === 'standard') {
      const texturePaths = [
        config.diffuseMap,
        config.normalMap,
        config.roughnessMap,
        config.metalnessMap,
        config.aoMap
      ].filter(Boolean)

      texturePaths.forEach((path) => {
        if (!textureCache.has(path)) {
          loadTexture(path)
        }
      })
    }
  })
}

/**
 * Gets the material configuration for a specific mesh
 * @param {string} meshName - Name of the mesh
 * @returns {Object|null} Material configuration or null
 */
export function getMaterialConfig(meshName) {
  const materialMapping = meshToMaterialMap.get(meshName)
  return materialMapping ? materialMapping.config : null
}

/**
 * Gets the material name for a specific mesh
 * @param {string} meshName - Name of the mesh
 * @returns {string|null} Material name or null
 */
export function getMaterialNameForMesh(meshName) {
  const materialMapping = meshToMaterialMap.get(meshName)
  return materialMapping ? materialMapping.materialName : null
}

/**
 * Updates the material configuration (useful for runtime updates)
 * @param {string} materialName - Name of the material (not mesh name)
 * @param {Object} config - New material configuration (must include meshes array)
 */
export function updateMaterialConfig(materialName, config) {
  if (!config.meshes || !Array.isArray(config.meshes)) {
    console.warn(`Material config for ${materialName} must include a 'meshes' array`)
    return
  }

  MATERIAL_CONFIG[materialName] = config
  // Rebuild the lookup map
  buildMeshToMaterialMap()
  // Clear material cache so new materials are created with updated config
  materialInstanceCache.clear()
}

/**
 * Adds a new material configuration
 * @param {string} materialName - Name of the material
 * @param {Object} config - Material configuration (must include meshes array)
 */
export function addMaterialConfig(materialName, config) {
  updateMaterialConfig(materialName, config)
}

/**
 * Gets all mesh names that use a specific material
 * @param {string} materialName - Name of the material
 * @returns {string[]} Array of mesh names
 */
export function getMeshesForMaterial(materialName) {
  const config = MATERIAL_CONFIG[materialName]
  return config && config.meshes ? [...config.meshes] : []
}

// Export the configuration for external access
export { MATERIAL_CONFIG }

