import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  progress: number
  speed: number
  path: number
  size: number
  opacity: number
}

export default function DataFlowVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = 300
    const height = 200
    canvas.width = width
    canvas.height = height

    // Define neural network layers
    const layers = [
      { nodes: 4, x: 40 },
      { nodes: 6, x: 100 },
      { nodes: 8, x: 150 },
      { nodes: 6, x: 200 },
      { nodes: 3, x: 260 },
    ]

    // Calculate node positions
    const nodePositions: { x: number; y: number }[][] = layers.map(layer => {
      const positions: { x: number; y: number }[] = []
      const spacing = height / (layer.nodes + 1)
      for (let i = 0; i < layer.nodes; i++) {
        positions.push({ x: layer.x, y: spacing * (i + 1) })
      }
      return positions
    })

    // Initialize particles
    const initParticles = () => {
      particlesRef.current = []
      for (let i = 0; i < 30; i++) {
        particlesRef.current.push({
          x: 0,
          y: 0,
          progress: Math.random(),
          speed: 0.003 + Math.random() * 0.004,
          path: Math.floor(Math.random() * 4),
          size: 1 + Math.random() * 2,
          opacity: 0.3 + Math.random() * 0.5,
        })
      }
    }

    initParticles()

    const animate = () => {
      ctx.clearRect(0, 0, width, height)

      // Draw connections with gradient
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)'
      ctx.lineWidth = 0.5

      for (let l = 0; l < nodePositions.length - 1; l++) {
        const currentLayer = nodePositions[l]
        const nextLayer = nodePositions[l + 1]

        currentLayer.forEach(node => {
          nextLayer.forEach(nextNode => {
            ctx.beginPath()
            ctx.moveTo(node.x, node.y)
            ctx.lineTo(nextNode.x, nextNode.y)
            ctx.stroke()
          })
        })
      }

      // Draw nodes
      nodePositions.forEach((layer, layerIndex) => {
        layer.forEach((node, nodeIndex) => {
          // Node glow
          const gradient = ctx.createRadialGradient(
            node.x, node.y, 0,
            node.x, node.y, 8
          )
          gradient.addColorStop(0, 'rgba(255, 255, 255, 0.2)')
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
          ctx.fillStyle = gradient
          ctx.beginPath()
          ctx.arc(node.x, node.y, 8, 0, Math.PI * 2)
          ctx.fill()

          // Node core
          ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
          ctx.beginPath()
          ctx.arc(node.x, node.y, 2, 0, Math.PI * 2)
          ctx.fill()
        })
      })

      // Animate particles along paths
      particlesRef.current.forEach(particle => {
        particle.progress += particle.speed

        if (particle.progress >= 1) {
          particle.progress = 0
          particle.path = Math.floor(Math.random() * 4)
          particle.speed = 0.003 + Math.random() * 0.004
        }

        // Calculate position along network
        const totalSegments = nodePositions.length - 1
        const segmentProgress = particle.progress * totalSegments
        const currentSegment = Math.floor(segmentProgress)
        const segmentT = segmentProgress - currentSegment

        if (currentSegment < totalSegments) {
          const fromLayer = nodePositions[currentSegment]
          const toLayer = nodePositions[currentSegment + 1]
          
          const fromNode = fromLayer[particle.path % fromLayer.length]
          const toNode = toLayer[particle.path % toLayer.length]

          particle.x = fromNode.x + (toNode.x - fromNode.x) * segmentT
          particle.y = fromNode.y + (toNode.y - fromNode.y) * segmentT

          // Draw particle with trail
          const gradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, particle.size * 3
          )
          gradient.addColorStop(0, `rgba(255, 255, 255, ${particle.opacity})`)
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
          
          ctx.fillStyle = gradient
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2)
          ctx.fill()

          // Core
          ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
          ctx.fill()
        }
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <div className="relative">
      <div className="text-center mb-4">
        <span className="text-xs uppercase tracking-wider text-neutral-500 font-mono">
          Neural Network
        </span>
        <p className="text-neutral-400 text-sm mt-1">
          Data propagation visualization
        </p>
      </div>
      
      <div className="flex justify-center">
        <div className="relative p-4 bg-neutral-900/30 rounded-xl border border-neutral-800/50">
          <canvas 
            ref={canvasRef} 
            className="block"
            style={{ width: '300px', height: '200px' }}
          />
          
          {/* Layer labels */}
          <div className="absolute bottom-2 left-0 right-0 flex justify-between px-6 text-[9px] font-mono text-neutral-600">
            <span>Input</span>
            <span>Hidden Layers</span>
            <span>Output</span>
          </div>
        </div>
      </div>
      
      {/* Info */}
      <div className="text-center mt-4 font-mono text-[10px] text-neutral-500">
        y = σ(Wx + b) → Forward propagation
      </div>
    </div>
  )
}
