// Phylogenetic tree data for Sarracenia species
// Format: hierarchical tree structure for d3.hierarchy and d3.cluster

export const cladogramData = {
    "name": "Sarracenia",
    "children": [
        {
            "name": "ENA",
            "children": [
                {
                    "name": "Clade A1",
                    "children": [
                        {
                            "name": "Clade B1",
                            "children": [
                                {
                                    "name": "Clade C1",
                                    "children": [
                                        {
                                            "name": "Clade D1",
                                            "children": [
                                                {
                                                    "name": "Clade E3",
                                                    "children": [
                                                        {
                                                            "name": "Clade F1",
                                                            "children": [
                                                                { "name": "S. oreophila" },
                                                                { "name": "S. alabemensis ssp. alabemensis" }
                                                            ]
                                                        },
                                                        { "name": "S. rubra ssp. gulfensis" }
                                                    ]
                                                },
                                                { "name": "S. alabamensis ssp. wherryi" }
                                            ]
                                        },
                                        {
                                            "name": "Clade D2",
                                            "children": [
                                                {
                                                    "name": "Clade E1",
                                                    "children": [
                                                        { "name": "S. alata" },
                                                        { "name": "S. minor" }
                                                    ]
                                                },
                                                {
                                                    "name": "Clade E2",
                                                    "children": [
                                                        { "name": "S. rubra ssp. rubra" },
                                                        { "name": "S. jonesii" }
                                                    ]
                                                },
                                            ]
                                        },
                                    ]
                                },
                                { "name": "S. leucophylla" }
                            ]
                        },
                        {
                            "name": "Clade B2",
                            "children": [
                                { "name": "S. flava" },
                                { "name": "S. psittacina" }
                            ]
                        }
                    ]
                },
                {
                    "name": "Clade A2 ",
                    "children": [
                        {
                            "name": "Clade B1",
                            "children": [
                                { "name": "S. purpurea ssp. purpurea" },
                                { "name": "S. purpurea ssp. venosa" }
                            ]
                        },
                        { "name": "S. rosea" }
                    ]
                }
            ]
        }
    ]
}

