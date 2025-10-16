# Stage 1: Build the application
FROM oven/bun:1-alpine AS builder

WORKDIR /app

# Copy package files and bun config
COPY package.json .bunfig.toml ./

# Install dependencies using public registry (without frozen lockfile to avoid corporate registry)
RUN bun install

# Copy source code
COPY . .

# Build the application
RUN bun run build

# Stage 2: Serve with nginx
FROM nginx:alpine AS production

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
