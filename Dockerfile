# Dockerfile for Next.js Application

# ---- Base ----
# Use an official Node.js runtime as a parent image
FROM node:20-alpine AS base

# ---- Dependencies ----
# Install dependencies first, in a separate step to take advantage of Docker's caching.
FROM base AS deps
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json ./
COPY package.json ./

# Install production dependencies
RUN npm install --omit=dev

# ---- Builder ----
# Build the application
FROM base AS builder
WORKDIR /app

# Copy dependencies from the 'deps' stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set NEXT_TELEMETRY_DISABLED to 1 to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED 1

# Build the Next.js application
RUN npm run build

# ---- Runner ----
# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
# Again, disable telemetry in the production image
ENV NEXT_TELEMETRY_DISABLED 1


# Copy the standalone Next.js server output
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Set the correct user for running the application
USER nextjs

# Expose the port the app runs on
EXPOSE 9002

# The command to start the app
CMD ["node", "server.js"]
