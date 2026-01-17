import { ExternalLink, Github, ArrowUpRight } from 'lucide-react'

interface Project {
  title: string
  description: string
  tech: string[]
  github?: string
  demo?: string
  featured?: boolean
}

const projects: Project[] = [
  {
    title: 'LLM Agent Framework',
    description: 'An extensible framework for building autonomous AI agents with tool use, memory, and planning capabilities. Supports multiple LLM backends and custom tool integration.',
    tech: ['Python', 'LangChain', 'OpenAI', 'Redis', 'FastAPI'],
    github: 'https://github.com',
    demo: 'https://demo.com',
    featured: true,
  },
  {
    title: 'Neural Document Search',
    description: 'Semantic search engine using dense retrieval and RAG for enterprise document management. Achieves 95% accuracy on domain-specific queries.',
    tech: ['PyTorch', 'Transformers', 'Pinecone', 'React'],
    github: 'https://github.com',
    featured: true,
  },
  {
    title: 'Vision Transformer for Medical Imaging',
    description: 'Fine-tuned ViT model for automated detection of anomalies in medical scans. Deployed in clinical settings for radiologist assistance.',
    tech: ['PyTorch', 'Hugging Face', 'ONNX', 'Docker'],
    github: 'https://github.com',
  },
  {
    title: 'MLOps Pipeline',
    description: 'End-to-end ML pipeline with automated training, evaluation, and deployment. Features experiment tracking, model versioning, and A/B testing.',
    tech: ['Kubernetes', 'MLflow', 'Airflow', 'Terraform'],
    github: 'https://github.com',
  },
  {
    title: 'Real-time Sentiment Analysis',
    description: 'Streaming sentiment analysis system processing 10K+ messages/second. Used for real-time brand monitoring and market analysis.',
    tech: ['Kafka', 'Spark', 'BERT', 'PostgreSQL'],
    github: 'https://github.com',
    demo: 'https://demo.com',
  },
]

function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="project-card group">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-white group-hover:text-white transition-colors">
          {project.title}
        </h3>
        <div className="flex items-center gap-3">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-500 hover:text-white transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Github className="w-4 h-4" />
            </a>
          )}
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-500 hover:text-white transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
      
      <p className="text-neutral-400 text-sm leading-relaxed mb-4">
        {project.description}
      </p>
      
      <div className="flex flex-wrap gap-2">
        {project.tech.map((tech) => (
          <span
            key={tech}
            className="text-xs font-mono text-neutral-500 bg-neutral-800/50 px-2 py-1 rounded"
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Hover arrow indicator */}
      <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
        <ArrowUpRight className="w-4 h-4 text-neutral-500" />
      </div>
    </article>
  )
}

export default function Projects() {
  return (
    <section id="projects" className="border-t border-neutral-800/50">
      <div className="section-container">
        {/* Section header */}
        <div className="mb-16">
          <span className="text-xs uppercase tracking-wider text-neutral-500 font-mono">02</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">Projects</h2>
          <p className="text-neutral-400 mt-4 max-w-xl">
            A selection of AI/ML projects I've built, from research experiments to production systems.
          </p>
        </div>

        {/* Projects grid */}
        <div className="grid grid-cols-1 gap-4">
          {projects.map((project, index) => (
            <div
              key={project.title}
              className="opacity-0 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
            >
              <ProjectCard project={project} />
            </div>
          ))}
        </div>

        {/* More projects link */}
        <div className="mt-12 text-center">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors text-sm"
          >
            View all projects on GitHub
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  )
}
