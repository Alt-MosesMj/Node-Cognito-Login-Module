#!/bin/bash
set -e

echo "Starting install_dependencies.sh"
cd /app/backend/login || { echo "Failed to change directory to /app/backend/login"; exit 1; }
npm install --production || { echo "npm install failed"; exit 1; }
echo "Completed install_dependencies.sh"
