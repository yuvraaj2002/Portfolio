import { useEffect, useState } from 'react'

interface Equation {
  id: number
  text: string
  x: number
  y: number
  opacity: number
  scale: number
  speed: number
  delay: number
}

const equations = [
  'softmax(x)ᵢ = eˣⁱ / Σⱼeˣʲ',
  'Attention(Q,K,V) = softmax(QKᵀ/√dₖ)V',
  '∇θL(θ) = 𝔼[∇θlog π(a|s)R]',
  'L = -Σᵢyᵢlog(ŷᵢ)',
  'h = σ(Wx + b)',
  'θₜ₊₁ = θₜ - α∇L(θ)',
  'P(w|context) = softmax(Wh)',
  'GELU(x) = x·Φ(x)',
  'LayerNorm(x) = γ(x-μ)/σ + β',
  'FFN(x) = max(0, xW₁)W₂',
  'PE(pos,2i) = sin(pos/10000^(2i/d))',
  'KL(p||q) = Σp(x)log(p/q)',
  'H(X) = -Σp(x)log p(x)',
  'σ(z) = 1/(1+e⁻ᶻ)',
  'tanh(x) = (eˣ-e⁻ˣ)/(eˣ+e⁻ˣ)',
  'ReLU(x) = max(0,x)',
  'Adam: m←β₁m+(1-β₁)g',
  'BatchNorm: x̂ = (x-μ)/√(σ²+ε)',
  'Dropout: y = x·m/(1-p)',
  'cos_sim(a,b) = a·b/||a||||b||',
]

export default function FloatingEquations() {
  const [items, setItems] = useState<Equation[]>([])

  useEffect(() => {
    const createEquation = (id: number): Equation => ({
      id,
      text: equations[Math.floor(Math.random() * equations.length)],
      x: Math.random() * 80 + 10,
      y: Math.random() * 100,
      opacity: 0,
      scale: 0.7 + Math.random() * 0.3,
      speed: 15 + Math.random() * 20,
      delay: Math.random() * 5,
    })

    // Initialize equations
    const initialItems = Array.from({ length: 8 }, (_, i) => createEquation(i))
    setItems(initialItems)

    // Cycle equations
    const interval = setInterval(() => {
      setItems(prev => {
        const newItems = [...prev]
        const indexToReplace = Math.floor(Math.random() * newItems.length)
        newItems[indexToReplace] = createEquation(Date.now())
        return newItems
      })
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {items.map((eq) => (
        <div
          key={eq.id}
          className="absolute font-mono text-xs md:text-sm whitespace-nowrap animate-float-equation"
          style={{
            left: `${eq.x}%`,
            top: `${eq.y}%`,
            transform: `scale(${eq.scale})`,
            animationDuration: `${eq.speed}s`,
            animationDelay: `${eq.delay}s`,
            color: 'rgba(255, 255, 255, 0.06)',
          }}
        >
          {eq.text}
        </div>
      ))}
    </div>
  )
}
