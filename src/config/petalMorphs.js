// Morph target configuration for petal varieties
// Maps morph target names (from GLB model) to display names and images

/**
 * Configuration for each morph target
 * Add your custom display name and image path for each variety
 */
export const MORPH_CONFIG = {
    'Alata': {
        displayName: 'Pale Pitcher Plant',
        subtitle: 'Sarracenia alata',
        image: '/images/alata_alancressler.webp'
    },
    'Flava': {
        displayName: 'Yellow Pitcher Plant',
        subtitle: 'Sarracenia flava',
        image: '/images/flava_brucesorrie.webp'
    },
    'Leucophylla': {
        displayName: 'White Pitcher Plant',
        subtitle: 'Sarracenia leucophylla',
        image: '/images/rubrarubra_alancressler.webp'
    },
    'Minor': {
        displayName: 'Hooded Pitcher Plant',
        subtitle: 'Sarracenia minor',
        image: '/images/purpureavenosa_alancressler.webp'
    },
    'Oreophila': {
        displayName: 'Green Pitcher Plant',
        subtitle: 'Sarracenia oreophila',
        image: '/images/alata_alancressler.webp'
    },
    'Psittacina': {
        displayName: 'Parrot Pitcher Plant',
        subtitle: 'Sarracenia psittacina',
        image: '/images/rubrarubra_alancressler.webp'
    },
    'PurpureaPurpurea': {
        displayName: 'Northern Purple Pitcher Plant',
        subtitle: 'Sarracenia purpurea ssp. purpurea',
        image: '/images/purpureavenosa_alancressler.webp'
    },
    'PurpureaVenosa': {
        displayName: 'Purple Pitcher Plant',
        subtitle: 'Sarracenia purpurea ssp. venosa',
        image: '/images/purpureavenosa_alancressler.webp'
    },
    'RubraAlabamensis': {
        displayName: 'Alabama Canebrake Pitcher Plant',
        subtitle: 'Sarracenia rubra ssp. alabamensis',
        image: '/images/alata_alancressler.webp'
    },
    'RubraGulfensis': {
        displayName: 'Gulf Coast Pitcher Plant',
        subtitle: 'Sarracenia rubra ssp. Gulfensis',
        image: '/images/rubrarubra_alancressler.webp'
    },
    'RubraJonesii': {
        displayName: 'Mountain Sweet Pitcher Plant',
        subtitle: 'Sarracenia Rubra ssp. Jonesii',
        image: '/images/rubrarubra_alancressler.webp'
    },
    'RubraJonesiiViridescens': {
        displayName: 'Mountain Sweet Pitcher Plant all green',
        subtitle: 'Sarracenia Rubra ssp. Jonesii f. Viridescens',
        image: '/images/rubrarubra_alancressler.webp'
    },
    'RubraRubra': {
        displayName: 'Sweet Pitcher Plant',
        subtitle: 'Sarracenia Rubra var. Rubra',
        image: '/images/rubrarubra_alancressler.webp'
    },
    'RubraWherryi': {
        displayName: 'Wherry\'s pitcher plant',
        subtitle: 'Sarracenia Rubra ssp. Wherryi',
        image: '/images/alata_alancressler.webp'
    },
    // Add more morph targets as needed - use exact names from your GLB model
}

/**
 * Gets the configuration for a morph target
 * @param {string} name - The morph target name from the GLB model
 * @returns {object|null} - Configuration object or null if not found
 */
export const getMorphConfig = (name) => {
    return MORPH_CONFIG[name] || null
}

/**
 * Gets the image path for a morph target
 * @param {string} name - The morph target name
 * @returns {string|null} - Image path or null if not found
 */
export const getMorphImage = (name) => {
    const config = getMorphConfig(name)
    return config?.image || null
}

/**
 * Gets the display name for a morph target
 * @param {string} name - The morph target name
 * @returns {string} - Display name or formatted fallback
 */
export const getMorphDisplayName = (name) => {
    const config = getMorphConfig(name)
    return config?.displayName || formatMorphName(name)
}

/**
 * Gets the subtitle for a morph target
 * @param {string} name - The morph target name
 * @returns {string|null} - Subtitle or null if not found
 */
export const getMorphSubtitle = (name) => {
    const config = getMorphConfig(name)
    return config?.subtitle || null
}

/**
 * Formats a morph target name for display (fallback)
 * Converts camelCase/PascalCase to readable format
 */
const formatMorphName = (name) => {
    if (!name) return ''
    const formatted = name.replace(/([A-Z])/g, ' $1').trim()
    return `S. ${formatted}`
}

