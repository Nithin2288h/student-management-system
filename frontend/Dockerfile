# ==============================================================================
# Multi-Stage Dockerfile for React Frontend
# Stage 1: Build React Production Bundle
# Stage 2: Serve Bundle with Lightweight Nginx Alpine
# ==============================================================================

# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app

# Copy dependency definitions and install
COPY package.json package-lock.json ./
RUN npm ci

# Copy application source code
COPY . .

# Build production assets
RUN npm run build

# Stage 2: Production Nginx Server
FROM nginx:1.30.6-alpine3.24

# Set working directory
WORKDIR /usr/share/nginx/html

# Remove default Nginx welcome assets
RUN rm -rf ./*

# Copy built artifacts from Stage 1
COPY --from=build /app/dist ./

# Copy custom Nginx configuration (reverse proxy to backend + SPA routing)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose standard HTTP port
EXPOSE 80

# Health check to ensure Nginx is actively serving traffic
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:80/ || exit 1

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
