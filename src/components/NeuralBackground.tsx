import { useEffect, useRef, useState } from 'react'

interface Node {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  connections: number[]
}

export default function NeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const nodesRef = useRef<Node[]>([])
  const animationRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initNodes()
    }

    const initNodes = () => {
      const nodeCount = Math.floor((canvas.width * canvas.height) / 25000)
      nodesRef.current = []

      for (let i = 0; i < nodeCount; i++) {
        nodesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          radius: Math.random() * 1.5 + 0.5,
          connections: [],
        })
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    const animate = () => {
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const nodes = nodesRef.current
      const mouse = mouseRef.current

      // Update and draw nodes
      nodes.forEach((node, i) => {
        // Mouse attraction
        const dx = mouse.x - node.x
        const dy = mouse.y - node.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        
        if (dist < 200) {
          const force = (200 - dist) / 200 * 0.02
          node.vx += dx * force * 0.01
          node.vy += dy * force * 0.01
        }

        // Update position
        node.x += node.vx
        node.y += node.vy

        // Friction
        node.vx *= 0.99
        node.vy *= 0.99

        // Boundary bounce
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1

        // Keep in bounds
        node.x = Math.max(0, Math.min(canvas.width, node.x))
        node.y = Math.max(0, Math.min(canvas.height, node.y))

        // Draw connections
        nodes.forEach((other, j) => {
          if (i >= j) return
          const dx = other.x - node.x
          const dy = other.y - node.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 150) {
            const opacity = (1 - distance / 150) * 0.15
            ctx.beginPath()
            ctx.moveTo(node.x, node.y)
            ctx.lineTo(other.x, other.y)
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        })

        // Draw node
        const nodeOpacity = dist < 200 ? 0.6 : 0.3
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${nodeOpacity})`
        ctx.fill()

        // Pulse effect near mouse
        if (dist < 100) {
          ctx.beginPath()
          ctx.arc(node.x, node.y, node.radius + 3, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(255, 255, 255, ${(100 - dist) / 100 * 0.3})`
          ctx.lineWidth = 0.5
          ctx.stroke()
        }
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    window.addEventListener('mousemove', handleMouseMove)
    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('mousemove', handleMouseMove)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  )
}
