
# ---- Base ----
FROM node:20 as base
WORKDIR /app

# ---- Dependencies ----
FROM base as deps
COPY package.json package-lock.json ./
RUN npm install

# ---- Build ----
FROM base as builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build the Next.js application
RUN npm run build

# ---- Runner ----
FROM base as runner
WORKDIR /app

# Copy built assets from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 9002

# Start the application
CMD ["npm", "run", "start"]
