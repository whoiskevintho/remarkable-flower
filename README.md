# A Remarkable Flower

An interactive web experience exploring the remarkable flowers of Sarracenia. This project combines scroll-controlled 3D visualizations, data-driven charts, and educational narrative to showcase the diversity and beauty of these carnivorous plant flowers.

## Project Overview

This is a React + Vite project that presents an immersive, scroll-driven exploration of Sarracenia flowers. The experience includes:

- **Interactive 3D Models**: Scroll-controlled 3D flower models with morph targets showing different species variations
- **Data Visualizations**: Multiple charts exploring flower morphology, scent characteristics, and geographic relationships
- **Educational Narrative**: A comprehensive guide to Sarracenia flowers, from pollination mechanisms to petal diversity
- **Image Galleries**: Curated photographs of various Sarracenia species and hybrids

### Key Features

- **Sticky Scroll Sections**: 3D models that animate and morph as you scroll
- **Interactive Morph Targets**: Explore different Sarracenia species through interactive 3D petal models
- **Cladogram**: Phylogenetic visualization of Sarracenia relationships
- **Data Charts**: 
  - Smell strength comparison across species
  - Flower size vs. latitude relationships
  - Parallel coordinates chart for petal measurements
  - Radar charts for petal morphology
- **Responsive Design**: Optimized for desktop viewing with touch device warnings

## How the Sticky Container Works

### Overview

The sticky container creates a scroll-controlled 3D scene where a 3D model (GLB file) appears and animates as you scroll through a designated section of the page. The model's visibility and animation are synchronized with the scroll position.

### Key Components

#### 1. **StickyContainer** (CSS)

```css
.StickyContainer {
  height: 500vh;  /* 500% of viewport height = 5 full screens of scroll */
  position: relative; /* IMPORTANT! */
}
```

**Purpose**: Creates a tall container that provides the scroll space for the sticky effect.

- **Height**: `500vh` means the container is 5 times the viewport height
- This determines how long you need to scroll before the sticky section completes
- **Position relative**: Required for the sticky positioning to work correctly

**To adjust scroll duration**: Change the `height` value:
- `300vh` = 3 screens of scroll (shorter)
- `500vh` = 5 screens of scroll (current)
- `1000vh` = 10 screens of scroll (longer)

#### 2. **SomeStickyContent** (CSS)

```css
.SomeStickyContent {
  position: sticky;
  top: 15vh;  /* Sticks 15% from top of viewport */
  height: 70vh;
}
```

**Purpose**: The element that "sticks" to the viewport while scrolling.

- **Position sticky**: Makes the element stick to the viewport during scroll
- **Top: 15vh**: The element sticks 15% from the top of the viewport
- **Height: 70vh**: The sticky element takes up 70% of the viewport height

**How it works**:
1. As you scroll down, the sticky element enters the viewport
2. Once it reaches `top: 15vh`, it "sticks" in place
3. It remains stuck while the parent container (500vh) scrolls past
4. The 3D model tracks this sticky element's position

#### 3. **StickyScrollScene** (React Component)

```jsx
<StickyScrollScene track={el}>
  {(props) => (
    <SpinningModel {...props} />
  )}
</StickyScrollScene>
```

**Purpose**: Tracks the sticky element and provides scroll state to child components.

**Props provided to children**:
- `inViewport`: Boolean - true when the tracked element is visible
- `scrollState.progress`: Number (0-1) - progress through the scroll container
- `scale`: Object - viewport scale information

**How it works**:
- Tracks the element referenced by `el` (the sticky div)
- Monitors when it enters/exits the viewport
- Calculates scroll progress through the container
- Passes this data to child components for animation

#### 4. **SpinningModel** (React Component)

```jsx
function SpinningModel({ scale, scrollState, inViewport }) {
  const spring = useSpring({
    scale: inViewport ? size : size * 0.0,
    config: inViewport ? config.wobbly : config.stiff
  })
  
  useFrame(() => {
    modelRef.current.rotation.y = scrollState.progress * Math.PI * 2
  })
}
```

**Purpose**: Renders and animates the 3D model based on scroll state.

**Animation logic**:
- **Scale**: Model scales from 0 to full size when `inViewport` becomes true
- **Rotation**: Model rotates based on `scrollState.progress` (0-1 maps to 0-2π)
- **Visibility**: Model is invisible (scale 0) until it enters the viewport

### Scroll Flow

1. **Initial State**: Model is scaled to 0 (invisible)
2. **User Scrolls**: Through content above the sticky section
3. **Sticky Element Enters Viewport**: `inViewport` becomes `true`
4. **Model Appears**: Spring animation scales model from 0 to full size
5. **Continued Scrolling**: Model rotates as `scrollState.progress` increases
6. **Container Scrolls**: The 500vh container provides scroll space
7. **Sticky Element Exits**: `inViewport` becomes `false`, model scales back to 0

### Section Spacing

```css
section {
  margin: 14vw 0 14vw;  /* Adds space before and after each section */
}
```

Each section has vertical margins that add scroll distance, creating spacing between content sections.

### Adjusting the Scroll Experience

#### Make model appear sooner:
1. **Reduce container height**: Change `500vh` to `300vh` or `200vh`
2. **Adjust sticky top position**: Change `top: 15vh` to `top: 0vh` or `top: 5vh`
3. **Reduce section margins**: Change `margin: 14vw` to `margin: 5vw`

#### Make scroll longer:
1. **Increase container height**: Change `500vh` to `800vh` or `1000vh`
2. **Increase section margins**: Change `margin: 14vw` to `margin: 20vw`

#### Change animation timing:
- Modify the spring config in `SpinningModel`
- Adjust the `delay` in `useSpring` (currently removed for immediate appearance)
- Change the scale calculation: `size * 0.0` to `size * 0.5` for partial visibility

### File Structure

```
src/
  components/
    HeroSection.jsx              # Hero section with title
    IntroSection.jsx             # Introduction to carnivorous plants
    StickySection.jsx            # Main 3D flower model sticky section
    BodySection.jsx              # Cladogram and smell strength charts
    PetalsSection.jsx            # Interactive 3D petal morphing section
    FinalSection.jsx              # Petal measurements and final content
    MethodsSection.jsx            # References and methodology
    Cladogram.jsx                 # Phylogenetic tree visualization
    SmellStrengthChart.jsx        # Scent comparison chart
    FlowerSizeLatitudeChart.jsx   # Geographic size analysis
    ParallelCoordinatesChart.jsx  # Multi-dimensional petal data
    PetalSizeRadarChart.jsx       # Radar chart for petal morphology
    PetalDiagramSection.jsx       # Petal measurement diagram
    ImageGallery.jsx              # Image gallery component
    ImageModal.jsx                # Image modal viewer
    Header.jsx                    # Page header
    TouchDeviceWarning.jsx        # Touch device compatibility warning
  config/
    cladogramData.js             # Phylogenetic data
    cladogramImages.js           # Species images for cladogram
    petalSizes.js                # Petal measurement data
    petalMorphs.js               # Morph target configurations
    flowerSizeLatitudeData.js    # Geographic size data
    smellData.js                 # Scent characteristics data
    flowerTags.js                # Species tagging data
  shaders/
    flowerMaterials.js           # 3D flower material definitions
    petalMaterials.js            # 3D petal material and texture handling
    arrowShader.js               # Custom shader for arrows
  hooks/
    useFadeOut.js                # Fade out animation hook
  App.jsx                        # Main app with SmoothScrollbar
  index.css                      # Global styles
  Logo.jsx                       # 14islands logo component
```

## Dependencies & Repositories

### Core 3D & Animation Libraries

- **`@14islands/r3f-scroll-rig`** (v8.14.0): Scroll-rig library for scroll-controlled 3D scenes, providing smooth scroll integration with React Three Fiber
- **`@react-three/fiber`** (v8.13.4): React renderer for Three.js, enabling declarative 3D graphics
- **`@react-three/drei`** (v9.78.1): Useful helpers for react-three/fiber (useGLTF, Environment, etc.)
- **`three`** (v0.154.0): Core 3D graphics library
- **`@react-spring/three`** (v9.5.4): Spring animations for 3D objects
- **`@react-spring/web`** (v9.5.4): Spring animations for web elements

### Data Visualization

- **`d3`** (v7.9.0): Data visualization library used for custom chart implementations
- **`recharts`** (v3.5.1): React charting library for data visualizations

### UI & Animation

- **`framer-motion`** (v9.0.2): Animation library for React components
- **`react`** (v18.2.0): React framework
- **`react-dom`** (v18.2.0): React DOM renderer

### Development Tools

- **`vite`** (rolldown-vite@7.2.5): Build tool and development server
- **`@vitejs/plugin-react`**: Vite plugin for React support
- **`eslint`**: Code linting

## Methods

### Data Sources

The project draws from several scientific sources for species data, measurements, and phylogenetic information:

**Primary Reference:**
- McPherson, S., & Schnell, D. (2011). *Sarraceniaceae of North America*. Redfern Natural History Productions.

**Phylogenetic Data:**
- Ellison, Aaron M., et al. "Phylogeny and Biogeography of the Carnivorous Plant Family Sarraceniaceae." *PLOS ONE*, vol. 7, no. 6, 2012, e39291. [Source](https://doi.org/10.1371/journal.pone.0039291)

**Species Recognition:**
- Naczi, Robert F. C., et al. "Sarracenia rosea (Sarraceniaceae), a New Species of Pitcher Plant from the Southeastern United States." *SIDA, Contributions to Botany*, vol. 18, 1999, pp. 1188–1191. [Source](https://www.biodiversitylibrary.org/part/163260)

**Additional Resources:**
- International Carnivorous Plant Society – Evolution of the Ericales Carnivores [Source](https://www.carnivorousplants.org/cp/evolution/Ericales)

### Species Nomenclature Notes

Schnell & McPherson's 2011 monograph served as a primary source for this study, recognizing approximately 8 species of Sarracenia. Since publication, additional species have been recognized based on further research, including:

- *S. rosea*
- *S. jonesii*
- *S. alabamensis*
- *S. alabamensis ssp. wherryi*

The nomenclature used in this project has been updated to reflect these additional species. Petal measurements and morphological data are based on averages from wild Sarracenia populations as documented in Schnell & McPherson (2011).

### Data Visualization Methods

- **Petal Measurements**: Normalized measurements from wild populations, accurately scaled relative to each other
- **Morphological Comparisons**: Data-driven visualizations comparing petal shapes, sizes, and characteristics across species
- **Geographic Analysis**: Flower size relationships with latitude based on species distribution data
- **Phylogenetic Visualization**: Cladogram based on molecular phylogenetic studies

## Technical Implementation

### Key Concepts

1. **Sticky Positioning**: The sticky element stays in view while its container scrolls
2. **Scroll Tracking**: The scroll-rig library tracks the sticky element's position
3. **Progress Mapping**: Scroll progress (0-1) maps to animation values (rotation, scale, etc.)
4. **Viewport Detection**: `inViewport` triggers visibility changes
5. **Container Height**: Taller containers = longer scroll duration

## Repository

This project is available on GitHub: [remarkable-flower](https://github.com/whoiskevintho/remarkable-flower)

## Related Projects

- [Carnivorous Plant Mapping](https://carnivorous-plant-mapping.vercel.app/) - Interactive map exploring the distribution of Sarracenia species across North America
