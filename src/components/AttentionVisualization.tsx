import { useEffect, useRef, useState } from 'react'

interface AttentionCell {
  row: number
  col: number
  value: number
  targetValue: number
}

export default function AttentionVisualization() {
  const [cells, setCells] = useState<AttentionCell[]>([])
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null)
  const size = 8

  useEffect(() => {
    // Initialize attention matrix
    const initialCells: AttentionCell[] = []
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        // Create causal mask pattern with some randomness
        const isCausal = j <= i
        const baseValue = isCausal ? Math.random() * 0.3 + 0.1 : 0
        // Add diagonal emphasis (self-attention)
        const diagonalBoost = i === j ? 0.4 : 0
        initialCells.push({
          row: i,
          col: j,
          value: baseValue + diagonalBoost,
          targetValue: baseValue + diagonalBoost,
        })
      }
    }
    setCells(initialCells)

    // Animate attention patterns
    const interval = setInterval(() => {
      setCells(prev => prev.map(cell => {
        const isCausal = cell.col <= cell.row
        if (!isCausal) return { ...cell, value: 0, targetValue: 0 }
        
        const newTarget = Math.random() * 0.5 + (cell.row === cell.col ? 0.3 : 0.1)
        const newValue = cell.value + (cell.targetValue - cell.value) * 0.1
        return {
          ...cell,
          value: newValue,
          targetValue: Math.random() > 0.7 ? newTarget : cell.targetValue,
        }
      }))
    }, 100)

    return () => clearInterval(interval)
  }, [])

  const tokens = ['<s>', 'The', 'model', 'learns', 'to', 'predict', 'next', 'token']

  return (
    <div className="relative">
      {/* Title */}
      <div className="text-center mb-6">
        <span className="text-xs uppercase tracking-wider text-neutral-500 font-mono">
          Self-Attention Pattern
        </span>
        <p className="text-neutral-400 text-sm mt-1">
          Causal mask visualization
        </p>
      </div>

      {/* Attention Matrix */}
      <div className="flex justify-center">
        <div className="relative">
          {/* Column labels (Keys) */}
          <div className="flex ml-16 mb-2">
            {tokens.map((token, i) => (
              <div
                key={`col-${i}`}
                className={`w-8 h-6 text-[10px] font-mono flex items-center justify-center transition-colors
                  ${hoveredCell?.col === i ? 'text-white' : 'text-neutral-600'}`}
                style={{ transform: 'rotate(-45deg)', transformOrigin: 'center' }}
              >
                {token}
              </div>
            ))}
          </div>

          <div className="flex">
            {/* Row labels (Queries) */}
            <div className="flex flex-col mr-2">
              {tokens.map((token, i) => (
                <div
                  key={`row-${i}`}
                  className={`w-14 h-8 text-[10px] font-mono flex items-center justify-end pr-2 transition-colors
                    ${hoveredCell?.row === i ? 'text-white' : 'text-neutral-600'}`}
                >
                  {token}
                </div>
              ))}
            </div>

            {/* Matrix Grid */}
            <div 
              className="grid gap-0.5 p-2 bg-neutral-900/50 rounded-lg border border-neutral-800/50"
              style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
            >
              {cells.map((cell, idx) => {
                const isHighlighted = 
                  hoveredCell?.row === cell.row || 
                  hoveredCell?.col === cell.col
                const isCrossHighlight = 
                  hoveredCell?.row === cell.row && 
                  hoveredCell?.col === cell.col

                return (
                  <div
                    key={idx}
                    className="w-8 h-8 rounded-sm transition-all duration-200 cursor-crosshair"
                    style={{
                      backgroundColor: cell.value > 0 
                        ? `rgba(255, 255, 255, ${cell.value * (isHighlighted ? 1.5 : 1)})` 
                        : 'rgba(255, 255, 255, 0.02)',
                      boxShadow: isCrossHighlight 
                        ? '0 0 10px rgba(255, 255, 255, 0.3)' 
                        : 'none',
                      transform: isCrossHighlight ? 'scale(1.1)' : 'scale(1)',
                    }}
                    onMouseEnter={() => setHoveredCell({ row: cell.row, col: cell.col })}
                    onMouseLeave={() => setHoveredCell(null)}
                  />
                )
              })}
            </div>
          </div>

          {/* Labels */}
          <div className="flex justify-between mt-4 text-[10px] text-neutral-500 font-mono px-16">
            <span>Keys (K)</span>
            <span>→</span>
          </div>
          <div className="absolute -left-2 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] text-neutral-500 font-mono">
            Queries (Q) →
          </div>
        </div>
      </div>

      {/* Equation */}
      <div className="text-center mt-6 font-mono text-xs text-neutral-500">
        Attention(Q,K,V) = softmax(QK<sup>T</sup>/√d<sub>k</sub>)V
      </div>
    </div>
  )
}
