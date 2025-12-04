#!/bin/sh

# This script runs when the container starts
# It replaces environment variable placeholders in the built files

# Replace API_URL and WS_URL in the index.html
if [ ! -z "$API_URL" ]; then
  echo "Setting API_URL to: $API_URL"
  sed -i "s|window.API_URL = window.API_URL \|\| 'http://localhost:3000';|window.API_URL = '$API_URL';|g" /usr/share/nginx/html/index.html
fi

if [ ! -z "$WS_URL" ]; then
  echo "Setting WS_URL to: $WS_URL"
  sed -i "s|window.WS_URL = window.WS_URL \|\| 'ws://localhost:3000';|window.WS_URL = '$WS_URL';|g" /usr/share/nginx/html/index.html
fi

# Start nginx
exec nginx -g 'daemon off;'
