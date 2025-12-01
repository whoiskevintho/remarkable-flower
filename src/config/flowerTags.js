// Tag configuration for flower parts
// Positions are relative multipliers that will be scaled by safeDistance
// Original positions were calibrated with safeDistance ~1000, so divide by 1000 to get multipliers
export const flowerTags = [
  {
    label: 'Scape',
    color: 'rgba(0, 0, 0, 1)',
    position: [0.2, 0.25, 0], // Relative to safeDistance
    modelPoint: [-0.05, 0.46, -0.08], // 3D point on the model (in model's local space, will be scaled by size)
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
    position: [-0.13, 0.2, 0], // Relative to safeDistance
    modelPoint: [0.08, 0.3, -0.05], // 3D point on the model
    showStart: 0.2,
    showEnd: 0.25,
    fadeOutStart: 0.35,
    fadeOutEnd: 0.4,
    flip: 'none',
    shortenBy: 0.18
  },
  {
    label: 'Sepal',
    color: 'rgba(0, 0, 0, 1)',
    position: [-0.3, 0.15, -0.002], // Relative to safeDistance
    modelPoint: [0.24, 0.1, -0.78], // 3D point on the model
    showStart: 0.2,
    showEnd: 0.25,
    fadeOutStart: 0.35,
    fadeOutEnd: 0.4,
    flip: 'none'
  },
  {
    label: 'Ovary',
    color: 'rgba(0, 0, 0, 1)',
    position: [-0.32, 0.02, -0.002], // Relative to safeDistance
    modelPoint: [-0.05, 0.16, -0.18], // 3D point on the model
    showStart: 0.2,
    showEnd: 0.25,
    fadeOutStart: 0.35,
    fadeOutEnd: 0.4,
    flip: 'none'
  },
  {
    label: 'Style',
    color: 'rgba(0, 0, 0, 1)',
    position: [-0.32, -0.03, -0.002], // Relative to safeDistance
    modelPoint: [0.32, -0.36, -0.71], // 3D point on the model
    showStart: 0.2,
    showEnd: 0.25,
    fadeOutStart: 0.35,
    fadeOutEnd: 0.4,
    flip: 'none',
    shortenBy: 0.18
  },
  {
    label: 'Stigma',
    color: 'rgba(0, 0, 0, 1)',
    position: [-0.32, -0.08, -0.002], // Relative to safeDistance
    modelPoint: [0.289, -0.47, -0.9], // 3D point on the model
    showStart: 0.2,
    showEnd: 0.25,
    fadeOutStart: 0.35,
    fadeOutEnd: 0.4,
    flip: 'none',
    shortenBy: 0.18
  },
  {
    label: 'Petal',
    color: 'rgba(0, 0, 0, 1)',
    position: [0.38, -0.28, 0], // Relative to safeDistance
    modelPoint: [-0.81, -0.76, -0.23], // 3D point on the model
    showStart: 0.2,
    showEnd: 0.25,
    fadeOutStart: 0.35,
    fadeOutEnd: 0.4,
    flip: 'none',
    shortenBy: 0.3
  },
  {
    label: 'Filament',
    color: 'rgba(0, 0, 0, 1)',
    position: [0.39, 0, -0.002], // Relative to safeDistance
    modelPoint: [-0.14, 0.12, -0.18], // 3D point on the model
    showStart: 0.2,
    showEnd: 0.25,
    fadeOutStart: 0.35,
    fadeOutEnd: 0.4,
    flip: 'none',
    shortenBy: 0.18
  },
  {
    label: 'Anther',
    color: 'rgba(0, 0, 0, 1)',
    position: [0.39, -0.05, 0], // Relative to safeDistance
    modelPoint: [-0.14, 0.0, -0.18], // 3D point on the model
    showStart: 0.2,
    showEnd: 0.25,
    fadeOutStart: 0.35,
    fadeOutEnd: 0.4,
    flip: 'none',
    shortenBy: 0.12
  }
]

