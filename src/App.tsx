import { useState, useEffect } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import About from './components/About'
import AIVisualizationsSection from './components/AIVisualizationsSection'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Footer from './components/Footer'
import NeuralBackground from './components/NeuralBackground'
import FloatingEquations from './components/FloatingEquations'

function App() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="min-h-screen bg-neutral-950 relative overflow-x-hidden">
      {/* Interactive neural network background */}
      <NeuralBackground />
      
      {/* Floating mathematical equations */}
      <FloatingEquations />
      
      {/* Subtle grid background */}
      <div className="fixed inset-0 grid-background opacity-30" />
      
      {/* Gradient orbs for subtle depth */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-neutral-800/20 rounded-full blur-3xl" />
      <div className="fixed bottom-1/4 right-1/4 w-80 h-80 bg-neutral-800/10 rounded-full blur-3xl" />
      <div className="fixed top-1/2 right-0 w-64 h-64 bg-blue-900/5 rounded-full blur-3xl" />
      
      {/* Noise overlay */}
      <div className="noise-overlay" />
      
      {/* Main content */}
      <div className="relative z-10">
        <Header />
        <main className={`transition-opacity duration-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
          <Hero />
          <About />
          <AIVisualizationsSection />
          <Projects />
          <Contact />
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default App
