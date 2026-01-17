import { useState } from 'react'

interface LayerProps {
  label: string
  sublabel?: string
  color: string
  isActive: boolean
  onClick: () => void
  delay: number
}

function Layer({ label, sublabel, color, isActive, onClick, delay }: LayerProps) {
  return (
    <div
      className={`
        relative px-4 py-3 rounded-lg border cursor-pointer
        transition-all duration-300 transform
        ${isActive 
          ? 'border-white/30 bg-white/10 scale-105 shadow-lg shadow-white/5' 
          : 'border-neutral-800 bg-neutral-900/50 hover:border-neutral-700 hover:bg-neutral-900'
        }
      `}
      style={{ 
        animationDelay: `${delay}ms`,
        borderLeftColor: isActive ? color : undefined,
        borderLeftWidth: isActive ? '2px' : '1px',
      }}
      onClick={onClick}
    >
      <div className="text-xs font-medium text-white">{label}</div>
      {sublabel && (
        <div className="text-[10px] text-neutral-500 mt-0.5">{sublabel}</div>
      )}
      
      {/* Active indicator */}
      {isActive && (
        <div 
          className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full animate-pulse"
          style={{ backgroundColor: color }}
        />
      )}
    </div>
  )
}

function Arrow({ animated = false }: { animated?: boolean }) {
  return (
    <div className="flex justify-center py-1">
      <div className={`relative h-6 w-px bg-neutral-700 ${animated ? 'overflow-hidden' : ''}`}>
        {animated && (
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white to-transparent animate-flow" />
        )}
      </div>
    </div>
  )
}

function SplitArrows() {
  return (
    <div className="flex justify-center py-1">
      <svg width="120" height="24" className="text-neutral-700">
        <path d="M60 0 L60 8 M60 8 L20 20 M60 8 L60 20 M60 8 L100 20" 
              stroke="currentColor" fill="none" strokeWidth="1" />
      </svg>
    </div>
  )
}

function MergeArrows() {
  return (
    <div className="flex justify-center py-1">
      <svg width="120" height="24" className="text-neutral-700">
        <path d="M20 4 L60 16 M60 4 L60 16 M100 4 L60 16 M60 16 L60 24" 
              stroke="currentColor" fill="none" strokeWidth="1" />
      </svg>
    </div>
  )
}

const layerDescriptions: Record<string, { title: string; description: string; equation?: string }> = {
  input: {
    title: 'Input Embeddings',
    description: 'Token IDs are converted to dense vectors and combined with positional encodings.',
    equation: 'E(x) = TokenEmbed(x) + PosEmbed(pos)',
  },
  attention: {
    title: 'Multi-Head Attention',
    description: 'Parallel attention heads learn different relationship patterns between tokens.',
    equation: 'MultiHead(Q,K,V) = Concat(head₁,...,headₕ)Wᴼ',
  },
  norm1: {
    title: 'Layer Normalization',
    description: 'Normalizes activations to stabilize training and improve gradient flow.',
    equation: 'LayerNorm(x) = γ · (x-μ)/σ + β',
  },
  ffn: {
    title: 'Feed-Forward Network',
    description: 'Two-layer MLP that processes each position independently.',
    equation: 'FFN(x) = GELU(xW₁ + b₁)W₂ + b₂',
  },
  norm2: {
    title: 'Layer Normalization',
    description: 'Second normalization layer for the residual connection.',
    equation: 'output = LayerNorm(x + FFN(x))',
  },
  output: {
    title: 'Output Projection',
    description: 'Projects hidden states to vocabulary logits for next token prediction.',
    equation: 'P(next) = softmax(hWᵥ)',
  },
}

export default function TransformerDiagram() {
  const [activeLayer, setActiveLayer] = useState<string | null>('attention')

  const info = activeLayer ? layerDescriptions[activeLayer] : null

  return (
    <div className="relative">
      {/* Title */}
      <div className="text-center mb-8">
        <span className="text-xs uppercase tracking-wider text-neutral-500 font-mono">
          Transformer Architecture
        </span>
        <p className="text-neutral-400 text-sm mt-1">
          Click layers to explore
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start justify-center">
        {/* Diagram */}
        <div className="flex flex-col items-center min-w-[200px]">
          {/* Input */}
          <Layer 
            label="Input Embedding" 
            sublabel="+ Positional Encoding"
            color="#60a5fa" 
            isActive={activeLayer === 'input'}
            onClick={() => setActiveLayer('input')}
            delay={0}
          />
          
          <Arrow animated={activeLayer === 'input'} />

          {/* Transformer Block */}
          <div className="border border-neutral-800 rounded-xl p-4 bg-neutral-900/30">
            <div className="text-[10px] text-neutral-500 font-mono mb-3 text-center">
              × N layers
            </div>
            
            {/* Multi-Head Attention */}
            <Layer 
              label="Multi-Head Attention" 
              sublabel="h=8, dₖ=64"
              color="#f472b6" 
              isActive={activeLayer === 'attention'}
              onClick={() => setActiveLayer('attention')}
              delay={100}
            />
            
            <Arrow animated={activeLayer === 'attention'} />
            
            {/* Add & Norm */}
            <Layer 
              label="Add & Norm" 
              color="#a78bfa" 
              isActive={activeLayer === 'norm1'}
              onClick={() => setActiveLayer('norm1')}
              delay={200}
            />
            
            <Arrow animated={activeLayer === 'norm1'} />
            
            {/* FFN */}
            <Layer 
              label="Feed Forward" 
              sublabel="d_ff=2048"
              color="#34d399" 
              isActive={activeLayer === 'ffn'}
              onClick={() => setActiveLayer('ffn')}
              delay={300}
            />
            
            <Arrow animated={activeLayer === 'ffn'} />
            
            {/* Add & Norm */}
            <Layer 
              label="Add & Norm" 
              color="#a78bfa" 
              isActive={activeLayer === 'norm2'}
              onClick={() => setActiveLayer('norm2')}
              delay={400}
            />
          </div>
          
          <Arrow animated={activeLayer === 'norm2'} />
          
          {/* Output */}
          <Layer 
            label="Output Projection" 
            sublabel="→ Vocabulary"
            color="#fbbf24" 
            isActive={activeLayer === 'output'}
            onClick={() => setActiveLayer('output')}
            delay={500}
          />
        </div>

        {/* Info Panel */}
        <div className={`
          w-full md:w-64 p-4 rounded-xl border transition-all duration-300
          ${info 
            ? 'bg-neutral-900/50 border-neutral-800' 
            : 'bg-transparent border-transparent'
          }
        `}>
          {info && (
            <>
              <h4 className="font-medium text-white text-sm mb-2">{info.title}</h4>
              <p className="text-neutral-400 text-xs leading-relaxed mb-3">
                {info.description}
              </p>
              {info.equation && (
                <div className="font-mono text-[10px] text-neutral-500 bg-neutral-800/50 px-2 py-1.5 rounded">
                  {info.equation}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
