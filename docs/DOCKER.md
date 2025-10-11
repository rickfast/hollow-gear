# Docker Deployment Guide

This guide explains how to build and run the Hollow Gear 5E character sheet application using Docker.

## Quick Start

### Using Make (Recommended)

```bash
# Show all available commands
make help

# Build and run
make build
make run

# Or rebuild everything
make rebuild

# View logs
make logs

# Stop and clean up
make clean
```

### Using Docker Compose

```bash
# Build and start the container
docker-compose up -d

# Or with Make
make up

# View logs
docker-compose logs -f

# Stop the container
docker-compose down
# Or: make down
```

The application will be available at: http://localhost:8080

### Using Docker CLI

```bash
# Build the image
docker build -t hollow-gear-5e .

# Run the container
docker run -d -p 8080:80 --name hollow-gear-5e hollow-gear-5e

# View logs
docker logs -f hollow-gear-5e

# Stop and remove the container
docker stop hollow-gear-5e
docker rm hollow-gear-5e
```

## Image Details

### Multi-Stage Build

The Dockerfile uses a multi-stage build process:

1. **Builder Stage** (oven/bun:1-alpine)
    - Installs dependencies with Bun
    - Builds the Vite application
    - Creates optimized production assets

2. **Production Stage** (nginx:alpine)
    - Ultra-lightweight (~15-20 MB)
    - Only contains built static files
    - Runs nginx web server
    - Includes health checks

### Image Size

- **Base nginx:alpine**: ~8 MB
- **Built application**: ~5-10 MB
- **Total image size**: ~15-20 MB

## Configuration

### Nginx Configuration

The `nginx.conf` file includes:

- **SPA Routing**: Fallback to index.html for client-side routing
- **Gzip Compression**: Reduces bandwidth usage
- **Cache Headers**: Optimizes static asset caching
- **Security Headers**: Basic security improvements
- **Health Check Endpoint**: Available at `/health`

### Ports

- **Container Port**: 80 (nginx default)
- **Host Port**: 8080 (configurable in docker-compose.yml)

To change the host port, edit `docker-compose.yml`:

```yaml
ports:
    - "3000:80" # Change 3000 to your desired port
```

## Health Checks

The container includes a health check that:

- Runs every 30 seconds
- Checks the `/health` endpoint
- Allows 5 seconds for startup
- Retries 3 times before marking as unhealthy

Check health status:

```bash
docker inspect --format='{{.State.Health.Status}}' hollow-gear-5e
```

## Production Deployment

### Building for Production

```bash
# Build with version tag
docker build -t hollow-gear-5e:1.0.0 .

# Tag for registry
docker tag hollow-gear-5e:1.0.0 registry.example.com/hollow-gear-5e:1.0.0

# Push to registry
docker push registry.example.com/hollow-gear-5e:1.0.0
```

### Environment Variables

Currently, the app is built statically. To add runtime environment variables:

1. Use a `.env` file:

    ```bash
    docker run --env-file .env -p 8080:80 hollow-gear-5e
    ```

2. Pass individual variables:
    ```bash
    docker run -e NODE_ENV=production -p 8080:80 hollow-gear-5e
    ```

### Kubernetes Deployment

Example Kubernetes deployment:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
    name: hollow-gear-5e
spec:
    replicas: 3
    selector:
        matchLabels:
            app: hollow-gear-5e
    template:
        metadata:
            labels:
                app: hollow-gear-5e
        spec:
            containers:
                - name: hollow-gear-5e
                  image: hollow-gear-5e:1.0.0
                  ports:
                      - containerPort: 80
                  livenessProbe:
                      httpGet:
                          path: /health
                          port: 80
                      initialDelaySeconds: 5
                      periodSeconds: 30
                  readinessProbe:
                      httpGet:
                          path: /health
                          port: 80
                      initialDelaySeconds: 5
                      periodSeconds: 10
---
apiVersion: v1
kind: Service
metadata:
    name: hollow-gear-5e
spec:
    selector:
        app: hollow-gear-5e
    ports:
        - port: 80
          targetPort: 80
    type: LoadBalancer
```

## Troubleshooting

### Container won't start

```bash
# Check logs
docker logs hollow-gear-5e

# Check nginx configuration
docker exec hollow-gear-5e nginx -t
```

### Build fails

```bash
# Clean build with no cache
docker build --no-cache -t hollow-gear-5e .

# Check if bun.lockb is committed
git ls-files bun.lockb
```

### Port already in use

```bash
# Find process using port 8080
lsof -i :8080

# Use a different port
docker run -p 8081:80 hollow-gear-5e
```

### Image too large

The image should be ~15-20 MB. If larger:

1. Check `.dockerignore` is properly excluding files
2. Ensure multi-stage build is working (check with `docker history`)
3. Remove unnecessary dependencies from `package.json`

## Development vs Production

### Development (Vite dev server)

```bash
bun run dev
```

- Hot module reloading
- Source maps
- Faster iteration

### Production (Docker)

```bash
docker-compose up
```

- Optimized build
- Minimal image size
- Production-ready nginx
- Health checks

## Security Considerations

1. **Regular Updates**: Keep base images updated

    ```bash
    docker pull nginx:alpine
    docker pull oven/bun:1-alpine
    ```

2. **Scan for Vulnerabilities**:

    ```bash
    docker scan hollow-gear-5e
    ```

3. **Run as Non-Root** (if needed, nginx already runs as nginx user)

4. **Use Secrets Management**: For any API keys or sensitive data

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Build and Push Docker Image

on:
    push:
        branches: [main]

jobs:
    build:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v3

            - name: Build Docker image
              run: docker build -t hollow-gear-5e:${{ github.sha }} .

            - name: Test image
              run: |
                  docker run -d -p 8080:80 --name test hollow-gear-5e:${{ github.sha }}
                  sleep 5
                  curl -f http://localhost:8080/health || exit 1
                  docker stop test
```

## Monitoring

Monitor your container:

```bash
# Resource usage
docker stats hollow-gear-5e

# Logs
docker logs -f --tail 100 hollow-gear-5e

# Health status
docker inspect hollow-gear-5e | grep -A 10 Health
```

## Cleanup

```bash
# Remove container
docker-compose down

# Remove image
docker rmi hollow-gear-5e

# Clean up all unused images
docker system prune -a
```
