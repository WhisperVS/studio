# Stage 1: Install dependencies
FROM node:20-alpine AS deps
WORKDIR /app
RUN apk add --no-cache openssl libc6-compat
COPY package.json package-lock.json* ./
COPY prisma ./prisma
RUN npm ci

# Stage 2: Build the application
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# The prisma client is generated in the node_modules directory, so we need to run it again
# before the build to ensure it's available for the Next.js build process.
# (postinstall already ran; safe to run again)
RUN npx prisma generate
RUN npm run build

# ---------- Stage 3: Production image ----------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs \
    && adduser  --system --uid 1001 nextjs

COPY --from=builder /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 9002

ENV PORT 9002

# The `next start` command is not used in the standalone output.
# The server is started by running the `server.js` file.
CMD ["node", "server.js"]
