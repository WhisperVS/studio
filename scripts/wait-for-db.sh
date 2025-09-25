#!/bin/sh
# wait-for-db.sh: wait until a postgres server is accepting connections
# Usage: ./wait-for-db.sh [host] [port] [max_retries]
# If DATABASE_URL is set (postgres connection string), parse host and port from it
if [ -n "$DATABASE_URL" ]; then
  # Expect format like: postgresql://user:pass@host:port/dbname
  # Remove protocol prefix
  tmp=${DATABASE_URL#*://}
  # Extract host:port part after the '@' (if present)
  if echo "$tmp" | grep -q "@"; then
    hostport=${tmp#*@}
  else
    hostport=$tmp
  fi
  # hostport is host:port/...; extract host and port
  hostport=${hostport%%/*}
  HOST_FROM_URL=${hostport%%:*}
  PORT_FROM_URL=${hostport#*:}
  if [ "$HOST_FROM_URL" = "$hostport" ]; then
    # no colon found
    HOST=${HOST_FROM_URL:-db}
    PORT=5432
  else
    HOST=${HOST_FROM_URL:-db}
    PORT=${PORT_FROM_URL:-5432}
  fi
else
  HOST=${1:-db}
  PORT=${2:-5432}
fi
MAX_RETRIES=${3:-30}

i=0
until pg_isready -h "$HOST" -p "$PORT" -U "user" >/dev/null 2>&1; do
  i=$((i+1))
  if [ "$i" -ge "$MAX_RETRIES" ]; then
    echo "Timed out waiting for Postgres at $HOST:$PORT"
    exit 1
  fi
  echo "Waiting for Postgres at $HOST:$PORT... ($i/$MAX_RETRIES)"
  sleep 2
done

echo "Postgres is available at $HOST:$PORT"
