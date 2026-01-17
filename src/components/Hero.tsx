import { ArrowDown } from 'lucide-react'

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
        <div className="flex items-center gap-6 opacity-0 animate-slide-up animate-delay-300">
          <a
            href="#projects"
            className="px-6 py-3 bg-white text-neutral-900 rounded-lg font-medium text-sm
                     hover:bg-neutral-200 transition-colors duration-200"
          >
            View Projects
          </a>
          <a
            href="#contact"
            className="px-6 py-3 border border-neutral-700 text-neutral-300 rounded-lg font-medium text-sm
                     hover:border-neutral-600 hover:text-white transition-all duration-200"
          >
            Get in Touch
          </a>
        </div>

        {/* Terminal-style decoration */}
        <div className="mt-20 p-4 bg-neutral-900/50 rounded-lg border border-neutral-800/50 max-w-md opacity-0 animate-fade-in animate-delay-400">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 rounded-full bg-neutral-700" />
            <div className="w-3 h-3 rounded-full bg-neutral-700" />
            <div className="w-3 h-3 rounded-full bg-neutral-700" />
          </div>
          <code className="text-sm font-mono text-neutral-400">
            <span className="text-neutral-500">$</span>{' '}
            <span className="text-neutral-300">python</span> train_model.py{' '}
            <span className="text-neutral-500">--epochs</span> 100
            <span className="animate-pulse-subtle ml-1 text-white">▊</span>
          </code>
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
