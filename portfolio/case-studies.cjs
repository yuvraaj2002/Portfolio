// Public role summaries, tools, and headline numbers; no proprietary implementation details.
module.exports = {
  "patent-classification": {
    "role": "Backend & AI engineering",
    "scope": "Patent intelligence · Oct 2025 – present",
    "focus": "Explainable classification at scale",
    "lead": "Accurate enough to trust, clear enough to check.",
    "overview": "Patent analysts sort large volumes of publications into a client’s own taxonomy, and they need to see why a recommendation was made. I built an explainable classification API that suggests up to three categories for each patent, each with an analyst-style justification, and a pipeline that runs it across very large batches.",
    "ownership": [
      "Built the classification API: semantic and keyword search find the closest examples, results are merged, and a language model reranks them with structured, validated output.",
      "Returned up to three taxonomy categories per patent, each with a short justification an analyst can check.",
      "Evaluated on a labelled holdout set and nearly doubled baseline accuracy, with ranked suggestions instead of a single opaque guess.",
      "Built a batch pipeline that processes portfolio-scale jobs with chunked, asynchronous processing.",
      "Shipped it as containers through GitHub Actions, with image scanning, commit-tagged releases, and automatic rollback."
    ],
    "numbers": [
      {
        "value": "2x",
        "label": "near-doubling of baseline accuracy on a labelled holdout"
      },
      {
        "value": "3",
        "label": "ranked category suggestions, each with a justification"
      },
      {
        "value": "100K",
        "label": "publications processed per batch job at peak"
      }
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
          "Semantic search",
          "Hybrid search",
          "LLM reranking",
          "Structured outputs"
        ]
      },
      {
        "group": "Delivery",
        "items": [
          "AWS",
          "Docker",
          "GitHub Actions",
          "Trivy"
        ]
      }
    ],
    "outcomes": [
      "Nearly double the previous baseline, with ranked options instead of one opaque prediction.",
      "Every recommendation comes with a justification, so analysts can review rather than redo.",
      "Classification runs on whole portfolios in large batch jobs, not one patent at a time."
    ],
    "decision": {
      "title": "Ship explainability with the ranking, not after.",
      "body": "The tempting shortcut was a single best category and a faster path. I kept ranked suggestions with analyst-style justifications even when it cost latency, because trust mattered more than a snappy wrong answer. What I’d do differently: wire the labelled eval set into every ranking change earlier, so regressions show up before a batch job does."
    }
  },
  "citation-intelligence": {
    "role": "Document AI engineering",
    "scope": "Patent documents · Oct 2025 – present",
    "focus": "Citation extraction & highlighting",
    "lead": "Find every reference, and show exactly where it is.",
    "overview": "Patent PDFs can run to hundreds of pages, and the citations inside them have to be found, cleaned up, and checked by hand. I built a serverless document-AI pipeline that extracts the citations from large patent PDFs, normalizes and enriches them, and highlights each one on the page where it appears.",
    "ownership": [
      "Built a serverless pipeline orchestrated by AWS Step Functions, with separate stages that split the PDF, process each part, run OCR, and merge the results.",
      "Used multimodal language models with structured output to extract citations and enrich references to non-patent literature.",
      "Used a model with tool calling to locate each citation on the page, so the original PDF can be highlighted for review.",
      "Kept OCR cost down by running containerized OCR in parallel, and only on pages that contain citations.",
      "Split large PDFs into 70-page batches and kept the original page numbers intact when the results are merged."
    ],
    "numbers": [
      {
        "value": "4",
        "label": "serverless stages: split, process, OCR, merge"
      },
      {
        "value": "70",
        "label": "pages per parallel batch for large PDFs"
      }
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
          "Multimodal LLMs",
          "Tool calling",
          "Structured outputs",
          "OCR",
          "ONNX Runtime"
        ]
      },
      {
        "group": "Cloud",
        "items": [
          "AWS Lambda",
          "AWS Step Functions",
          "Amazon S3",
          "Docker"
        ]
      }
    ],
    "outcomes": [
      "Citations come back structured, normalized, and highlighted in the original PDF.",
      "Large documents run in parallel batches instead of one long job.",
      "OCR runs only where it is needed, which keeps processing cost down."
    ],
    "decision": {
      "title": "Pay for OCR only where citations land.",
      "body": "Full-document OCR on hundred-page patents blew the budget and the wall clock. I split work into parallel batches and ran OCR only on pages that already had citations, then used tool calling to place highlights. What broke first was merge order when page numbers drifted across batches — I’d lock page identity into the merge contract on day one next time."
    }
  },
  "ai-gateway": {
    "role": "AI platform engineering",
    "scope": "Shared LLM infrastructure · Oct 2025 – present",
    "focus": "Model access, cost & reliability",
    "lead": "One API for every model the product needs.",
    "overview": "As more product features use language models, every service was handling providers, keys, and costs on its own. I built a private LiteLLM gateway that gives platform services one OpenAI-compatible API over four foundation models, with access control, rate limits, and spend tracking in one place, and designed the cloud infrastructure it runs on.",
    "ownership": [
      "Built a private LiteLLM gateway with one OpenAI-compatible API over four foundation models, including an automatic fallback model.",
      "Added per-service API keys, per-model rate limits, and spend tracking.",
      "Designed the AWS infrastructure: containers behind an internal Application Load Balancer with health checks, a managed database for keys and spend logs, AWS Secrets Manager for runtime secrets, and keyless CI access through GitHub OIDC.",
      "Moved model configuration into Git-reviewed, commit-tagged images with security scanning, dev-to-prod promotion, and automatic rollback.",
      "Planned the move from a single-server setup to a managed, multi-zone deployment."
    ],
    "numbers": [
      {
        "value": "4",
        "label": "foundation models behind one OpenAI-compatible API"
      },
      {
        "value": "1",
        "label": "gateway for keys, rate limits, and spend tracking"
      }
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
        "group": "Cloud",
        "items": [
          "AWS",
          "Application Load Balancer",
          "Amazon RDS",
          "AWS Secrets Manager"
        ]
      },
      {
        "group": "Delivery",
        "items": [
          "Docker",
          "GitHub Actions",
          "GitHub OIDC",
          "Trivy",
          "Infrastructure as code"
        ]
      }
    ],
    "outcomes": [
      "Product teams call one API instead of managing each model provider.",
      "Access, rate limits, and spend are controlled and visible in one place.",
      "Model changes go through code review and can be rolled back automatically."
    ],
    "decision": {
      "title": "Centralize model access before every service invents it.",
      "body": "Leaving each product to wire its own keys and providers was faster for the first feature and worse for every one after. I shipped a private gateway with one compatible API, spend tracking, and a fallback model, starting from a single-server footprint while the multi-zone move was planned. What I’d do differently: put failover drills and spend alerts in place before more services depended on it."
    }
  },
  "maxval-ip-workflows": {
    "role": "Process Associate",
    "scope": "Intellectual-property services · Sep 2024 – Oct 2025",
    "focus": "AI agents for IP workflows",
    "lead": "Automate the work experienced analysts repeat every day.",
    "overview": "Patent analysts and IP professionals spend hours every week on the USPTO platform, looking up publications and working through the same document tasks. I mapped those daily workflows and built end-to-end automations that do the repetitive parts.",
    "ownership": [
      "Mapped the daily workflows of patent analysts and IP professionals on the USPTO platform to find the repetitive research and document tasks worth automating.",
      "Built end-to-end automations that pair Playwright browser automation with vision-based AI agents, which navigate USPTO systems, fetch publication data, and repeat the document work of experienced IP professionals.",
      "Used language models and vision-language models to understand document layouts and extract structured data.",
      "Delivered durable pipelines that saved 18–20 hours a week and processed hundreds of documents in one-third of the manual time."
    ],
    "numbers": [
      {
        "value": "18+",
        "label": "hours saved every week (18–20)"
      },
      {
        "value": "3x",
        "label": "faster than doing the same documents by hand"
      },
      {
        "value": "100+",
        "label": "documents processed by the pipelines"
      }
    ],
    "tools": [
      {
        "group": "Automation",
        "items": [
          "Python",
          "Playwright",
          "AI agents"
        ]
      },
      {
        "group": "AI",
        "items": [
          "Generative AI",
          "Vision-Language Models",
          "Document AI",
          "Structured outputs"
        ]
      }
    ],
    "outcomes": [
      "18–20 hours of repetitive work removed from the team every week.",
      "Documents processed in a third of the time it took by hand.",
      "Analysts spend their time on judgement, not lookups and copying."
    ],
    "decision": {
      "title": "Automate the browser when the platform has no API.",
      "body": "Waiting for a clean integration surface would have left the repetitive USPTO work untouched. I paired browser automation with vision agents so the pipelines could navigate real screens and extract structured data. Selectors still broke when the UI shifted — next time I’d isolate those touchpoints earlier and add a cheap smoke path that fails loud before a full batch runs."
    }
  },
  "healthcare-outreach": {
    "role": "Full-stack & applied AI engineering",
    "scope": "US healthcare pharmacy · Jul 2025 – Aug 2026",
    "focus": "Voice AI agents, QC & CRM automation",
    "lead": "Build the product around the conversation.",
    "overview": "A US healthcare pharmacy needed to reach thousands of patients by phone and text without missed follow-ups, duplicate calls, or notes copied into the CRM by hand. I built the platform end to end: multiple AI voice agents, the backend that schedules and tracks every call and message, AI quality control for every recorded call, and the dashboards the team works in every day.",
    "ownership": [
      "Built a multi-agent voice-AI platform on Retell AI, with outbound, inbound, and processing agents, that has handled more than 80,000 calls.",
      "Ran 14-day outreach sequences of 7 calls and 6 texts for about 6,600 patients, with 650+ sequences running at once, do-not-call compliance, and race-safe enrollment.",
      "Built LangGraph quality-control agents that transcribe, separate speakers, and score every recorded call, averaging a 94%+ QC score.",
      "Built an MCP server with 29 tools that gives Claude live call, QC, and cost data.",
      "Added LLM post-call analysis that records each call’s outcome, sentiment, and urgency, and writes patient, insurance, and follow-up details back to GoHighLevel, with automatic retries, a provider-outage safety switch, and self-healing checks for stalled sequences.",
      "Integrated GoHighLevel (opportunities, pipelines, workflows, webhooks, tags), Monday.com, and Voxo through an event-driven backend, and built the React dashboards for calls, QC, and costs."
    ],
    "numbers": [
      {
        "value": "80,000+",
        "label": "AI calls handled"
      },
      {
        "value": "94%",
        "label": "average QC score on reviewed calls (94%+)"
      },
      {
        "value": "6,600",
        "label": "patients in 14-day call and SMS outreach"
      },
      {
        "value": "29",
        "label": "MCP tools for live call, QC, and cost data"
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
        "group": "AI",
        "items": [
          "Retell AI",
          "LangGraph",
          "ElevenLabs",
          "Anthropic Claude",
          "OpenAI-compatible LLMs",
          "Model Context Protocol"
        ]
      },
      {
        "group": "Integrations",
        "items": [
          "GoHighLevel CRM",
          "Monday.com",
          "Voxo"
        ]
      }
    ],
    "outcomes": [
      "More than 80,000 calls handled by AI agents, with every call reviewed and scored.",
      "Every call ends with a recorded outcome and a CRM update, with no notes copied by hand.",
      "Follow-ups run on schedule, respect calling hours and do-not-call requests, and recover on their own when something stalls."
    ],
    "decision": {
      "title": "Treat concurrency and recovery as product features.",
      "body": "The voice agents were the visible part; the hard failures were duplicate enrollments, stalled sequences, and CRM writes that never landed. I invested in race-safe enrollment, retries, a provider-outage safety switch, and self-healing checks for stuck outreach. What I’d do differently: ship those recovery paths with the first sequence, not after the first production stall."
    }
  },
  "document-workspace": {
    "role": "Full-stack & document AI engineering",
    "scope": "Legal firm · Jul 2026 – Aug 2026",
    "focus": "Cited answers & PDF automation",
    "lead": "Turn complex document work into a usable product.",
    "overview": "A legal firm works with large PDF packages, repetitive notices, signatures, and legal questions that a generic chatbot can’t answer reliably. I built the product end to end, a Next.js workspace and a FastAPI backend, so research, document preparation, and review happen in one place.",
    "ownership": [
      "Built an AI legal assistant that answers in English or Spanish from the firm’s own library (law textbooks, case files, lecture recordings, and a legal dictionary), streams its response, and cites the exact sources it used.",
      "Automated the review of large, unordered PDF packages: an AI pipeline on AWS Lambda and SQS reads each page’s identifiers, puts the pages back in order, and flags conflicts for staff approval before anything is used.",
      "Turned approved records into ready-to-send legal notices: generated from templates, signed electronically, and stamped on every page.",
      "Built an in-browser stamp editor: drag, scale, and rotate a stamp, preview it, and apply it to every page.",
      "Built the workspace itself: upload, preview, versioning, ownership checks, paginated lists, and download, backed by 176 automated tests across frontend and backend."
    ],
    "numbers": [
      {
        "value": "2",
        "label": "languages supported by the assistant: English and Spanish"
      },
      {
        "value": "4",
        "label": "kinds of source material the assistant cites"
      },
      {
        "value": "176",
        "label": "automated tests across frontend and backend"
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
    ],
    "decision": {
      "title": "Keep a human gate on conflicted document packages.",
      "body": "Fully auto-accepting reordered PDF packages would have been faster and wrong more often. The pipeline orders pages and flags conflicts, but staff still approve before anything is used downstream. Citations in the assistant followed the same rule: every answer has sources a reviewer can open. Next time I’d surface conflict rates in the workspace earlier so the review queue stays honest."
    }
  },
  "product-advisor": {
    "role": "Backend & applied AI engineering",
    "scope": "Online pharmacy · Mar 2025 – Aug 2026",
    "focus": "Multilingual, multimodal AI",
    "lead": "Meet people in the way they choose to ask.",
    "overview": "Customers of an online skincare and pharmacy business wanted personal product advice in their own language, in whatever form they chose to ask: a typed question, a voice note, or a short video of their skin. I built the production backend behind that advisor, including its AI, subscriptions, and catalog sync.",
    "ownership": [
      "Built the backend for an AI shopping advisor that customers talk to by text, voice, or video in Italian, English, or French, which recommends catalog products and adds them to the cart.",
      "Built video skin analysis: the system picks the clearest frame from the customer’s video, Gemini assesses the skin, and the findings become personalized product recommendations.",
      "Built the multilingual RAG pipeline: query expansion, OpenAI embeddings in ChromaDB, Jina reranking of the top 15 results down to 5, answers from Llama 3.3 70B on Groq, and Whisper for voice questions.",
      "Kept recommendations in sync with the live catalog through an event-driven pipeline (MySQL, SQS, Lambda) with signed requests.",
      "Built Stripe subscriptions with plan limits and usage quotas, on Django, Celery, and Redis."
    ],
    "numbers": [
      {
        "value": "3",
        "label": "ways to ask: text, voice, or video"
      },
      {
        "value": "3",
        "label": "languages: Italian, English, and French"
      },
      {
        "value": "5",
        "label": "AI services working together behind one answer"
      },
      {
        "value": "18",
        "label": "months of production development"
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
    ],
    "decision": {
      "title": "Meet multimodal demand without trusting every frame.",
      "body": "Customers wanted text, voice, and video in three languages; shipping all three at once meant more failure modes than a chat-only advisor. I kept video analysis behind a clear-frame pick before recommendations, and tied catalog sync to events so answers stayed current. What I’d tighten first next time: stricter frame quality gates and clearer empty states when the video isn’t usable."
    }
  }
};
