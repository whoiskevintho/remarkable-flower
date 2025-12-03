// Morph target configuration for petal varieties
// Maps morph target names (from GLB model) to display names and images

/**
 * Configuration for each morph target
 * Add your custom display name and image path for each variety
 */
export const MORPH_CONFIG = {
    'PurpureaPurpurea': {
        displayName: 'Northern Purple Pitcher Plant',
        subtitle: 'Sarracenia purpurea ssp. purpurea',
        image: '/images/purpureapurpurea_smithrw.webp',
        caption: {
            photographer: 'Smith, R. W.',
            link: 'https://www.wildflower.org/gallery/result.php?id_image=30780'
        }
    },
    'Alata': {
        displayName: 'Pale Pitcher Plant',
        subtitle: 'Sarracenia alata',
        image: '/images/alata_alancressler.webp',
        caption: {
            photographer: 'Alan Cressler',
            link: 'https://flic.kr/p/2jmZidJ'
        }
    },
    'Flava': {
        displayName: 'Yellow Pitcher Plant',
        subtitle: 'Sarracenia flava',
        image: '/images/flava_brucesorrie.webp',
        caption: {
            photographer: 'Bruce Sorrie',
            link: 'https://fsus.ncbg.unc.edu/show-taxon-detail.php?taxonid=4610'
        }
    },
    'Leucophylla': {
        displayName: 'White Pitcher Plant',
        subtitle: 'Sarracenia leucophylla',
        image: '/images/leucophylla_alancressler.webp',
        caption: {
            photographer: 'Alan Cressler',
            link: 'https://flic.kr/p/bvgLe7'
        }
    },
    'RubraRubra': {
        displayName: 'Sweet Pitcher Plant',
        subtitle: 'Sarracenia rubra var. rubra',
        image: '/images/rubrarubra_alancressler.webp',
        caption: {
            photographer: 'Alan Cressler',
            link: 'https://flic.kr/p/nuSezp'
        }
    },
    'Minor': {
        displayName: 'Hooded Pitcher Plant',
        subtitle: 'Sarracenia minor',
        image: '/images/minor_alancressler.webp',
        caption: {
            photographer: 'Scott Ward',
            link: 'https://fsus.ncbg.unc.edu/main.php?pg=show-taxon.php&&plantname=sarracenia&limit=1&offset=8&taxonid=4613'
        }
    },
    'Psittacina': {
        displayName: 'Parrot Pitcher Plant',
        subtitle: 'Sarracenia psittacina',
        image: '/images/psittacina_scottward.webp',
        caption: {
            photographer: 'Scott Ward',
            link: 'https://fsus.ncbg.unc.edu/main.php?pg=show-taxon.php&&plantname=sarracenia&limit=1&offset=11&taxonid=4616'
        }
    },
    'PurpureaVenosa': {
        displayName: 'Burk\'s Southern Pitcher Plant',
        subtitle: 'Sarracenia rosea',
        image: '/images/rosea_alancressler.webp',
        caption: {
            photographer: 'Alan Cressler',
            link: 'https://flic.kr/p/rrV7QA'
        }
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
 * Gets the caption for a morph target
 * @param {string} name - The morph target name
 * @returns {string|null} - Caption or null if not found
 */
export const getMorphCaption = (name) => {
    const config = getMorphConfig(name)
    return config?.caption || null
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

