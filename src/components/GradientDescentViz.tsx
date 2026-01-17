import { useEffect, useRef, useState } from 'react'

export default function GradientDescentViz() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [position, setPosition] = useState({ x: 0.8, y: 0.2 })
  const [path, setPath] = useState<{ x: number; y: number }[]>([])
  const animationRef = useRef<number>()
  const iterationRef = useRef(0)

  // Loss function (2D bowl shape)
  const lossFunction = (x: number, y: number) => {
    return Math.pow(x - 0.5, 2) * 2 + Math.pow(y - 0.5, 2) * 3 + 
           0.3 * Math.sin(x * 10) * Math.cos(y * 10)
  }

  // Gradient
  const gradient = (x: number, y: number) => {
    const h = 0.001
    const dx = (lossFunction(x + h, y) - lossFunction(x - h, y)) / (2 * h)
    const dy = (lossFunction(x, y + h) - lossFunction(x, y - h)) / (2 * h)
    return { dx, dy }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = 280
    const height = 200
    canvas.width = width
    canvas.height = height

    // Draw loss surface
    const imageData = ctx.createImageData(width, height)
    for (let py = 0; py < height; py++) {
      for (let px = 0; px < width; px++) {
        const x = px / width
        const y = py / height
        const loss = lossFunction(x, y)
        const intensity = Math.max(0, Math.min(255, 255 - loss * 200))
        const idx = (py * width + px) * 4
        imageData.data[idx] = intensity * 0.1     // R
        imageData.data[idx + 1] = intensity * 0.1 // G
        imageData.data[idx + 2] = intensity * 0.15 // B
        imageData.data[idx + 3] = 255             // A
      }
    }
    ctx.putImageData(imageData, 0, 0)

    // Draw contour lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
    ctx.lineWidth = 0.5
    for (let level = 0.1; level < 2; level += 0.2) {
      ctx.beginPath()
      for (let angle = 0; angle < Math.PI * 2; angle += 0.1) {
        const radius = Math.sqrt(level / 2) * width * 0.4
        const cx = 0.5 * width
        const cy = 0.5 * height
        const px = cx + Math.cos(angle) * radius
        const py = cy + Math.sin(angle) * radius * 0.8
        if (angle === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      }
      ctx.closePath()
      ctx.stroke()
    }
  }, [])

  // Gradient descent animation
  useEffect(() => {
    const learningRate = 0.05
    let currentPos = { x: 0.85, y: 0.15 }
    let currentPath: { x: number; y: number }[] = [{ ...currentPos }]
    
    const step = () => {
      const grad = gradient(currentPos.x, currentPos.y)
      currentPos = {
        x: currentPos.x - grad.dx * learningRate,
        y: currentPos.y - grad.dy * learningRate,
      }
      currentPath = [...currentPath, { ...currentPos }]
      
      setPosition(currentPos)
      setPath(currentPath)
      
      iterationRef.current++
      
      // Reset after convergence or max iterations
      if (iterationRef.current > 100 || 
          (Math.abs(currentPos.x - 0.5) < 0.02 && Math.abs(currentPos.y - 0.5) < 0.02)) {
        setTimeout(() => {
          currentPos = { x: Math.random() * 0.3 + 0.7, y: Math.random() * 0.3 }
          currentPath = [{ ...currentPos }]
          iterationRef.current = 0
          setPosition(currentPos)
          setPath(currentPath)
        }, 2000)
      }
      
      animationRef.current = setTimeout(step, 80) as unknown as number
    }

    step()

    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current)
      }
    }
  }, [])

  return (
    <div className="relative">
      <div className="text-center mb-4">
        <span className="text-xs uppercase tracking-wider text-neutral-500 font-mono">
          Gradient Descent
        </span>
        <p className="text-neutral-400 text-sm mt-1">
          Optimization in action
        </p>
      </div>

      <div className="flex justify-center">
        <div className="relative">
          <canvas
            ref={canvasRef}
            className="rounded-xl border border-neutral-800/50"
            style={{ width: '280px', height: '200px' }}
          />
          
          {/* Overlay for path and position */}
          <svg 
            className="absolute inset-0 pointer-events-none"
            viewBox="0 0 280 200"
            style={{ width: '280px', height: '200px' }}
          >
            {/* Path */}
            {path.length > 1 && (
              <path
                d={`M ${path.map(p => `${p.x * 280} ${p.y * 200}`).join(' L ')}`}
                fill="none"
                stroke="rgba(251, 191, 36, 0.6)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            )}
            
            {/* Path points */}
            {path.map((p, i) => (
              <circle
                key={i}
                cx={p.x * 280}
                cy={p.y * 200}
                r={i === path.length - 1 ? 4 : 1.5}
                fill={i === path.length - 1 ? '#fbbf24' : 'rgba(251, 191, 36, 0.4)'}
              />
            ))}
            
            {/* Current position glow */}
            <circle
              cx={position.x * 280}
              cy={position.y * 200}
              r="12"
              fill="rgba(251, 191, 36, 0.2)"
            />
            
            {/* Minimum indicator */}
            <circle
              cx={0.5 * 280}
              cy={0.5 * 200}
              r="6"
              fill="none"
              stroke="rgba(52, 211, 153, 0.5)"
              strokeWidth="1"
              strokeDasharray="2 2"
            />
            <text
              x={0.5 * 280 + 10}
              y={0.5 * 200 + 4}
              fontSize="8"
              fill="rgba(52, 211, 153, 0.6)"
              fontFamily="monospace"
            >
              min
            </text>
          </svg>

          {/* Labels */}
          <div className="absolute top-2 right-2 text-[9px] font-mono text-neutral-500 bg-neutral-900/80 px-2 py-1 rounded">
            iter: {iterationRef.current}
          </div>
        </div>
      </div>

      {/* Equation */}
      <div className="text-center mt-4 font-mono text-[10px] text-neutral-500">
        θ<sub>t+1</sub> = θ<sub>t</sub> - α∇L(θ)
      </div>
    </div>
  )
}
