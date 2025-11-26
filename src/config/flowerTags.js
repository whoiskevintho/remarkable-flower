// Tag configuration for flower parts
// Positions are relative multipliers that will be scaled by safeDistance
// Original positions were calibrated with safeDistance ~1000, so divide by 1000 to get multipliers
export const flowerTags = [
  {
    label: 'Scape',
    color: 'rgba(0, 0, 0, 1)',
    position: [0.2, 0.15, 0], // Relative to safeDistance
    modelPoint: [0, 0.1, 0], // 3D point on the model (in model's local space, will be scaled by size)
    showStart: 0.2,
    showEnd: 0.25,
    fadeOutStart: 0.35,
    fadeOutEnd: 0.4,
    flip: 'none',
    shortenBy: 0.15 // Optional: shorten line by this percentage (default: 0.15)
  },
  {
    label: 'Bract',
    color: 'rgba(0, 0, 0, 1)',
    position: [-0.13, 0.13, 0], // Relative to safeDistance
    modelPoint: [-0.05, 0.08, 0], // 3D point on the model
    showStart: 0.2,
    showEnd: 0.25,
    fadeOutStart: 0.35,
    fadeOutEnd: 0.4,
    flip: 'none'
  },
  {
    label: 'Sepal',
    color: 'rgba(0, 0, 0, 1)',
    position: [-0.25, 0.05, -0.002], // Relative to safeDistance
    modelPoint: [-0.1, 0.02, -0.001], // 3D point on the model
    showStart: 0.2,
    showEnd: 0.25,
    fadeOutStart: 0.35,
    fadeOutEnd: 0.4,
    flip: 'none'
  },
  {
    label: 'Ovary',
    color: 'rgba(0, 0, 0, 1)',
    position: [-0.3, -0.05, -0.002], // Relative to safeDistance
    modelPoint: [-0.12, -0.02, -0.001], // 3D point on the model
    showStart: 0.2,
    showEnd: 0.25,
    fadeOutStart: 0.35,
    fadeOutEnd: 0.4,
    flip: 'none'
  },
  {
    label: 'Style',
    color: 'rgba(0, 0, 0, 1)',
    position: [-0.3, -0.1, -0.002], // Relative to safeDistance
    modelPoint: [-0.12, -0.04, -0.001], // 3D point on the model
    showStart: 0.2,
    showEnd: 0.25,
    fadeOutStart: 0.35,
    fadeOutEnd: 0.4,
    flip: 'none'
  },
  {
    label: 'Stigma',
    color: 'rgba(0, 0, 0, 1)',
    position: [-0.3, -0.15, -0.002], // Relative to safeDistance
    modelPoint: [-0.12, -0.06, -0.001], // 3D point on the model
    showStart: 0.2,
    showEnd: 0.25,
    fadeOutStart: 0.35,
    fadeOutEnd: 0.4,
    flip: 'none'
  },
  {
    label: 'Petals',
    color: 'rgba(0, 0, 0, 1)',
    position: [0.35, -0.28, 0], // Relative to safeDistance
    modelPoint: [0.15, -0.12, 0], // 3D point on the model
    showStart: 0.2,
    showEnd: 0.25,
    fadeOutStart: 0.35,
    fadeOutEnd: 0.4,
    flip: 'none'
  },
  {
    label: 'Filament',
    color: 'rgba(0, 0, 0, 1)',
    position: [0.35, 0, -0.002], // Relative to safeDistance
    modelPoint: [0.15, 0, -0.001], // 3D point on the model
    showStart: 0.2,
    showEnd: 0.25,
    fadeOutStart: 0.35,
    fadeOutEnd: 0.4,
    flip: 'none',
    shortenBy: 0.25
  },
  {
    label: 'Anther',
    color: 'rgba(0, 0, 0, 1)',
    position: [0.35, -0.05, 0], // Relative to safeDistance
    modelPoint: [0.15, -0.02, 0], // 3D point on the model
    showStart: 0.2,
    showEnd: 0.25,
    fadeOutStart: 0.35,
    fadeOutEnd: 0.4,
    flip: 'none'
  }
]

