// Public role summaries, tools, and headline numbers; no proprietary implementation details.
module.exports = {
  "patent-classification": {
    "role": "Backend & AI engineering",
    "scope": "Patent intelligence",
    "focus": "Analyst-facing capabilities",
    "lead": "Make complex information easier to work with.",
    "overview": "Patent analysis requires tools that help people organize technical information and understand recommendations. My work supported that need through AI-assisted classification capabilities.",
    "ownership": [
      "Developed backend capabilities for AI-assisted patent classification.",
      "Worked on making recommendations clearer and more useful for analysts.",
      "Contributed to integration and overall product quality."
    ],
    "tools": [
      {
        "group": "Backend",
        "items": [
          "Python",
          "Django REST Framework",
          "Pydantic",
          "Pandas"
        ]
      },
      {
        "group": "AI",
        "items": [
          "Generative AI",
          "LiteLLM",
          "Semantic search"
        ]
      },
      {
        "group": "Delivery",
        "items": [
          "AWS",
          "Docker",
          "GitHub Actions"
        ]
      }
    ],
    "outcomes": [
      "Supported more structured patent-analysis workflows.",
      "Brought applied AI and backend engineering together around an analyst-facing problem."
    ]
  },
  "citation-intelligence": {
    "role": "Document AI engineering",
    "scope": "Technical-document analysis",
    "focus": "Reference discovery & review",
    "lead": "Help people get to the information that matters.",
    "overview": "Reviewing references in technical documents involves detailed, repetitive work. I contributed document-AI capabilities that make relevant information easier to find and review.",
    "ownership": [
      "Built AI-assisted document-processing capabilities.",
      "Worked on making document results useful and reviewable.",
      "Connected applied AI work with the needs of the wider product."
    ],
    "tools": [
      {
        "group": "Backend",
        "items": [
          "Python",
          "Pydantic",
          "Serverless functions"
        ]
      },
      {
        "group": "AI",
        "items": [
          "Vision-Language Models",
          "OCR",
          "Document AI"
        ]
      },
      {
        "group": "Cloud",
        "items": [
          "AWS Lambda",
          "AWS Step Functions",
          "Amazon S3"
        ]
      }
    ],
    "outcomes": [
      "Supported reference-discovery and document-review tasks.",
      "Contributed practical document-intelligence capabilities."
    ]
  },
  "ai-gateway": {
    "role": "AI platform engineering",
    "scope": "Shared AI capabilities",
    "focus": "Developer experience",
    "lead": "Make AI easier for product teams to work with.",
    "overview": "As AI becomes part of more product features, teams need a consistent way to work with it. My contribution focused on shared platform capabilities and the experience of integrating AI into applications.",
    "ownership": [
      "Contributed to shared AI-platform engineering.",
      "Worked with LiteLLM on model-access capabilities.",
      "Prepared platform foundations for product-team integration."
    ],
    "tools": [
      {
        "group": "Platform",
        "items": [
          "LiteLLM",
          "OpenAI-compatible APIs"
        ]
      },
      {
        "group": "Delivery",
        "items": [
          "AWS",
          "Docker",
          "GitHub Actions",
          "Infrastructure as code"
        ]
      }
    ],
    "outcomes": [
      "Supported a more consistent model-access experience.",
      "Contributed a foundation for further platform development."
    ]
  },
  "maxval-ip-workflows": {
    "role": "Process Associate",
    "scope": "Intellectual-property services",
    "focus": "AI-assisted workflows",
    "lead": "Apply AI where it improves the work.",
    "overview": "At MaxVal IP Services, my role involved applying machine learning, deep learning, and generative AI to support intellectual-property management.",
    "ownership": [
      "Worked on AI-driven improvements to IP-management workflows.",
      "Contributed to patent-analysis and portfolio-related work.",
      "Focused on accuracy, decision support, and reducing repetitive effort."
    ],
    "outcomes": [
      "Applied AI in a professional IP-services context.",
      "Contributed to workflow improvement and analytical support."
    ]
  },
  "healthcare-outreach": {
    "role": "Full-stack & applied AI engineering",
    "scope": "Patient outreach & operations",
    "focus": "Voice AI, follow-up & reporting",
    "lead": "Build the product around the conversation.",
    "overview": "A healthcare outreach team needed to reach patients by phone and text at volume, without missed follow-ups, duplicate calls, or notes copied into the CRM by hand. I built the platform end to end: the dashboard staff work in every day, the backend that schedules and tracks every call and message, and the AI voice agents’ place in that workflow.",
    "ownership": [
      "Built the operations dashboard in React and TypeScript: call records, KPIs, agent and campaign performance, transcripts, charts, and CSV exports.",
      "Built the FastAPI backend and background workers that run multi-day outreach sequences across AI calls and SMS, within calling hours.",
      "Connected Retell AI voice agents for inbound, outbound, and callback calls, plus goal-specific call workflows.",
      "Added LLM-assisted call review that records each call’s outcome, sentiment, urgency, and next step, and a quality-control workspace for evaluating calls.",
      "Kept the GoHighLevel CRM in sync with every outcome, and built do-not-call handling, roles and permissions, and service-health monitoring."
    ],
    "numbers": [
      {
        "value": "7",
        "label": "touches per outreach sequence, across calls and SMS"
      },
      {
        "value": "14",
        "label": "days each sequence runs, with no manual scheduling"
      },
      {
        "value": "10",
        "label": "goal-specific AI call workflows"
      },
      {
        "value": "8+",
        "label": "external services connected into one workspace"
      }
    ],
    "tools": [
      {
        "group": "Frontend",
        "items": [
          "React 18",
          "TypeScript",
          "Vite",
          "TanStack Query",
          "Tailwind CSS",
          "shadcn/ui",
          "Recharts"
        ]
      },
      {
        "group": "Backend",
        "items": [
          "Python",
          "FastAPI",
          "Pydantic",
          "SQLAlchemy",
          "Celery"
        ]
      },
      {
        "group": "Data",
        "items": [
          "PostgreSQL",
          "Redis",
          "Alembic"
        ]
      },
      {
        "group": "Cloud",
        "items": [
          "AWS Lambda",
          "Amazon SQS",
          "EventBridge Scheduler",
          "AWS SAM"
        ]
      },
      {
        "group": "AI & integrations",
        "items": [
          "Retell AI",
          "Anthropic Claude",
          "OpenAI-compatible LLMs",
          "GoHighLevel CRM",
          "Model Context Protocol"
        ]
      }
    ],
    "outcomes": [
      "Calls, texts, reviews, and CRM updates in one workspace instead of several disconnected tools.",
      "Every call ends with a recorded outcome and a CRM update, with no notes copied by hand.",
      "Follow-ups run on schedule and respect calling hours and do-not-call requests automatically."
    ]
  },
  "document-workspace": {
    "role": "Full-stack & document AI engineering",
    "scope": "Legal-document workflows",
    "focus": "Cited answers & PDF automation",
    "lead": "Turn complex document work into a usable product.",
    "overview": "Legal-document work means large PDF packages, repetitive notices, signatures, and domain questions that a generic chatbot can’t answer reliably. I built the product end to end, a Next.js workspace and a FastAPI backend, so research, document preparation, and review happen in one place.",
    "ownership": [
      "Built an AI assistant that answers in English or Spanish, streams its response, and cites the source passages it used.",
      "Built document processing that turns large PDF packages into a structured record, with a human review and approval step before anything is used.",
      "Built template-based generation of legal notices, with electronic signatures and finished PDF output.",
      "Built an in-browser stamp editor: drag, scale, and rotate a stamp, preview it, and apply it to every page.",
      "Built the workspace itself: upload, preview, versioning, ownership checks, paginated lists, and download, backed by automated tests on both ends."
    ],
    "numbers": [
      {
        "value": "2",
        "label": "languages supported by the assistant: English and Spanish"
      },
      {
        "value": "176",
        "label": "automated tests across frontend and backend"
      },
      {
        "value": "160+",
        "label": "commits shipped in about four months"
      },
      {
        "value": "1",
        "label": "workspace for research, generation, signing, and stamping"
      }
    ],
    "tools": [
      {
        "group": "Frontend",
        "items": [
          "Next.js 16",
          "React",
          "TypeScript",
          "Tailwind CSS 4",
          "PDF.js"
        ]
      },
      {
        "group": "Backend",
        "items": [
          "Python 3.12",
          "FastAPI",
          "SQLAlchemy (async)",
          "Pydantic",
          "PyMuPDF",
          "LibreOffice"
        ]
      },
      {
        "group": "Data",
        "items": [
          "PostgreSQL",
          "Qdrant",
          "Redis / Valkey",
          "Amazon S3"
        ]
      },
      {
        "group": "AI",
        "items": [
          "Amazon Bedrock",
          "Anthropic Claude",
          "Cohere Embed",
          "RAG"
        ]
      },
      {
        "group": "Cloud & quality",
        "items": [
          "AWS Lambda",
          "Amazon SQS",
          "AWS Amplify",
          "GitHub Actions",
          "pytest",
          "Vitest"
        ]
      }
    ],
    "outcomes": [
      "Answers come with their sources, so users can check them.",
      "Document preparation moves from manual copy-and-paste to review and approve.",
      "Upload, research, generation, signing, and stamping happen in one product."
    ]
  },
  "product-advisor": {
    "role": "Backend & applied AI engineering",
    "scope": "Consumer product guidance",
    "focus": "Multilingual, multimodal AI",
    "lead": "Meet people in the way they choose to ask.",
    "overview": "Customers of a skincare and pharmacy business wanted personal product advice in their own language, in whatever form they chose to ask: a typed question, a voice note, or a short video of their skin. I built the production backend behind that advisor, including its AI, subscriptions, and catalog sync, over roughly a year and a half.",
    "ownership": [
      "Built the Django REST backend that powers the advisor and connects to the client’s existing user accounts.",
      "Built multilingual product Q&A grounded in the product catalog, using retrieval and reranking (RAG).",
      "Added voice questions through speech-to-text, and video-based skin analysis that feeds into product recommendations.",
      "Built Stripe subscriptions with plan limits and usage quotas.",
      "Built automatic catalog sync, so recommendations follow product changes without manual updates."
    ],
    "numbers": [
      {
        "value": "3",
        "label": "ways to ask: text, voice, or video"
      },
      {
        "value": "4",
        "label": "AI services working together behind one answer"
      },
      {
        "value": "19",
        "label": "months of production development"
      },
      {
        "value": "240+",
        "label": "commits shipped"
      }
    ],
    "tools": [
      {
        "group": "Backend",
        "items": [
          "Python",
          "Django 5",
          "Django REST Framework",
          "Celery",
          "Gunicorn"
        ]
      },
      {
        "group": "Data",
        "items": [
          "MySQL (Amazon RDS)",
          "Redis",
          "ChromaDB",
          "Amazon S3"
        ]
      },
      {
        "group": "AI",
        "items": [
          "OpenAI Whisper",
          "OpenAI embeddings",
          "Groq (Llama 3.3 70B)",
          "Google Gemini",
          "Jina AI reranker",
          "OpenCV"
        ]
      },
      {
        "group": "Cloud & payments",
        "items": [
          "AWS Lambda",
          "Amazon SQS",
          "Stripe"
        ]
      }
    ],
    "outcomes": [
      "One advisor for text, voice, and video questions, in the customer’s language.",
      "Recommendations stay current as the product catalog changes.",
      "Paid plans and usage limits are enforced automatically."
    ]
  }
};
