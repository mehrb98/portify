# Production image. Dokploy (or any Docker host) builds this file; env vars come from the host.
FROM node:22-bookworm-slim AS base
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates && rm -rf /var/lib/apt/lists/*
WORKDIR /app

FROM base AS build
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci
COPY . .
# The build only needs a syntactically valid URL; nothing connects to it.
RUN DATABASE_URL="postgresql://build:build@localhost:5432/build" npm run build

FROM base AS run
ENV NODE_ENV=production PORT=3000 HOSTNAME=0.0.0.0
# Dev dependencies stay so prisma, tsx, the seed and create-admin can be run inside the container.
COPY --from=build /app ./
EXPOSE 3000
# Apply pending migrations, then start the server.
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
