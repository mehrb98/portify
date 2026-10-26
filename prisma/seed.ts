// Seeds the database with the content of the approved design (taken from the CV).
// Values in [brackets] are placeholders still to be filled in from the admin dashboard.
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  await db.$transaction([
    db.jobTechnology.deleteMany(),
    db.job.deleteMany(),
    db.project.deleteMany(),
    db.company.deleteMany(),
    db.technology.deleteMany(),
    db.education.deleteMany(),
    db.certificate.deleteMany(),
    db.milestone.deleteMany(),
    db.profile.deleteMany(),
  ]);

  await db.profile.create({
    data: {
      id: 1,
      name: "Mehrulloh Boboev",
      headline: "Full-Stack Developer",
      status: "Full-stack Developer",
      location: "Esslingen, Germany",
      pitch:
        "I build production systems end to end: payment and subscription microservices with Stripe and StoreKit, booking platforms, commerce frontends and AI features that actually ship. 4+ years across TypeScript, Next.js, NestJS and Ruby on Rails.",
      email: "mehrb98@gmail.com",
      github: "https://github.com/mehrb98",
      linkedin: "https://linkedin.com/in/mehrulloh-boboev",
      cvUrl: "", // the CV PDF includes a phone number, so it is not shipped by default
      photoUrl: "/portrait.jpg",
      facts: [
        { k: "role", v: "Full-Stack Developer" },
        { k: "company", v: "W&S Digital GmbH" },
        { k: "experience", v: "Since 09/2022 in IT" },
        { k: "languages", v: "German, English, Russian, Tajik" },
      ],
      coreStack: ["TypeScript", "Next.js", "React", "NestJS", "Ruby on Rails", "PostgreSQL", "Prisma", "Docker"],
      metrics: [
        { n: "3 companies", l: "Quimron, Orcaya and W&S Digital in Germany" },
        { n: "12 products", l: "Built or contributed to across billing, commerce, booking and education" },
        { n: "Ausbildung", l: "Software Developer training completed in 2025" },
      ],
      aboutTitle: "I like owning a feature from the first conversation to the deploy.",
      about: [
        "I'm a full-stack developer based in Stuttgart. Since 2022 I've worked at three German software companies, moving from Ruby on Rails platforms for employers and schools to TypeScript microservices for billing, commerce and booking.",
        "At W&S Digital I designed and built the billing microservice behind Elferplatz, a live Porsche configuration platform, and ship features across three parallel products with NestJS, Next.js and PostgreSQL.",
        "I completed my Ausbildung as a Software Developer at IT School Stuttgart (2022 to 2025) alongside professional work. Before software, I earned a Bachelor of Law in Dushanbe.",
      ],
      strengths: [
        { t: "End-to-end ownership", d: "Took Roomify from requirements and architecture to deployment; designed the Elferplatz billing service from scratch." },
        { t: "Payments and billing", d: "Provider-agnostic Stripe and StoreKit payments, an append-only credit ledger and subscription management." },
        { t: "Two ecosystems", d: "TypeScript with Next.js and NestJS, plus Ruby on Rails, with clean data modelling in PostgreSQL and Prisma." },
        { t: "AI features that ship", d: "LangChain and LangGraph features in production, and LLaMA-based recommendations." },
      ],
      sections: { about: true, stack: true, experience: true, projects: true, sideProjects: true, architecture: true, education: true },
    },
  });

  const ws = await db.company.create({ data: { name: "W&S Digital GmbH", shortName: "W&S Digital", order: 0 } });
  const orcaya = await db.company.create({ data: { name: "Orcaya GmbH", shortName: "Orcaya", order: 1 } });
  const quimron = await db.company.create({ data: { name: "Quimron GmbH", shortName: "Quimron", order: 2 } });

  // [name, category, toolkitGroup, showOnTimeline]
  const techs: [string, string, string | null, boolean][] = [
    ["Ruby", "Languages", null, true],
    ["JavaScript", "Languages", null, true],
    ["TypeScript", "Languages", null, true],
    ["C#", "Languages", null, true],
    ["Dart", "Languages", null, true],
    ["React", "Frontend", null, true],
    ["Next.js", "Frontend", null, true],
    ["Ruby on Rails", "Backend", null, true],
    ["REST APIs", "Backend", null, true],
    ["NestJS", "Backend", null, true],
    ["Microservices", "Backend", null, false],
    ["Data modelling", "Data", null, true],
    ["PostgreSQL", "Data", null, true],
    ["Google Calendar API", "Integrations and AI", null, true],
    ["LLaMA", "Integrations and AI", null, true],
    ["Stripe", "Integrations and AI", null, true],
    ["StoreKit", "Integrations and AI", null, true],
    ["zod-openapi", "Integrations and AI", null, true],
    ["Flutter", "Mobile", null, true],
    ["Docker", "Tools", "Core", false],
    ["Prisma", "Tools", "Core", false],
    ["Git", "Tools", "Core", false],
    ["LangChain", "AI", "AI", false],
    ["LangGraph", "AI", "AI", false],
    ["FastAPI", "AI", "AI", false],
    ["Python", "AI", "AI", false],
    ["Tailwind CSS", "Frontend", "Frontend", false],
    ["HTML", "Frontend", "Frontend", false],
    ["CSS", "Frontend", "Frontend", false],
    ["Angular (basic)", "Frontend", "Frontend", false],
    ["GraphQL", "Data", "Also familiar", false],
    ["MongoDB", "Data", "Also familiar", false],
    ["MySQL", "Data", "Also familiar", false],
    ["RabbitMQ", "Backend", "Also familiar", false],
    ["AWS", "Tools", "Also familiar", false],
    ["Google Cloud", "Tools", "Also familiar", false],
    ["Azure", "Tools", "Also familiar", false],
  ];
  const tech: Record<string, string> = {};
  for (const [i, [name, category, toolkitGroup, showOnTimeline]] of techs.entries()) {
    const t = await db.technology.create({ data: { name, category, toolkitGroup, showOnTimeline, order: i } });
    tech[name] = t.id;
  }
  const link = (names: string[]) => ({ create: names.map((n) => ({ technologyId: tech[n] })) });

  await db.job.create({
    data: {
      companyId: ws.id, role: "Full-Stack Developer", start: "2025-08", end: null, order: 0,
      bullets: [
        "Designed and built the billing microservice for Elferplatz, a live Porsche configuration platform: a provider-agnostic Stripe and StoreKit payment strategy, an append-only credit ledger with consistent balances, and subscription management modelled on ERPNext.",
        "Implemented a two-stage admin approval flow for subscription plans and credit packages with Stripe synchronisation, cutting manual configuration work for the admin team.",
        "Shipped full-stack features for three parallel products (Kessler online shop, Kastis booking tool, Theon Configurator admin dashboard) with NestJS microservices, Next.js and PostgreSQL.",
        "Restructured the API documentation with zod-openapi and clear Swagger tagging, improving onboarding time and developer experience. Also contributed to Proaccenta, a translation platform.",
      ],
      technologies: link(["NestJS", "Next.js", "TypeScript", "JavaScript", "React", "PostgreSQL", "Stripe", "StoreKit", "zod-openapi", "Microservices", "REST APIs", "Data modelling"]),
    },
  });
  await db.job.create({
    data: {
      companyId: orcaya.id, role: "Full-Stack Developer", start: "2024-03", end: "2025-07", order: 1,
      bullets: [
        "Built Roomify on my own, a booking platform with Google Calendar integration, from requirements analysis and architecture to deployment.",
        "Developed features for the VfB Stuttgart online shop and the Topmotive FileUpload platform (Next.js, TypeScript), integrating external APIs for real-time data synchronisation.",
        "Built a movie recommendation platform with LLaMA-based recommendations in C# and a responsive interface.",
        "Took an active part in code reviews and agile processes to keep code quality and maintainability high.",
      ],
      technologies: link(["Next.js", "TypeScript", "JavaScript", "React", "Google Calendar API", "C#", "LLaMA"]),
    },
  });
  await db.job.create({
    data: {
      companyId: quimron.id, role: "Full-Stack Developer", start: "2022-09", end: "2024-02", order: 2,
      bullets: [
        "Developed and maintained yoodoo, a task management platform for employers, built on Ruby on Rails.",
        "Contributed to yoomind.com, a digital learning platform for schools: backend logic, user management and content workflows.",
        "Contributed to the SEZ project (sez.de), which promotes global education and youth engagement in Baden-Württemberg and Burundi.",
        "Owned features across the stack: data modelling, REST APIs, frontend interfaces and deployment support.",
      ],
      technologies: link(["Ruby on Rails", "Ruby", "REST APIs", "Data modelling", "JavaScript"]),
    },
  });

  const work = [
    {
      name: "Elferplatz billing microservice", companyId: ws.id, period: "2025 to now", role: "Designed and built", featured: true, size: "featured",
      summary: "Payments, credits and subscriptions for a live Porsche configuration platform, used from the web and from an iOS app.",
      details: [
        { k: "provider-agnostic", v: "One payment strategy for Stripe on the web and StoreKit on iOS, so a new provider does not touch billing logic." },
        { k: "consistent balances", v: "An append-only credit ledger: balances are derived from entries, never edited in place." },
        { k: "subscriptions", v: "Plan and subscription management modelled on ERPNext." },
        { k: "admin workflow", v: "Two-stage approval for plans and credit packages with Stripe sync, removing manual configuration steps." },
      ],
      tags: ["Microservices", "Stripe", "StoreKit", "Ledger design", "Subscriptions"],
    },
    {
      name: "Roomify", companyId: orcaya.id, period: "2024 to 2025", role: "Built end to end", size: "main",
      summary: "A booking platform with Google Calendar integration. I took it from requirements analysis and architecture through to deployment.",
      focus: "Owning the full lifecycle: requirements, system design, calendar integration and deployment.",
      tags: ["Google Calendar API", "Architecture", "Deployment"],
    },
    {
      name: "Kessler, Kastis and Theon Configurator", companyId: ws.id, period: "2025 to now", role: "Full-stack features", size: "main",
      summary: "Three products in parallel: an online shop, a booking tool and the admin dashboard of a configurator. Also contributed to Proaccenta, a translation platform.",
      focus: "Shipping across several codebases on a shared NestJS microservice architecture.",
      tags: ["NestJS", "Next.js", "PostgreSQL", "Microservices"],
    },
    { name: "VfB Stuttgart shop and Topmotive FileUpload", companyId: orcaya.id, period: "2024 to 2025", summary: "Features for a football club online shop and a file upload platform, with external APIs for real-time data sync.", tags: ["Next.js", "External APIs"] },
    { name: "Movie recommendation platform", companyId: orcaya.id, period: "2024 to 2025", summary: "LLaMA-based recommendations built in C#, with a responsive interface.", tags: ["C#", "LLaMA"] },
    { name: "API documentation overhaul", companyId: ws.id, period: "2025 to now", summary: "Restructured the API docs with zod-openapi and clear Swagger tags to shorten onboarding for developers.", tags: ["zod-openapi", "Swagger"] },
    { name: "yoodoo", companyId: quimron.id, period: "2022 to 2024", summary: "A task management platform for employers that I developed and maintained on Ruby on Rails.", tags: ["Ruby on Rails"], url: "https://yoodoo.quimron.net" },
    { name: "yoomind", companyId: quimron.id, period: "2022 to 2024", summary: "A digital learning platform for schools: backend logic, user management and content workflows.", tags: ["Backend", "User management"], url: "https://yoomind.com" },
    { name: "SEZ", companyId: quimron.id, period: "2022 to 2024", summary: "A project promoting global education and youth engagement in Baden-Württemberg and Burundi.", tags: ["Full-stack"], url: "https://sez.de" },
  ];
  for (const [i, p] of work.entries()) {
    await db.project.create({ data: { kind: "WORK", size: "compact", ...p, order: i } });
  }

  const side = [
    {
      name: "AI Chatbot Platform", period: "2026", role: "three services", size: "main", url: "https://github.com/mehrb98/chatbot",
      summary: "An AI chatbot split into three services. The Rails API owns auth and business data and re-authorizes every AI tool call, so the AI service never touches business tables.",
      flow: "Next.js → Rails API → FastAPI + LangGraph → LLM\nPostgreSQL · pgvector (RAG) · Redis",
      tags: ["Next.js", "Rails 8 API", "JWT", "Pundit", "Sidekiq", "FastAPI", "LangGraph", "pgvector", "Docker"],
    },
    {
      name: "Tafakkur Studio", period: "2026", role: "AI content pipeline", size: "main", url: "https://github.com/mehrb98/tafakkur.studio",
      summary: "Turns a topic into an animated video. A LangGraph pipeline runs research, script, storyboard, characters, images, animation, voice, subtitles and SEO, with storage and social publishing around it.",
      flow: "Next.js → Rails API (Interactors) → Sidekiq → FastAPI + LangGraph\nPostgreSQL · Redis · MinIO",
      tags: ["Next.js", "Rails API", "Sidekiq", "FastAPI", "LangGraph", "MinIO", "Docker"],
    },
    {
      name: "Tafakkur LMS", period: "2026", role: "web and mobile", size: "main", url: "https://github.com/mehrb98/tafakkur.lms",
      summary: "School platform with dashboards for admins, teachers, students and parents on web and mobile. The Flutter app signs you in on the web by scanning a QR code.",
      flow: "Next.js 16 + Flutter app → Rails 8 API → PostgreSQL · Redis\nDevise JWT · Pundit · Sidekiq-cron · Swagger (rswag)",
      tags: ["Rails 8", "Next.js 16", "HeroUI", "TanStack Query", "Flutter", "Dart", "Docker"],
    },
    {
      name: "E-commerce platform", period: "2026", role: "API and storefront", size: "main", url: "https://github.com/mehrb98/e-commerce",
      summary: "Shop backend and storefront: auth, catalog, cart, orders and Stripe payments in a NestJS API, with a Next.js storefront using Redux Toolkit and Stripe Elements.",
      flow: "Next.js storefront → NestJS API → Prisma → PostgreSQL\nJWT (Passport) · Swagger · rate limiting · Stripe",
      tags: ["NestJS 11", "Prisma", "PostgreSQL", "Stripe", "Next.js", "Redux Toolkit", "Docker"],
    },
    { name: "LangGraph agents", period: "2026", size: "more", summary: "Python agents: ReAct, RAG, memory and a document drafter.", url: "https://github.com/mehrb98/langgraph-course" },
    { name: "Booking app", period: "2025", size: "more", summary: "Flutter booking app with GetX state management.", url: "https://github.com/mehrb98/booking_app" },
    { name: "VfB profile", period: "2025", size: "more", summary: "Angular 19 profile page with Tailwind CSS and Flowbite.", url: "https://github.com/mehrb98/vfb-profile" },
    { name: "Quote", period: "2025", size: "more", summary: "Next.js app with Prisma and HeroUI.", url: "https://github.com/mehrb98/quote" },
    { name: "AskIt", period: "2024", size: "more", summary: "Rails 7 and Hotwire questions-and-answers app with Excel import and export.", url: "https://github.com/mehrb98/AskIt" },
    { name: "yooneed", period: "2024", size: "more", summary: "Rails 7 shop with RSpec, Capybara and FactoryBot tests.", url: "https://github.com/mehrb98/yooneed" },
  ];
  for (const [i, p] of side.entries()) {
    await db.project.create({ data: { kind: "SIDE", tags: [], ...p, order: i } });
  }

  await db.education.create({
    data: {
      kind: "AUSBILDUNG", title: "Software Developer", school: "IT School Stuttgart", location: "Stuttgart, Germany", startYear: 2022, endYear: 2025, order: 0,
      details: [
        { k: "Fachrichtung", v: "[Fachrichtung, e.g. Anwendungsentwicklung]" },
        { k: "Final project", v: "[IHK Abschlussprojekt, if applicable]" },
        { k: "In parallel", v: "Full-stack roles at Quimron and Orcaya" },
      ],
    },
  });
  await db.education.create({
    data: { kind: "DEGREE", title: "Bachelor of Law", school: "Tajik National University", location: "Dushanbe, Tajikistan", startYear: 2016, endYear: 2020, order: 1, details: [] },
  });

  const certs: ["RECOGNITION" | "COURSE", string, string][] = [
    ["RECOGNITION", "Finalist, Cursor Social Media Hackathon Stuttgart", "07/2026"],
    ["RECOGNITION", "Prompt Battle, Cursor Meetup Stuttgart", "07/2026"],
    ["COURSE", "Docker, Hands-On DevOps", "Udemy"],
    ["COURSE", "The Complete Ruby on Rails Developer Course", "Udemy"],
    ["COURSE", "C# Advanced Topics", "Udemy"],
  ];
  for (const [i, [kind, title, meta]] of certs.entries()) await db.certificate.create({ data: { kind, title, meta, order: i } });

  const ms: [string, string, string][] = [
    ["Ausbildung", "2022", "Started Software Developer training at IT School Stuttgart"],
    ["Ausbildung", "09/2022", "First role at Quimron: Ruby on Rails platforms for employers and schools"],
    ["Ausbildung", "2022–24", "Features across the stack: data models, REST APIs, frontend, deployment support"],
    ["Professional developer", "03/2024", "Moved to Orcaya and to Next.js and TypeScript"],
    ["Professional developer", "2024–25", "Built Roomify end to end, from requirements to deployment"],
    ["Professional developer", "2025", "Completed the Ausbildung"],
    ["Full-stack engineer", "08/2025", "Joined W&S Digital as Full-Stack Developer"],
    ["Full-stack engineer", "2025–26", "Designed the Elferplatz billing microservice"],
    ["Full-stack engineer", "07/2026", "Finalist at the Cursor Social Media Hackathon Stuttgart"],
  ];
  for (const [i, [phase, label, text]] of ms.entries()) await db.milestone.create({ data: { phase, label, text, order: i } });

  console.log("Seeded.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
