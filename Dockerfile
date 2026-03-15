FROM node:20 AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# --- DAS IST NEU: ---
# Wir erstellen den Ordner und setzen den Pfad schon WÄHREND des Builds, 
# damit das Prerendering von Next.js nicht abstürzt!
RUN mkdir -p /app/data
ENV DATABASE_PATH="/app/data/training.db"
# --------------------

ENV NODE_OPTIONS="--max-old-space-size=1024"
RUN npm run build

FROM node:20 AS runner
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
