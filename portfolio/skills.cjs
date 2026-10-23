// Skills overview, derived from the tools and tags on every public project.
// Each skill lists the project labels that count toward it; the build records
// which projects used it. Domain tags that are not tools are ignored.
const groups = [
  {group:'AI capabilities', items:{
    'Generative AI':['Generative AI'], 'RAG':['RAG'], 'Voice AI':['Voice AI'], 'Multimodal AI':['Multimodal AI'],
    'Vision-Language Models':['Vision-Language Models'], 'Document AI':['Document AI'], 'OCR':['OCR'],
    'Semantic search':['Semantic search'], 'Hybrid search':['Hybrid search'], 'LLM reranking':['LLM reranking','Jina AI reranker'],
    'Structured outputs':['Structured outputs'], 'Tool calling':['Tool calling'], 'AI agents':['AI agents'], 'Multimodal LLMs':['Multimodal LLMs'], 'Machine Learning':['Machine Learning'], 'Computer vision (OpenCV)':['OpenCV']
  }},
  {group:'Models & AI services', items:{
    'LiteLLM':['LiteLLM'], 'Anthropic Claude':['Anthropic Claude'], 'OpenAI':['OpenAI Whisper','OpenAI embeddings'],
    'OpenAI-compatible APIs':['OpenAI-compatible APIs','OpenAI-compatible LLMs'], 'Amazon Bedrock':['Amazon Bedrock'],
    'Google Gemini':['Google Gemini'], 'Groq':['Groq (Llama 3.3 70B)'], 'Cohere Embed':['Cohere Embed'],
    'Jina AI':['Jina AI reranker'], 'Retell AI':['Retell AI'], 'LangGraph':['LangGraph'], 'ElevenLabs':['ElevenLabs'], 'ONNX Runtime':['ONNX Runtime'], 'Model Context Protocol':['Model Context Protocol']
  }},
  {group:'Backend', items:{
    'Python':['Python','Python 3.12'], 'FastAPI':['FastAPI'], 'Django':['Django','Django 5'], 'Django REST Framework':['Django REST Framework'],
    'Pydantic':['Pydantic'], 'SQLAlchemy':['SQLAlchemy','SQLAlchemy (async)'], 'Celery':['Celery'], 'Gunicorn':['Gunicorn'],
    'Pandas':['Pandas'], 'Playwright':['Playwright'], 'PyMuPDF':['PyMuPDF'], 'LibreOffice':['LibreOffice']
  }},
  {group:'Frontend', items:{
    'React':['React','React 18'], 'TypeScript':['TypeScript'], 'Next.js':['Next.js','Next.js 16'], 'Tailwind CSS':['Tailwind CSS','Tailwind CSS 4'],
    'Vite':['Vite'], 'TanStack Query':['TanStack Query'], 'shadcn/ui':['shadcn/ui'], 'Recharts':['Recharts'], 'PDF.js':['PDF.js']
  }},
  {group:'Data & storage', items:{
    'PostgreSQL':['PostgreSQL'], 'MySQL':['MySQL (Amazon RDS)'], 'Redis':['Redis','Redis / Valkey'], 'Qdrant':['Qdrant'],
    'ChromaDB':['ChromaDB'], 'Amazon RDS':['Amazon RDS','MySQL (Amazon RDS)'], 'Amazon S3':['Amazon S3'], 'Alembic':['Alembic']
  }},
  {group:'Cloud & DevOps', items:{
    'AWS Lambda':['AWS Lambda','Serverless functions'], 'Amazon SQS':['Amazon SQS'], 'AWS':['AWS'], 'AWS Step Functions':['AWS Step Functions'],
    'EventBridge Scheduler':['EventBridge Scheduler'], 'AWS SAM':['AWS SAM'], 'AWS Amplify':['AWS Amplify'],
    'Docker':['Docker'], 'Application Load Balancer':['Application Load Balancer'], 'AWS Secrets Manager':['AWS Secrets Manager'],
    'GitHub OIDC':['GitHub OIDC'], 'Trivy':['Trivy'], 'GitHub Actions':['GitHub Actions'], 'Infrastructure as code':['Infrastructure as code']
  }},
  {group:'Integrations & testing', items:{
    'Stripe':['Stripe'], 'GoHighLevel CRM':['GoHighLevel CRM'], 'Monday.com':['Monday.com'], 'Voxo':['Voxo'], 'pytest':['pytest'], 'Vitest':['Vitest']
  }}
];
const ignored = new Set(['Patent Intelligence','Explainability','PDF Processing','AI Platform','Cloud Engineering','IP Automation','Workflow Automation','Full-Stack','Document Automation','Human Review','Multilingual','Product Discovery']);

function buildSkills(projects, details) {
  const labels = project => new Set([...project.stack, ...((details[project.id].tools || []).flatMap(group => group.items))]);
  const known = new Set(groups.flatMap(({items}) => Object.values(items).flat()));
  for (const project of projects) for (const label of labels(project)) {
    if (!known.has(label) && !ignored.has(label)) throw new Error(`Add "${label}" (${project.id}) to skills.cjs or its ignored list`);
  }
  return groups.map(({group, items}) => ({
    group,
    items: Object.entries(items).map(([name, aliases]) => {
      const used = projects.filter(project => aliases.some(alias => labels(project).has(alias))).map(project => project.id);
      if (!used.length) throw new Error(`Skill "${name}" is not used by any public project`);
      return {name, count: used.length, projects: used};
    }).sort((a, b) => b.count - a.count)
  }));
}

module.exports = {buildSkills};
