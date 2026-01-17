import { Mail, Github, Linkedin, Twitter, ArrowUpRight } from 'lucide-react'

const socialLinks = [
  {
    name: 'Email',
    href: 'mailto:hello@example.com',
    icon: Mail,
    label: 'hello@example.com',
  },
  {
    name: 'GitHub',
    href: 'https://github.com',
    icon: Github,
    label: 'github.com/username',
  },
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com/in',
    icon: Linkedin,
    label: 'linkedin.com/in/username',
  },
  {
    name: 'X / Twitter',
    href: 'https://twitter.com',
    icon: Twitter,
    label: '@username',
  },
]

export default function Contact() {
  return (
    <section id="contact" className="border-t border-neutral-800/50">
      <div className="section-container">
        {/* Section header */}
        <div className="mb-16">
          <span className="text-xs uppercase tracking-wider text-neutral-500 font-mono">05</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">Get in Touch</h2>
          <p className="text-neutral-400 mt-4 max-w-xl">
            Interested in collaborating on AI projects or discussing opportunities? 
            I'm always open to connecting with fellow engineers and researchers.
          </p>
        </div>

        {/* Contact links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl">
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target={link.href.startsWith('mailto') ? undefined : '_blank'}
              rel={link.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
              className="group flex items-center justify-between p-4 rounded-xl 
                       bg-neutral-900/30 border border-neutral-800/50 
                       hover:border-neutral-700 hover:bg-neutral-900/50 
                       transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-neutral-800/50 text-neutral-400 
                              group-hover:text-white group-hover:bg-neutral-800 transition-colors">
                  <link.icon className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-white font-medium block text-sm">{link.name}</span>
                  <span className="text-neutral-500 text-xs">{link.label}</span>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-neutral-600 group-hover:text-neutral-400 
                                       transition-colors" />
            </a>
          ))}
        </div>

        {/* Additional CTA */}
        <div className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-neutral-900/50 to-neutral-900/30 
                      border border-neutral-800/50 max-w-xl">
          <h3 className="text-xl font-semibold text-white mb-2">
            Let's build something together
          </h3>
          <p className="text-neutral-400 text-sm mb-6">
            Whether it's a cutting-edge AI application, research collaboration, 
            or consulting on ML architecture — I'd love to hear about your project.
          </p>
          <a
            href="mailto:hello@example.com"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-neutral-900 
                     rounded-lg font-medium text-sm hover:bg-neutral-200 transition-colors"
          >
            <Mail className="w-4 h-4" />
            Send an Email
          </a>
        </div>
      </div>
    </section>
  )
}
