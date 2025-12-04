// Image mapping for cladogram species
// Maps species names to image paths, photographer, and source links

export const cladogramImageMap = {
  'S. oreophila': {
    image: '/images/oreophilla_pitcher_barryrice.webp',
    caption: {
      photographer: 'Barry Rice',
      link: 'https://calphotos.berkeley.edu/cgi/img_query?enlarge=0000+0000+0609+2515'
    }
  },
  'S. alabemensis ssp. alabemensis': {
    image: '/images/alabamensis_pitcher_alancressler.webp',
    caption: {
      photographer: 'Alan Cressler',
      link: 'https://flic.kr/p/TzGLE3'
    }
  },
  'S. rubra ssp. gulfensis': {
    image: '/images/gulfensis_pitcher_barryrice.webp',
    caption: {
      photographer: 'Barry Rice',
      link: 'https://calphotos.berkeley.edu/cgi/img_query?seq_num=287815&one=T'
    }
  },
  'S. alabamensis ssp. wherryi': {
    image: '/images/wherryi_pitcher_alancressler.webp',
    caption: {
      photographer: 'Alan Cressler',
      link: 'https://flic.kr/p/2jPSFuV'
    }
  },
  'S. alata': {
    image: '/images/alata_pitcher_barryrice.webp',
    caption: {
      photographer: 'Barry Rice',
      link: 'https://calphotos.berkeley.edu/cgi/img_query?enlarge=0000+0000+0609+2304'
    }
  },
  'S. minor': {
    image: '/images/minor_pitcher_alancressler.webp',
    caption: {
      photographer: 'Alan Cressler',
      link: 'https://flic.kr/p/n5DtkP'
    }
  },
  'S. rubra ssp. rubra': {
    image: '/images/rubra_pitcher_barryrice.webp',
    caption: {
      photographer: 'Barry rice',
      link: 'https://calphotos.berkeley.edu/cgi/img_query?seq_num=287818&one=T'
    }
  },
  'S. jonesii': {
    image: '/images/jonesii_pitcher_alancressler.webp',
    caption: {
      photographer: 'Alan Cressler',
      link: 'https://flic.kr/p/86ZKKQ'
    }
  },
  'S. leucophylla': {
    image: '/images/leucophylla_white_alancressler.webp',
    caption: {
      photographer: 'Alan Cressler',
      link: 'https://flic.kr/p/2hng622'
    }
  },
  'S. flava': {
    image: '/images/flava_pitcher_tysmith.webp',
    caption: {
      photographer: 'tysmith - iNaturalist',
      link: 'https://www.inaturalist.org/photos/140692324'
    }
  },
  'S. psittacina': {
    image: '/images/psittacina_pitcher_triiothyrocide.webp',
    caption: {
      photographer: 'triiothyrocide - iNaturalist',
      link: 'https://www.inaturalist.org/observations/289877706'
    }
  },
  'S. purpurea ssp. purpurea': {
    image: '/images/purpurea_pitcher_hungry-sarracenia.webp',
    caption: {
      photographer: 'hungry-sarracenia - iNaturalist',
      link: 'https://www.inaturalist.org/observations/304022870'
    }
  },
  'S. purpurea ssp. venosa': {
    image: '/images/venosa_pitcher_alancressler.webp',
    caption: {
      photographer: 'Alan Cressler',
      link: 'https://flic.kr/p/7aNCJ5'
    }
  },
  'S. rosea': {
    image: '/images/rosea_pitcher_kylefilicky.webp',
    caption: {
      photographer: 'Kyle Filicky',
      link: 'https://fsus.ncbg.unc.edu/main.php?pg=show-taxon.php&plantname=sarracenia+rosea'
    }
  }
}

// Helper function to get image path for a species
export const getSpeciesImage = (speciesName) => {
  return cladogramImageMap[speciesName]?.image || null
}

// Helper function to get caption info for a species
export const getSpeciesCaption = (speciesName) => {
  return cladogramImageMap[speciesName]?.caption || null
}

