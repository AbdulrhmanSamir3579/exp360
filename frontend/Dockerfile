# Multi-stage build for Angular frontend
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files from frontend directory
COPY frontend/package*.json ./

# Install dependencies
RUN npm ci

# Copy source code from frontend directory
COPY frontend/ .

# Build Angular app for production
RUN npm run build

# Production stage with Nginx
FROM nginx:alpine

# Copy custom nginx config from frontend directory
COPY frontend/nginx.conf /etc/nginx/nginx.conf

# Copy built app from builder
COPY --from=builder /app/dist/frontend/browser /usr/share/nginx/html

# Copy entrypoint script
COPY frontend/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Use entrypoint script to inject environment variables
ENTRYPOINT ["/docker-entrypoint.sh"]
