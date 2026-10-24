export const EMAIL = 'umeshyenugula2007@gmail.com'
export const SOCIALS = [
  ['GitHub', 'https://github.com/umeshyenugula'],
  ['LinkedIn', 'https://www.linkedin.com/in/umesh-chandran-yenugula-0a2576317'],
]
export const PROFILES = [
  { name: 'LeetCode', handle: '@umeshchandran', href: 'https://leetcode.com/umeshchandran' },
  { name: 'CodeChef', handle: '@umeshyenugula', href: 'https://www.codechef.com/users/umeshyenugula' },
  { name: 'HackerRank', handle: '@24241A05AV', href: 'https://www.hackerrank.com/24241A05AV' },
]
export const SKILLS = [
  ['Languages', ['Python', 'JavaScript', 'Java', 'Go', 'C', 'C++', 'Bash']],
  ['Frontend', ['React', 'Next.js', 'HTML5', 'CSS3', 'Tailwind CSS', 'Bootstrap']],
  ['Backend', ['FastAPI', 'Flask', 'Django', 'REST APIs', 'WebSockets', 'gRPC']],
  ['Databases', ['PostgreSQL', 'MongoDB', 'Supabase', 'Neo4j Aura', 'Redis']],
  ['Cloud & DevOps', ['Docker', 'Git', 'GitHub', 'Vercel', 'Render', 'Kafka', 'DigitalOcean']],
  ['Auth & Security', ['JWT', 'Google OAuth', 'OAuth 2.0', 'HTTPS / TLS / SSL']],
  ['Tools', ['Linux', 'Postman', 'cURL', 'Pandas', 'OpenPyXL']],
]
export const COURSES = ['Data Structures & Algorithms', 'Operating Systems', 'Computer Networks', 'DBMS', 'Software Engineering', 'OOP']

// "Skills, with receipts": each claim points at the system that demonstrates it.
export const PROOF_MAP = [
  {
    skill: 'Go',
    claim: 'A modular API where identity, ingestion, retrieval, inference and chat are separate packages in one container, with an inference adapter that enforces limits, timeouts and cancellation.',
    to: '/work/jnana-setu',
    where: 'JñānaSetu',
  },
  {
    skill: 'React · Vite · TypeScript',
    claim: 'An admin dashboard and an iframe-isolated chat widget built as separate Vite apps, plus a ViduraNīti front end designed around TanStack Query and an IndexedDB cache that is never the authority for payments.',
    to: '/work/jnana-setu',
    where: 'JñānaSetu · ViduraNīti',
  },
  {
    skill: 'Python backends',
    claim: 'A modular FastAPI backend with ten business domains, and Flasio, an ASGI framework I wrote myself and published on PyPI.',
    to: '/work/flasio',
    where: 'ViduraNīti · Flasio',
  },
  {
    skill: 'Data and search',
    claim: 'Postgres with row-level security and pgvector HNSW search at 384 dimensions, and PostgreSQL as the financial source of truth with Redis kept strictly as cache and queue.',
    to: '/work/jnana-setu',
    where: 'JñānaSetu · ViduraNīti',
  },
  {
    skill: 'Security by design',
    claim: 'Server-resolved tenants, private storage, idempotency keys, immutable decision records, and payments marked settled only after on-chain confirmation.',
    to: '/work/vidura-niti',
    where: 'ViduraNīti',
  },
  {
    skill: 'AI in production',
    claim: 'Self-hosted embeddings and Qwen3-4B on llama.cpp for grounded answers, and an ML anomaly score that escalates risky payments to a human instead of deciding alone.',
    to: '/work/jnana-setu',
    where: 'JñānaSetu · ViduraNīti',
  },
]
