# ---------- Stage 1: Install dependencies ----------
FROM node:20-alpine AS deps
WORKDIR /app

# Prisma engines expect OpenSSL on Alpine
RUN apk add --no-cache openssl libc6-compat

COPY package.json package-lock.json* ./
COPY prisma ./prisma

# If your package.json has a postinstall that runs prisma generate,
# copying prisma BEFORE npm ci is required (which we do above).
RUN npm ci

# ---------- Stage 2: Build the application ----------
FROM node:20-alpine AS builder
WORKDIR /app

# Needed for prisma generate on Alpine
RUN apk add --no-cache openssl libc6-compat

# Use deps
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# If your generate needs a DATABASE_URL, prefer a build arg instead of ENV:
# ARG DATABASE_URL
# ENV DATABASE_URL=${DATABASE_URL}

# Be explicit about schema path (avoids "schema not found" edge cases)
RUN npx prisma generate --schema ./prisma/schema.prisma

# Build Next.js
RUN npm run build

# ---------- Stage 3: Production image ----------
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Prisma client may load native engines at runtime; keep OpenSSL available
RUN apk add --no-cache openssl libc6-compat

# Non-root user
RUN addgroup --system --gid 1001 nodejs \
    && adduser  --system --uid 1001 nextjs

# Minimal files for Next standalone runtime
COPY --from=builder /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

USER nextjs

# If your app listens on 9002:
ENV PORT=9002
EXPOSE 9002

# server.js is included in .next/standalone at the container root
CMD ["node", "server.js"]
