#!/bin/bash
set -e
echo "Stopping stop_server.sh"
cd /app/backend/login/
sudo rm -rf /app/backend/login/* /app/backend/login/.* 
echo "Completed cleanup.sh"