# ---- Base ----
FROM node:20-alpine AS base
WORKDIR /app

# ---- Dependencies ----
FROM base AS deps
WORKDIR /app

# Install dependencies based on the lock file
COPY package.json package-lock.json* ./

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl libc6-compat
COPY prisma ./prisma
RUN npm ci

# ---- Builder ----
FROM base AS builder
WORKDIR /app

# Copy dependencies from the 'deps' stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build the Next.js application
RUN npm run build

# ---- Runner ----
FROM base AS runner
WORKDIR /app

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl libc6-compat

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs \
    && adduser  --system --uid 1001 nextjs


COPY --from=builder /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma

# Change ownership of the node_modules directory
RUN chown -R nextjs:nodejs .

USER nextjs

EXPOSE 9002
ENV PORT 9002
ENV HOSTNAME "0.0.0.0"

# Start the application
CMD ["node", "server.js"]