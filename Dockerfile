FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
ENV NODE_OPTIONS="--max-old-space-size=1024"
RUN npm run build > build-log.txt 2>&1 || (cat build-log.txt && exit 1)

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# SQLite persistent via Volume
VOLUME ["/app/data"]
ENV DATABASE_PATH="/app/data/training.db"

EXPOSE 3000
CMD ["node", "server.js"]
