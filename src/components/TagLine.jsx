import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'

function TagLine({ 
  startPoint,
  endPoint,
  scrollState,
  showStart = 0,
  showEnd = 1,
  fadeOutStart = 0.9,
  fadeOutEnd = 1,
  color = 'rgba(0, 0, 0, 0.5)',
  lineWidth = 2
}) {
  const lineRef = useRef()
  const currentOpacityRef = useRef(0)
  
  const points = useMemo(() => {
    if (!startPoint || !endPoint) return [[0, 0, 0], [0, 0, 0]]
    return [startPoint, endPoint]
  }, [startPoint, endPoint])
  
  useFrame(() => {
    if (!lineRef.current || !scrollState) return
    
    const progress = scrollState.progress
    let targetOpacity = 0
    
    if (progress >= showStart && progress <= fadeOutEnd) {
      if (progress < showEnd) {
        targetOpacity = (progress - showStart) / (showEnd - showStart)
      } else if (progress < fadeOutStart) {
        targetOpacity = 1
      } else {
        targetOpacity = 1 - (progress - fadeOutStart) / (fadeOutEnd - fadeOutStart)
      }
    }
    
    // Smooth opacity transition
    const diff = targetOpacity - currentOpacityRef.current
    currentOpacityRef.current += diff * 0.15
    
    // Update material opacity
    if (lineRef.current.material) {
      lineRef.current.material.opacity = currentOpacityRef.current
    }
  })
  
  return (
    <Line
      ref={lineRef}
      points={points}
      color={color}
      transparent
      lineWidth={lineWidth}
      opacity={0}
    />
  )
}

export default TagLine

