import { useState } from 'react'
import AttentionVisualization from './AttentionVisualization'
import TransformerDiagram from './TransformerDiagram'
import DataFlowVisualization from './DataFlowVisualization'
import GradientDescentViz from './GradientDescentViz'
import { Cpu, Layers, GitBranch, TrendingDown } from 'lucide-react'

type VisualizationType = 'attention' | 'transformer' | 'neural' | 'gradient'

const visualizations = [
  { id: 'attention' as const, label: 'Attention', icon: Layers },
  { id: 'transformer' as const, label: 'Transformer', icon: GitBranch },
  { id: 'neural' as const, label: 'Neural Net', icon: Cpu },
  { id: 'gradient' as const, label: 'Optimization', icon: TrendingDown },
]

export default function AIVisualizationsSection() {
  const [activeViz, setActiveViz] = useState<VisualizationType>('attention')

  return (
    <section id="visualizations" className="border-t border-neutral-800/50">
      <div className="section-container">
        {/* Section header */}
        <div className="mb-12">
          <span className="text-xs uppercase tracking-wider text-neutral-500 font-mono">
            03 — Interactive Visualizations
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">
            Deep Learning Concepts
          </h2>
          <p className="text-neutral-400 mt-4 max-w-xl">
            Explore the fundamental building blocks of modern AI systems through 
            interactive visualizations.
          </p>
        </div>

        {/* Visualization selector */}
        <div className="flex flex-wrap gap-2 mb-8">
          {visualizations.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveViz(id)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                transition-all duration-200
                ${activeViz === id 
                  ? 'bg-white text-neutral-900' 
                  : 'bg-neutral-900/50 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Visualization container */}
        <div className="relative min-h-[400px] p-6 md:p-8 rounded-2xl bg-neutral-900/30 border border-neutral-800/50 backdrop-blur-sm">
          {/* Decorative corners */}
          <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-neutral-700 rounded-tl-lg" />
          <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-neutral-700 rounded-tr-lg" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-neutral-700 rounded-bl-lg" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-neutral-700 rounded-br-lg" />

          {/* Active visualization */}
          <div className="transition-opacity duration-300">
            {activeViz === 'attention' && <AttentionVisualization />}
            {activeViz === 'transformer' && <TransformerDiagram />}
            {activeViz === 'neural' && <DataFlowVisualization />}
            {activeViz === 'gradient' && <GradientDescentViz />}
          </div>
        </div>

        {/* Additional info cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="p-4 rounded-xl bg-neutral-900/30 border border-neutral-800/50">
            <div className="text-2xl font-bold text-white mb-1">175B+</div>
            <div className="text-sm text-neutral-500">Parameters in GPT-3</div>
          </div>
          <div className="p-4 rounded-xl bg-neutral-900/30 border border-neutral-800/50">
            <div className="text-2xl font-bold text-white mb-1">96</div>
            <div className="text-sm text-neutral-500">Attention heads in GPT-4</div>
          </div>
          <div className="p-4 rounded-xl bg-neutral-900/30 border border-neutral-800/50">
            <div className="text-2xl font-bold text-white mb-1">32K</div>
            <div className="text-sm text-neutral-500">Context window tokens</div>
          </div>
        </div>
      </div>
    </section>
  )
}
