# ---- Base ----
FROM node:22-alpine AS base
WORKDIR /app

# ---- Dependencies ----
FROM base AS deps
WORKDIR /app

# Install deps from lockfile WITHOUT running postinstall scripts
COPY package.json package-lock.json* ./
RUN npm ci --ignore-scripts

# ---- Builder ----
FROM base AS builder
WORKDIR /app

# OS deps so Prisma detects OpenSSL 3 on Alpine
RUN apk add --no-cache openssl libc6-compat

# Bring node_modules from deps, then copy the whole app (incl. prisma/)
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma AFTER prisma/ is present (and openssl installed)
RUN npx prisma generate

# Build Next.js
RUN npm run build

# ---- Runner ----
FROM base AS runner
WORKDIR /app

# Runtime OS deps
RUN apk add --no-cache openssl libc6-compat

# Non-root user
RUN addgroup --system --gid 1001 nodejs \
    && adduser  --system --uid 1001 nextjs

# Copy built app
COPY --from=builder /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma

# Permissions
RUN chown -R nextjs:nodejs .

USER nextjs

EXPOSE 9002
ENV NODE_ENV=production
ENV PORT=9002
ENV HOSTNAME="0.0.0.0"

# Start the standalone server
CMD ["node", "server.js"]
