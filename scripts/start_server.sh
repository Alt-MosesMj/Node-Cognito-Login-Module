#!/bin/bash
set -e

echo "Starting start_server.sh"
cd /app/backend/login || { echo "Failed to change directory to /app/backend"; exit 1; }
# forever start --uid "login-app" --append -c "node app.js" . || { echo "forever start failed"; exit 1; }
pm2 restart system.config.js
echo "Completed start_server.sh"
