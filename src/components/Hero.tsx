import { ArrowDown } from 'lucide-react'
import { useState, useEffect } from 'react'

function TypingCode() {
  const [displayedLines, setDisplayedLines] = useState<string[]>([])
  const [currentLineIndex, setCurrentLineIndex] = useState(0)
  const [currentCharIndex, setCurrentCharIndex] = useState(0)
  const [showCursor, setShowCursor] = useState(true)

  const codeLines = [
    { text: '$ python train.py', delay: 50 },
    { text: '>>> Loading model: GPT-4-turbo', delay: 30, color: 'text-neutral-500' },
    { text: '>>> Tokenizer: cl100k_base ✓', delay: 30, color: 'text-emerald-500/70' },
    { text: '>>> Attention heads: 96', delay: 30, color: 'text-neutral-500' },
    { text: '>>> Hidden dim: 12288', delay: 30, color: 'text-neutral-500' },
    { text: '>>> Training on 8x A100 GPUs...', delay: 40, color: 'text-blue-400/70' },
    { text: 'Epoch 1/100 ██████████ loss: 2.341', delay: 25, color: 'text-neutral-400' },
    { text: 'Epoch 50/100 ██████████ loss: 0.847', delay: 25, color: 'text-neutral-400' },
    { text: 'Epoch 100/100 ██████████ loss: 0.234', delay: 25, color: 'text-neutral-400' },
    { text: '>>> Model saved: ./checkpoints/best.pt ✓', delay: 30, color: 'text-emerald-500/70' },
  ]

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 530)
    return () => clearInterval(cursorInterval)
  }, [])

  useEffect(() => {
    if (currentLineIndex >= codeLines.length) {
      // Reset after delay
      const timeout = setTimeout(() => {
        setDisplayedLines([])
        setCurrentLineIndex(0)
        setCurrentCharIndex(0)
      }, 4000)
      return () => clearTimeout(timeout)
    }

    const currentLine = codeLines[currentLineIndex]
    
    if (currentCharIndex < currentLine.text.length) {
      const timeout = setTimeout(() => {
        setCurrentCharIndex(prev => prev + 1)
      }, currentLine.delay)
      return () => clearTimeout(timeout)
    } else {
      // Move to next line
      const timeout = setTimeout(() => {
        setDisplayedLines(prev => [...prev, currentLine.text])
        setCurrentLineIndex(prev => prev + 1)
        setCurrentCharIndex(0)
      }, 200)
      return () => clearTimeout(timeout)
    }
  }, [currentLineIndex, currentCharIndex])

  const currentLine = codeLines[currentLineIndex]
  const typingText = currentLine?.text.slice(0, currentCharIndex) || ''

  return (
    <div className="font-mono text-xs md:text-sm space-y-1">
      {displayedLines.map((line, i) => (
        <div key={i} className={codeLines[i]?.color || 'text-neutral-400'}>
          {line}
        </div>
      ))}
      {currentLineIndex < codeLines.length && (
        <div className={currentLine?.color || 'text-neutral-400'}>
          {typingText}
          <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} text-white transition-opacity`}>▊</span>
        </div>
      )}
    </div>
  )
}

export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col justify-center relative">
      <div className="section-container">
        {/* Status indicator */}
        <div className="flex items-center gap-2 mb-8 opacity-0 animate-fade-in">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-sm text-neutral-400">Available for opportunities</span>
        </div>

        {/* Main heading */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 opacity-0 animate-slide-up animate-delay-100">
          <span className="text-white">AI Engineer</span>
        </h1>

        {/* Tagline */}
        <p className="text-lg md:text-xl text-neutral-400 max-w-xl leading-relaxed mb-12 opacity-0 animate-slide-up animate-delay-200">
          Building intelligent systems that bridge the gap between research and production. 
          Focused on LLMs, deep learning, and scalable ML infrastructure.
        </p>

        {/* CTA */}
        <div className="flex flex-wrap items-center gap-4 md:gap-6 opacity-0 animate-slide-up animate-delay-300">
          <a
            href="#projects"
            className="px-6 py-3 bg-white text-neutral-900 rounded-lg font-medium text-sm
                     hover:bg-neutral-200 transition-colors duration-200"
          >
            View Projects
          </a>
          <a
            href="#visualizations"
            className="px-6 py-3 border border-neutral-700 text-neutral-300 rounded-lg font-medium text-sm
                     hover:border-neutral-600 hover:text-white transition-all duration-200"
          >
            Explore Concepts
          </a>
          <a
            href="#contact"
            className="text-neutral-400 hover:text-white text-sm transition-colors"
          >
            Get in Touch →
          </a>
        </div>

        {/* Terminal-style decoration with typing animation */}
        <div className="mt-16 md:mt-20 p-4 bg-neutral-900/70 rounded-xl border border-neutral-800/50 max-w-lg opacity-0 animate-fade-in animate-delay-400 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-3 pb-3 border-b border-neutral-800/50">
            <div className="w-3 h-3 rounded-full bg-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
            <div className="w-3 h-3 rounded-full bg-green-500/50" />
            <span className="ml-2 text-[10px] text-neutral-600 font-mono">train.py — python</span>
          </div>
          <TypingCode />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 opacity-0 animate-fade-in animate-delay-500">
        <a
          href="#about"
          className="flex flex-col items-center gap-2 text-neutral-500 hover:text-neutral-300 transition-colors"
        >
          <span className="text-xs uppercase tracking-wider">Scroll</span>
          <ArrowDown className="w-4 h-4 animate-bounce" />
        </a>
      </div>
    </section>
  )
}
