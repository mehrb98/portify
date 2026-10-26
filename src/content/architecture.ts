// Fixed content of the architecture section, copied from the approved design (Architecture.dc.html).

export type Layer = { n: string; name: string; items: string[]; edge?: string; highlight?: boolean };
export type Principle = { t: string; where: string; d: string };

export const ARCHITECTURE_LAYERS: Layer[] = [
  { n: "01", name: "client", items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Admin dashboards", "iOS app", "Flutter"], edge: "HTTPS, REST, GraphQL" },
  { n: "02", name: "api", items: ["REST APIs", "GraphQL", "OpenAPI via zod-openapi", "Swagger", "Authentication"], edge: "typed contracts" },
  { n: "03", name: "services", items: ["NestJS microservices", "Ruby on Rails", "C# / .NET", "FastAPI", "RabbitMQ"], edge: "queries, transactions", highlight: true },
  { n: "04", name: "data", items: ["PostgreSQL", "MySQL", "MongoDB", "Prisma", "Append-only ledger"], edge: "context, retrieval" },
  { n: "05", name: "ai", items: ["LangChain", "LangGraph", "LLaMA", "Python"], edge: "webhooks, SDKs" },
  { n: "06", name: "external", items: ["Stripe", "StoreKit", "Google Calendar API"], edge: "deployed on" },
  { n: "07", name: "infra", items: ["Docker", "AWS", "Google Cloud", "Azure", "Git"] },
];

export const ARCHITECTURE_PRINCIPLES: Principle[] = [
  { t: "Isolate third-party providers", where: "Elferplatz billing", d: "Payments go through one strategy interface, so Stripe and StoreKit are interchangeable details, not business logic." },
  { t: "Never overwrite money", where: "credit ledger", d: "Credits live in an append-only ledger. Balances are derived, auditable and consistent." },
  { t: "Contract-first APIs", where: "zod-openapi", d: "Schemas drive validation and the OpenAPI docs, with clear Swagger tags for the next developer." },
  { t: "Own it to production", where: "Roomify", d: "Requirements, architecture, implementation and deployment, handled as one piece of work." },
];
