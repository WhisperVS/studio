#!/bin/bash
set -e

# Change to the directory where this script is located to ensure docker-compose can find its yml file
cd "$(dirname "$0")"

# Ensure the backups directory exists
mkdir -p backups

# Generate a timestamp for the backup file
TIMESTAMP=$(date +%Y-%m-%d_%H-%M-%S)
BACKUP_FILE="backups/backup_${TIMESTAMP}.sql.gz"

# Execute the backup command
echo "Creating backup..."
docker-compose exec -T db sh -c "pg_dump -U user -d gaim | gzip" > "${BACKUP_FILE}"

echo "Backup complete: ${BACKUP_FILE}"
