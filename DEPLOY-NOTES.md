# How to use

## Local development
- Build & run:
  ```bash
  docker compose -f docker-compose.dev.yml up --build
  ```
- App: http://localhost:9002
- DB: localhost:5432 (user/password in compose file)

## Remote / Production
1) Build and push your image from the project root:
   ```bash
   docker build -f Dockerfile.prod -t 13whisper13/studio-app:YOUR_TAG .
   docker push 13whisper13/studio-app:YOUR_TAG
   ```
2) On the server, set the same tag in `docker-compose.prod.yml` (replace {{IMAGE_TAG}}).
3) Start:
   ```bash
   docker compose -f docker-compose.prod.yml up -d
   ```

### Notes
- Dev uses `prisma db push` and `npm run dev` for fast iteration.
- Prod uses `prisma migrate deploy` and `next start` on port 9002.
- `DATABASE_URL` points to the `db` service (not localhost).
- Prisma CLI and Client are pinned to 5.22.0 and installed in production to ensure `postinstall` generates the client.
