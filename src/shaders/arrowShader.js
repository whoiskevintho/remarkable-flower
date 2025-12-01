import * as THREE from 'three'

// Vertex shader - simple pass-through
const vertexShader = `
  varying vec2 vUv;
  
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

// Fragment shader - green arrow moving up in UV space
const fragmentShader = `
  uniform float uTime;
  varying vec2 vUv;
  
  void main() {
    vec2 uv = vUv;
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
    
    vec3 green = vec3(0.0, 1.0, 0.0);
    gl_FragColor = vec4(green * arrow, arrow);
  }
`

export function createArrowMaterial() {
  return new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime: { value: 0.0 }
    },
    transparent: true,
    depthWrite: false
  })
}

