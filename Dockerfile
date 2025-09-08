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

# Generate the Prisma client
ENV DATABASE_URL="file:./dev.db"
# (postinstall already ran; safe to run again)
RUN npx prisma generate

RUN npm run build

# Stage 3: Production image
FROM node:20-alpine AS runner
WORKDIR /app

# Install production dependencies
RUN apk add --no-cache openssl libc6-compat

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs \
    && adduser  --system --uid 1001 nextjs

# Copy necessary files from the builder stage
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

USER nextjs

EXPOSE 9002
ENV PORT 9002
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
