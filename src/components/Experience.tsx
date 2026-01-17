import { Briefcase, MapPin, Calendar, ExternalLink } from 'lucide-react'

interface ExperienceItem {
  title: string
  company: string
  companyUrl?: string
  type: 'Full-time' | 'Internship' | 'Ambassador'
  duration: string
  period: string
  location: string
  locationType: 'Remote' | 'On-site' | 'Hybrid'
  description: string[]
  skills: string[]
  logo?: string
}

const experiences: ExperienceItem[] = [
  {
    title: 'AI/ML Engineer',
    company: 'Relecura Technologies Pvt. Ltd',
    type: 'Full-time',
    duration: '4 mos',
    period: 'Oct 2025 - Present',
    location: 'Bengaluru, Karnataka, India',
    locationType: 'Remote',
    description: [
      'Model Development & Optimization: Designing and refining models for prior art search, invention screening, and patent similarity detection.',
      'NLP & Semantic Search Pipelines: Building scalable pipelines that integrate NLP, classification, clustering, and semantic search on large-scale patent and technical corpora.',
      'Generative AI for IP Insights: Developing features in generative AI platform to automatically generate insights, reports, and technology landscapes from user inputs.',
      'Data Engineering: Designing scalable ingestion, cleaning, and integration modules for global IP and innovation data across industries and jurisdictions.',
      'Model Monitoring & Improvement: Tracking performance, evaluating metrics, and continuously improving models for accuracy, scalability, and interpretability.',
    ],
    skills: ['Machine Learning', 'Deep Learning', 'NLP', 'Generative AI', 'Data Engineering'],
  },
  {
    title: 'Process Associate',
    company: 'MarVal Group, Inc.',
    type: 'Full-time',
    duration: '1 yr 2 mos',
    period: 'Sep 2024 - Oct 2025',
    location: 'Noida, Uttar Pradesh, India',
    locationType: 'On-site',
    description: [
      'Specialized in leveraging cutting-edge technologies such as machine learning, deep learning, and generative AI to optimize and enhance the entire Intellectual Property (IP) management lifecycle.',
      'Integrated AI models into various stages of IP management—from patent analysis to portfolio optimization—to help drive innovation, enhance decision-making, and ensure the highest standards of efficiency.',
    ],
    skills: ['Machine Learning', 'Generative AI', 'Deep Learning', 'IP Management'],
  },
  {
    title: 'Research Intern',
    company: 'Samsung R&D Institute India',
    type: 'Internship',
    duration: '1 yr 9 mos',
    period: 'Feb 2024 - Oct 2025',
    location: 'Bangalore, India',
    locationType: 'Remote',
    description: [
      'Driving innovations in computer vision at Samsung, actively pushing AI boundaries to tackle real-world challenges.',
      'Enhanced technology capabilities and made Artificial Intelligence accessible and widely used by the general public, reaching millions globally.',
    ],
    skills: ['Computer Vision', 'Information Research', 'Deep Learning', 'AI Research'],
  },
  {
    title: 'Microsoft Learn Student Ambassador',
    company: 'Microsoft Learn Student Ambassadors',
    type: 'Ambassador',
    duration: '1 yr 10 mos',
    period: 'Apr 2023 - Jan 2025',
    location: 'Global',
    locationType: 'Remote',
    description: [
      'Collaborated with Microsoft to help fellow students learn about technology and engage with various Microsoft technologies and services.',
      'Prepared and conducted workshops on Machine Learning, Predictive Modeling, and Python programming language for over 180 students globally, achieving a 95% satisfaction rate.',
      'Developed practical curriculum guidelines for beginners entering the field and continuously learned new technologies through regular sessions with Microsoft employees.',
    ],
    skills: ['Communication', 'Software Documentation', 'Workshop Facilitation', 'Technical Mentoring', 'Machine Learning'],
  },
  {
    title: 'AI/ML Developer | Computer Vision Intern',
    company: 'WictronIX',
    type: 'Internship',
    duration: '3 mos',
    period: 'Jun 2023 - Aug 2023',
    location: 'Gujarat, India',
    locationType: 'Remote',
    description: [
      'Successfully completed an enriching internship as an AI/ML Developer Intern from June 12, 2023, to August 4, 2023.',
      'Led a significant project demonstrating expertise in computer vision and team leadership.',
    ],
    skills: ['Computer Vision', 'Team Leadership', 'Python', 'Deep Learning'],
  },
]

function ExperienceCard({ experience, index }: { experience: ExperienceItem; index: number }) {
  const typeColors = {
    'Full-time': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'Internship': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'Ambassador': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  }

  return (
    <div 
      className="relative group"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Timeline line */}
      {index < experiences.length - 1 && (
        <div className="absolute left-[19px] top-12 bottom-0 w-px bg-gradient-to-b from-neutral-700 to-transparent" />
      )}
      
      <div className="flex gap-4">
        {/* Timeline dot */}
        <div className="relative flex-shrink-0">
          <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center group-hover:border-neutral-700 group-hover:bg-neutral-800 transition-all duration-300">
            <Briefcase className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors" />
          </div>
          {/* Pulse effect for current role */}
          {index === 0 && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 pb-10">
          <div className="p-5 rounded-xl bg-neutral-900/30 border border-neutral-800/50 hover:border-neutral-700/50 hover:bg-neutral-900/50 transition-all duration-300">
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
              <div>
                <h3 className="text-lg font-semibold text-white group-hover:text-white transition-colors">
                  {experience.title}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-neutral-300 font-medium text-sm">
                    {experience.company}
                  </span>
                  {experience.companyUrl && (
                    <a 
                      href={experience.companyUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-neutral-500 hover:text-white transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
              <span className={`px-2.5 py-1 text-xs font-medium rounded-md border ${typeColors[experience.type]}`}>
                {experience.type}
              </span>
            </div>

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-500 mb-4">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3 h-3" />
                <span>{experience.period}</span>
                <span className="text-neutral-700">•</span>
                <span>{experience.duration}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3" />
                <span>{experience.location}</span>
                <span className="text-neutral-700">•</span>
                <span className={experience.locationType === 'Remote' ? 'text-blue-400/70' : 'text-neutral-500'}>
                  {experience.locationType}
                </span>
              </div>
            </div>

            {/* Description */}
            <ul className="space-y-2 mb-4">
              {experience.description.map((item, i) => (
                <li key={i} className="text-sm text-neutral-400 leading-relaxed pl-4 relative before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:bg-neutral-700 before:rounded-full">
                  {item}
                </li>
              ))}
            </ul>

            {/* Skills */}
            <div className="flex flex-wrap gap-1.5">
              {experience.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-1 text-xs font-mono text-neutral-500 bg-neutral-800/50 rounded border border-neutral-800/50 hover:text-neutral-300 hover:border-neutral-700 transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Experience() {
  return (
    <section id="experience" className="border-t border-neutral-800/50">
      <div className="section-container">
        {/* Section header */}
        <div className="mb-12">
          <span className="text-xs uppercase tracking-wider text-neutral-500 font-mono">02</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">Experience</h2>
          <p className="text-neutral-400 mt-4 max-w-xl">
            My journey building AI systems across research labs, startups, and global tech companies.
          </p>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="p-4 rounded-xl bg-neutral-900/30 border border-neutral-800/50 text-center">
            <div className="text-2xl font-bold text-white">3+</div>
            <div className="text-xs text-neutral-500 mt-1">Years Experience</div>
          </div>
          <div className="p-4 rounded-xl bg-neutral-900/30 border border-neutral-800/50 text-center">
            <div className="text-2xl font-bold text-white">5</div>
            <div className="text-xs text-neutral-500 mt-1">Companies</div>
          </div>
          <div className="p-4 rounded-xl bg-neutral-900/30 border border-neutral-800/50 text-center">
            <div className="text-2xl font-bold text-white">180+</div>
            <div className="text-xs text-neutral-500 mt-1">Students Mentored</div>
          </div>
          <div className="p-4 rounded-xl bg-neutral-900/30 border border-neutral-800/50 text-center">
            <div className="text-2xl font-bold text-white">AI/ML</div>
            <div className="text-xs text-neutral-500 mt-1">Primary Focus</div>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative">
          {experiences.map((experience, index) => (
            <ExperienceCard key={experience.company + experience.period} experience={experience} index={index} />
          ))}
        </div>

        {/* Download resume CTA */}
        <div className="mt-8 pt-8 border-t border-neutral-800/50 flex justify-center">
          <a
            href="#"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-900 text-neutral-300 
                     rounded-lg font-medium text-sm border border-neutral-800
                     hover:bg-neutral-800 hover:text-white hover:border-neutral-700 transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download Resume
          </a>
        </div>
      </div>
    </section>
  )
}
