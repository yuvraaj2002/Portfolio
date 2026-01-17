export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-neutral-800/50">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo/Name */}
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm text-neutral-500">~/</span>
            <span className="text-neutral-300 font-medium">portfolio</span>
          </div>

          {/* Copyright */}
          <p className="text-neutral-500 text-sm">
            © {currentYear} — Built with React & Tailwind
          </p>

          {/* Back to top */}
          <a
            href="#"
            className="text-neutral-500 hover:text-neutral-300 text-sm transition-colors"
          >
            Back to top ↑
          </a>
        </div>

        {/* Decorative line */}
        <div className="mt-8 flex items-center justify-center gap-2">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-neutral-800" />
          <span className="text-neutral-700 text-xs font-mono">EOF</span>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-neutral-800" />
        </div>
      </div>
    </footer>
  )
}
