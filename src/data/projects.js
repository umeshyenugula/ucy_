// Central project data. Each `flow` array renders through <ProjectDiagram>,
// a flexible flow-chart that auto-sizes to its label text — this is what
// keeps every node (including Quizzical's longer labels) fully inside its
// box instead of overflowing, on any screen width.
// Update `githubUrl` and `liveDemoUrl` per project to customize the action buttons.

const icon = (name) => `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${name}`

export const projects = [
  {
    id: 'securevoice',
    index: '01',
    category: 'Security & Privacy',
    title: 'SecureVoice',
    githubUrl: 'https://github.com/umeshyenugula/SecureVoice',
    liveDemoUrl: 'https://securevoice-90jv.onrender.com',
    tagline: 'One-time, biometric-gated voice messages — nothing to download, nothing to replay.',
    tick: 'FASTAPI · WEBSOCKETS · FACE-API.JS',
    description:
      'A single-listen voice messenger: audio decrypts only after live facial verification, plays once from memory, and is never written to disk on the receiving end.',
    bullets: [
      { b: 'Biometric gate', t: 'face-api.js liveness check runs client-side before a message will decrypt.' },
      { b: 'In-memory only', t: 'Audio buffers decrypt in memory, play once, and are wiped — never persisted.' },
      { b: 'Realtime channel', t: 'FastAPI + WebSockets push messages the instant a recipient comes online.' },
    ],
    stack: [
      { label: 'FastAPI', icon: icon('fastapi/fastapi-original.svg') },
      { label: 'WebSockets', icon: icon('socketio/socketio-original.svg') },
      { label: 'face-api.js', icon: icon('javascript/javascript-original.svg') },
      { label: 'PostgreSQL', icon: icon('postgresql/postgresql-original.svg') },
    ],
    flow: [
      { label: 'Record & encrypt', sub: 'client-side' },
      { label: 'Face verification', sub: 'face-api.js', accent: true },
      { label: 'One-time decrypt', sub: 'in memory' },
      { label: 'Auto-wipe', sub: 'never persisted' },
    ],
    diagramVariant: 'pipeline',
  },
  {
    id: 'flasio',
    index: '02',
    category: 'Framework',
    title: 'Flasio',
    githubUrl: 'https://github.com/umeshyenugula/Flasio',
    liveDemoUrl: 'https://pypi.org/project/flasio/',
    tagline: "An async ASGI web framework blending Flask's developer experience with Uvicorn concurrency.",
    tick: 'ASGI · UVICORN · PYTHON',
    description:
      'A from-scratch web framework that keeps the Flask-style decorator API developers already know, while running fully async on ASGI for real concurrency under load.',
    bullets: [
      { b: 'Familiar API', t: 'Flask-style routing and decorators — near-zero learning curve for adopters.' },
      { b: 'True async core', t: 'Built directly on ASGI/Uvicorn instead of a WSGI compatibility shim.' },
      { b: 'Middleware pipeline', t: 'Composable request/response middleware with async-first hooks.' },
    ],
    stack: [
      { label: 'Python', icon: icon('python/python-original.svg') },
      { label: 'ASGI', icon: icon('fastapi/fastapi-original.svg') },
      { label: 'Uvicorn', icon: icon('python/python-original.svg') },
    ],
    flow: [
      { label: 'Route decorator', sub: 'Flask-style API' },
      { label: 'ASGI dispatch', sub: 'async core' },
      { label: 'Middleware chain', sub: 'composable hooks', accent: true },
      { label: 'Uvicorn server', sub: 'concurrency' },
    ],
    diagramVariant: 'layers',
  },
  {
    id: 'pystructs',
    index: '03',
    category: 'Library',
    title: 'PyStructs',
    githubUrl: 'https://github.com/umeshyenugula/pystructs',
    liveDemoUrl: 'https://pypi.org/project/pystructs-toolkit/',
    tagline: 'Zero-dependency typed data structures, algorithms & benchmarking, built for teaching and speed.',
    tick: 'PYTHON · TYPING · BENCHMARKS',
    description:
      'A zero-dependency library of classic data structures and algorithms with full type hints, written to be readable enough to learn from and fast enough to actually use.',
    bullets: [
      { b: 'Zero dependencies', t: 'Pure Python — nothing to install, nothing to break on upgrade.' },
      { b: 'Fully typed', t: 'Type-hinted end to end for editor autocomplete and static checking.' },
      { b: 'Built-in benchmarks', t: 'Every structure ships with complexity notes and timing benchmarks.' },
    ],
    stack: [
      { label: 'Python', icon: icon('python/python-original.svg') },
      { label: 'Typing', icon: icon('python/python-original.svg') },
      { label: 'pytest', icon: icon('pytest/pytest-original.svg') },
    ],
    flow: [
      { label: 'Typed structure', sub: 'zero dependencies' },
      { label: 'Unit tests', sub: 'pytest' },
      { label: 'Benchmark run', sub: 'timing + complexity', accent: true },
      { label: 'Publish to PyPI', sub: 'versioned release' },
    ],
    diagramVariant: 'branch',
  },
  {
    id: 'dashboard',
    index: '04',
    category: 'Full-Stack',
    title: 'Personal Management Dashboard',
    githubUrl: 'https://github.com/umeshyenugula/PMD',
    liveDemoUrl: '#',
    tagline: 'A Next.js + Django dashboard with an AI email builder and OAuth-backed accounts.',
    tick: 'NEXT.JS · DJANGO · OAUTH',
    description:
      'A single dashboard for day-to-day admin — inbox, notes, and scheduling — with an AI-assisted email composer and Google OAuth sign-in on a Next.js front end backed by Django.',
    bullets: [
      { b: 'AI email builder', t: 'Drafts and refines emails from a short brief before you send them.' },
      { b: 'Google OAuth', t: 'One-tap sign-in with secure session handling, no password storage.' },
      { b: 'Unified dashboard', t: 'Next.js front end talking to a Django REST back end over one API.' },
    ],
    stack: [
      { label: 'Next.js', icon: icon('nextjs/nextjs-original.svg') },
      { label: 'Django', icon: icon('django/django-plain.svg') },
      { label: 'OAuth 2.0', icon: icon('oauth/oauth-original.svg') },
      { label: 'PostgreSQL', icon: icon('postgresql/postgresql-original.svg') },
    ],
    flow: [
      { label: 'Next.js client', sub: 'dashboard UI' },
      { label: 'Google OAuth', sub: 'sign-in' },
      { label: 'Django REST API', sub: 'business logic', accent: true },
      { label: 'AI email draft', sub: 'assisted compose' },
    ],
    diagramVariant: 'branch',
  },
  {
    id: 'griet-events',
    index: '05',
    category: 'Platform',
    title: 'GRIET Events',
    githubUrl: 'https://github.com/umeshyenugula/grietevents',
    liveDemoUrl: 'https://grieteventstest.onrender.com',
    tagline: 'Event management with QR-code payments and automated Gmail workflows.',
    tick: 'FLASK · QR PAYMENTS · GMAIL API',
    description:
      'A campus event-management platform handling registrations, QR-based payment verification, and automated confirmation emails end to end — built for real event-day load.',
    bullets: [
      { b: 'QR payments', t: 'Generates and verifies payment QR codes at check-in, no manual reconciliation.' },
      { b: 'Automated emails', t: 'Gmail API sends confirmations and reminders without manual follow-up.' },
      { b: 'Live capacity', t: 'Real-time seat and slot tracking across simultaneous events.' },
    ],
    stack: [
      { label: 'Flask', icon: icon('flask/flask-original.svg') },
      { label: 'Gmail API', icon: icon('google/google-original.svg') },
      { label: 'MongoDB', icon: icon('mongodb/mongodb-original.svg') },
    ],
    flow: [
      { label: 'Registration form', sub: 'student sign-up' },
      { label: 'QR payment', sub: 'verified at check-in' },
      { label: 'Gmail API', sub: 'auto-confirmation', accent: true },
      { label: 'Live capacity', sub: 'seat tracking' },
    ],
    diagramVariant: 'pipeline',
  },
  {
    id: 'lazyrecruit',
    index: '06',
    category: 'Progressive Web App',
    title: 'LazyRecruit',
    githubUrl: 'https://github.com/umeshyenugula/Lazy-Recruit',
    liveDemoUrl: 'https://lazy-recruit.vercel.app/',
    tagline: "Offline-first recruitment platform — keeps working when the network doesn't.",
    tick: 'FASTAPI · SUPABASE · SERVICE WORKERS',
    description:
      'A full-stack recruitment platform with role-based auth, candidate management, and domain-wise evaluations — engineered to keep working through unreliable connectivity.',
    bullets: [
      { b: 'Offline-first PWA', t: 'Service workers and IndexedDB cache data locally and sync in the background.' },
      { b: 'Secure REST APIs', t: 'JWT-authenticated endpoints backed by PostgreSQL data models.' },
      { b: 'Recruitment workflow', t: 'Candidate assignment, evaluation tracking, and bulk operations at scale.' },
    ],
    stack: [
      { label: 'FastAPI', icon: icon('fastapi/fastapi-original.svg') },
      { label: 'Supabase', icon: icon('supabase/supabase-original.svg') },
      { label: 'PostgreSQL', icon: icon('postgresql/postgresql-original.svg') },
    ],
    flow: [
      { label: 'Offline queue', sub: 'IndexedDB cache' },
      { label: 'Service worker', sub: 'background sync' },
      { label: 'FastAPI backend', sub: 'role-based auth', accent: true },
      { label: 'PostgreSQL', sub: 'source of truth' },
    ],
    diagramVariant: 'merge',
  },
  {
    id: 'quizzical',
    index: '07',
    category: 'EdTech',
    title: 'Quizzical',
    githubUrl: 'https://github.com/umeshyenugula/Quizzical',
    liveDemoUrl: 'https://quizzical-z3e0.onrender.com',
    tagline: 'AI-generated quizzes with role-based administration and performance analytics.',
    tick: 'FLASK · GROQ API · CLOUDINARY',
    description:
      'An online quiz platform for educational institutions — role-based administration, timed assessments, quiz scheduling, section-wise assignments, and performance analytics, with AI-assisted content generation.',
    bullets: [
      { b: 'AI quiz generation', t: 'Groq API drafts question sets; Cloudinary handles media and image uploads.' },
      { b: 'Hardened by design', t: 'PBKDF2 password hashing, CSRF protection, rate limiting, and bot detection.' },
      { b: 'Role-based access', t: 'Separate admin and student permissions across sections and cohorts.' },
    ],
    stack: [
      { label: 'Flask', icon: icon('flask/flask-original.svg') },
      { label: 'MongoDB', icon: icon('mongodb/mongodb-original.svg') },
      { label: 'Cloudinary', icon: icon('cloudinary/cloudinary-original.svg') },
      { label: 'Groq API', icon: icon('javascript/javascript-original.svg') },
    ],
    // These four labels are the ones that used to overflow their SVG boxes —
    // the flexible ProjectDiagram card sizes to each label, so long text like
    // "Timed assessment" and "Cloudinary media" never clips or misaligns again.
    flow: [
      { label: 'Admin prompt', sub: 'topic & difficulty' },
      { label: 'Groq AI generation', sub: 'question drafting' },
      { label: 'Cloudinary media', sub: 'image uploads' },
      { label: 'Timed assessment', sub: 'analytics & scoring', accent: true },
    ],
    diagramVariant: 'pipeline',
  },
]
