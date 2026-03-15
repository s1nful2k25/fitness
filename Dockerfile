FROM node:20 AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# === 1. DATENBANK TEMPLATE ERSTELLEN ===
RUN mkdir -p /app/data
ENV DATABASE_PATH="/app/data/training.db"

# Wir führen Drizzle hier im Builder aus, wo alle Werkzeuge noch da sind!
# Das erstellt die Tabellen in der /app/data/training.db
RUN npx drizzle-kit push

# Wir sichern die frisch strukturierte Datenbank als "Vorlage"
RUN cp /app/data/training.db /app/template.db
# =======================================

ENV NODE_OPTIONS="--max-old-space-size=1024"
RUN npm run build

FROM node:20 AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# === 2. TEMPLATE IN DEN RUNNER KOPIEREN ===
COPY --from=builder /app/template.db /app/template.db

# SQLite persistent via Volume
VOLUME ["/app/data"]
ENV DATABASE_PATH="/app/data/training.db"

EXPOSE 3000

# === 3. DER MAGISCHE START-BEFEHL ===
# Prüft beim Hochfahren: Ist die Datenbank im Volume nicht vorhanden?
# Wenn ja -> Kopiere das Template. Danach -> Starte Next.js!
CMD ["sh", "-c", "mkdir -p /app/data && if [ ! -f /app/data/training.db ]; then cp /app/template.db /app/data/training.db; echo 'Template kopiert!'; fi && node server.js"]
