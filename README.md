# Remarkable Flower - Sticky Scroll Scene

A React + Vite project demonstrating a sticky scroll scene with 3D model integration using `@14islands/r3f-scroll-rig`.

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
    StickySection.jsx    # Main sticky section component
    Header.jsx           # Page header
    TouchDeviceWarning.jsx
  App.jsx                # Main app with SmoothScrollbar
  index.css              # Styles including .StickyContainer
```

### Dependencies

- `@14islands/r3f-scroll-rig`: Scroll-rig library for scroll-controlled 3D scenes
- `@react-three/fiber`: React renderer for Three.js
- `@react-three/drei`: Useful helpers for react-three/fiber (useGLTF, Environment)
- `@react-spring/three`: Spring animations for 3D

### Key Concepts

1. **Sticky Positioning**: The sticky element stays in view while its container scrolls
2. **Scroll Tracking**: The scroll-rig library tracks the sticky element's position
3. **Progress Mapping**: Scroll progress (0-1) maps to animation values (rotation, scale, etc.)
4. **Viewport Detection**: `inViewport` triggers visibility changes
5. **Container Height**: Taller containers = longer scroll duration
