# ---- Base ----
FROM node:20 as base
WORKDIR /app

# ---- Deps ----
FROM base as deps
COPY package.json package-lock.json* ./
# Copy prisma schema to be available for `prisma generate`
COPY prisma ./prisma
RUN npm install

# ---- Build ----
FROM deps as builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ---- Runner ----
FROM base as runner
# Don't copy from 'base' which has all source code, only copy built artifacts
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
# Prisma client needs the schema file to be present in the runner
COPY --from=builder /app/prisma ./prisma

# Expose the port the app runs on
EXPOSE 9002

CMD ["npm", "start"]
