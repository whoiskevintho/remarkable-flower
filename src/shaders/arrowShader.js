import * as THREE from 'three'

// Vertex shader - simple pass-through
const vertexShader = `
  varying vec2 vUv;
  
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

// Fragment shader - arrow moving up in UV space with customizable color
const fragmentShader = `
  uniform float uTime;
  uniform float uScrollProgress;
  uniform float uScale;
  uniform vec3 uColor;
  varying vec2 vUv;
  
  void main() {
    vec2 uv = vUv;
    
    // Scale only U (horizontal) coordinate around center (0.5)
    // uScale is calculated in JavaScript based on scroll progress
    float centerX = 0.5;
    uv.x = (uv.x - centerX) / uScale + centerX;
    
    uv.y = fract(uv.y + uTime * 0.5);
    uv.y = 1.0 - uv.y;
    
    float arrowBody = step(0.45, uv.x) * step(uv.x, 0.55) * step(0.0, uv.y) * step(uv.y, 0.5);
    
    float arrowHead = 0.0;
    if (uv.y > 0.5 && uv.y < 0.7 && uv.x > 0.3 && uv.x < 0.7) {
      float yInTriangle = (uv.y - 0.5) / 0.2;
      if (uv.x < 0.5) {
        if (uv.x > 0.3 + yInTriangle * 0.2) {
          arrowHead = 1.0;
        }
      } else {
        if (uv.x < 0.7 - yInTriangle * 0.2) {
          arrowHead = 1.0;
        }
      }
    }
    
    float arrow = max(arrowBody, arrowHead);
    
    if (arrow < 0.01) {
      discard;
    }
    
    gl_FragColor = vec4(uColor * arrow, arrow);
  }
`

export function createArrowMaterial(color = { r: 0.0, g: 1.0, b: 0.0 }) {
  return new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime: { value: 0.0 },
      uScrollProgress: { value: 0.0 },
      uScale: { value: 1.0 },
      uColor: { value: new THREE.Vector3(color.r, color.g, color.b) }
    },
    transparent: true,
    depthWrite: false
  })
}

