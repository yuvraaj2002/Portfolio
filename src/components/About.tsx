import { Brain, Cpu, Database, Cloud } from 'lucide-react'

const skills = [
  'Large Language Models',
  'Deep Learning',
  'Computer Vision',
  'MLOps',
  'Reinforcement Learning',
  'NLP',
  'RAG Systems',
  'Fine-tuning',
]

const technologies = [
  { name: 'PyTorch', category: 'framework' },
  { name: 'TensorFlow', category: 'framework' },
  { name: 'Hugging Face', category: 'library' },
  { name: 'LangChain', category: 'library' },
  { name: 'OpenAI API', category: 'api' },
  { name: 'Python', category: 'language' },
  { name: 'Docker', category: 'infra' },
  { name: 'Kubernetes', category: 'infra' },
  { name: 'AWS/GCP', category: 'cloud' },
  { name: 'PostgreSQL', category: 'database' },
  { name: 'Redis', category: 'database' },
  { name: 'FastAPI', category: 'framework' },
]

const highlights = [
  { icon: Brain, label: 'LLM Development', description: 'Building and fine-tuning large language models' },
  { icon: Cpu, label: 'ML Systems', description: 'End-to-end machine learning pipelines' },
  { icon: Database, label: 'Data Engineering', description: 'Scalable data processing infrastructure' },
  { icon: Cloud, label: 'Cloud ML', description: 'Deploying models at scale on cloud platforms' },
]

export default function About() {
  return (
    <section id="about" className="border-t border-neutral-800/50">
      <div className="section-container">
        {/* Section header */}
        <div className="mb-16">
          <span className="text-xs uppercase tracking-wider text-neutral-500 font-mono">01</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">About</h2>
        </div>

        {/* Bio */}
        <div className="mb-16">
          <p className="text-neutral-300 text-lg leading-relaxed max-w-2xl">
            I'm an AI Engineer passionate about building intelligent systems that solve real-world problems. 
            With expertise spanning from research to production, I specialize in developing LLM-powered 
            applications, designing robust ML pipelines, and deploying models at scale.
          </p>
          <p className="text-neutral-400 text-lg leading-relaxed max-w-2xl mt-4">
            Currently focused on advancing the capabilities of AI agents and exploring novel applications 
            of multimodal models. I believe in building AI systems that are not only powerful but also 
            responsible and interpretable.
          </p>
        </div>

        {/* Highlight cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
          {highlights.map((item, index) => (
            <div
              key={item.label}
              className="p-5 rounded-xl bg-neutral-900/30 border border-neutral-800/50 
                       hover:border-neutral-700/50 transition-all duration-300 group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-neutral-800/50 text-neutral-400 
                              group-hover:text-white group-hover:bg-neutral-800 transition-colors">
                  <item.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-medium text-white mb-1">{item.label}</h3>
                  <p className="text-sm text-neutral-500">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Skills */}
        <div className="mb-12">
          <h3 className="text-sm uppercase tracking-wider text-neutral-500 mb-4">Core Skills</h3>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span key={skill} className="skill-tag">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Technologies */}
        <div>
          <h3 className="text-sm uppercase tracking-wider text-neutral-500 mb-4">Technologies</h3>
          <div className="flex flex-wrap gap-2">
            {technologies.map((tech) => (
              <span
                key={tech.name}
                className="px-3 py-1.5 text-sm text-neutral-400 bg-neutral-900/50 
                         rounded-md border border-neutral-800/50 hover:text-neutral-200 
                         hover:border-neutral-700 transition-all duration-200"
              >
                {tech.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
