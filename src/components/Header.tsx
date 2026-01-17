import { useState, useEffect } from 'react'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { label: 'About', href: '#about' },
    { label: 'Projects', href: '#projects' },
    { label: 'Contact', href: '#contact' },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800/50' 
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
        <a 
          href="#" 
          className="text-white font-semibold tracking-tight hover:opacity-70 transition-opacity"
        >
          <span className="font-mono text-sm text-neutral-500">~/</span>
          <span className="ml-1">portfolio</span>
        </a>
        
        <ul className="flex items-center gap-8">
          {navItems.map((item) => (
            <li key={item.href}>
              <a href={item.href} className="nav-link">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
