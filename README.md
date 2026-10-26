# Mehrulloh Boboev · portfolio

One-page portfolio (public site) and an admin dashboard for editing its content.

- Next.js 16 (App Router), TypeScript, Tailwind CSS v4
- PostgreSQL with Prisma 6
- Admin sign-in: [Better Auth](https://www.better-auth.com) (email and password, Prisma adapter, sign-up disabled, rate-limited), one owner account

## Run locally

```bash
npm install
cp .env.example .env              # then fill in the values
docker run -d --name portfolio-db -e POSTGRES_USER=portfolio -e POSTGRES_PASSWORD=portfolio \
  -e POSTGRES_DB=portfolio -p 5432:5432 postgres:16   # or use any PostgreSQL
npx prisma migrate deploy         # create the tables
npm run db:seed                   # load the content from the CV
npm run create-admin -- "a long password"    # create (or reset) the admin account
npm run dev
```

Site: http://localhost:3000 · Admin: http://localhost:3000/admin

## Environment variables

| Name | What it is |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `ADMIN_EMAIL` | The only email that can sign in (used by `npm run create-admin`) |
| `BETTER_AUTH_SECRET` | 32+ random characters (`openssl rand -base64 32`) |
| `BETTER_AUTH_URL` | The site's public URL |
| `SITE_URL` | Public URL, used for canonical, Open Graph, sitemap and robots |

All of them are server-only; nothing secret reaches the browser.

## Where things live

- `prisma/schema.prisma`, `prisma/seed.ts`: content model and the initial content
- `src/lib/content.ts`: queries used by the site and the admin (technology periods are derived from the jobs that use them)
- `src/components/site/*`, `src/app/page.tsx`: public page
- `src/app/admin/*`, `src/components/admin/*`, `src/lib/admin/*`: admin pages, forms and server actions
- `src/lib/better-auth.ts`, `src/app/api/auth/[...all]/route.ts`: Better Auth setup
- `src/proxy.ts`: sends visitors of `/admin` without a session cookie to the login page (every admin page and action validates the session with `requireAdmin()`)

## Deploy with Dokploy

1. Create a PostgreSQL 16 database in Dokploy (name and user `portfolio`).
2. Create an Application from the GitHub repo, set Build Type to **Dockerfile**, and add the env vars from the table above (`DATABASE_URL` uses the database's internal host).
3. Add your domain under Domains with container port **3000** and HTTPS on.
4. Deploy. The container applies migrations on every start.
5. Once, in the application's terminal: `npm run db:seed` (loads the CV content; running it again replaces all content) and `npm run create-admin -- "a long password"`.

## Before going live

- Fill in the placeholders listed on the admin Overview (company cities, Fachrichtung, final project, Dart/Flutter period).
- CV download: the CV PDF includes a phone number, so it is not shipped. Put a version you are happy to publish in `public/cv/` (or host it elsewhere) and set its URL in Admin → Settings. The CV buttons stay hidden until then.
- Impressum and Datenschutz contain placeholders for your address and legal text.
- Set `SITE_URL`, `BETTER_AUTH_URL` and `BETTER_AUTH_SECRET` on the host, then run `npm run create-admin` once with a strong password.
