# ---------- base: install all dependencies ----------
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# ---------- test: docker build --target test ./api (runs npm test) ----------
FROM base AS test
RUN npm test

# ---------- production: runtime dependencies only, non-root (must stay the LAST stage) ----------
FROM node:20-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY . .
EXPOSE 3000
HEALTHCHECK --interval=15s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/health || exit 1
USER node
CMD ["node", "index.js"]
