# Docker Setup Summary

This document summarizes the Docker configuration created for the Hollow Gear 5E application.

## Files Created

### 1. `Dockerfile`

Multi-stage Docker build configuration:

- **Stage 1 (Builder)**: Uses `oven/bun:1-alpine` to build the application
    - Installs dependencies with frozen lockfile
    - Builds Vite production bundle
- **Stage 2 (Production)**: Uses `nginx:alpine` for serving
    - Copies built assets from builder stage
    - Ultra-lightweight final image (~15-20 MB)
    - Includes health check endpoint
    - Runs nginx in foreground mode

### 2. `nginx.conf`

Production-ready nginx configuration:

- **SPA Routing**: Fallback to index.html for client-side routing
- **Gzip Compression**: Reduces bandwidth usage
- **Cache Headers**: 1-year cache for static assets
- **Security Headers**: X-Frame-Options, X-Content-Type-Options, X-XSS-Protection
- **Health Check**: `/health` endpoint for monitoring

### 3. `.dockerignore`

Optimizes build context by excluding:

- node_modules
- Build artifacts (dist, .vite)
- IDE files (.vscode, .idea)
- Git files
- Documentation
- Environment files
- Logs and temp files

### 4. `docker-compose.yml`

Simplified deployment configuration:

- Maps port 8080 to container port 80
- Enables health checks
- Sets restart policy
- Production environment

### 5. `test-docker.sh`

Automated test script that:

- Builds the Docker image
- Reports image size
- Starts the container
- Tests health endpoint
- Tests main page
- Shows container stats
- Cleans up after testing

### 6. `.github/workflows/docker.yml`

GitHub Actions CI/CD workflow:

- Builds Docker image on push/PR
- Tests the container
- Optional: Push to GitHub Container Registry

### 7. `docs/DOCKER.md`

Comprehensive documentation covering:

- Quick start guide
- Image details and configuration
- Production deployment
- Kubernetes examples
- Troubleshooting
- Security considerations
- CI/CD integration
- Monitoring

### 8. Updated `README.md`

Added Docker section with:

- Quick start commands
- Image specifications
- Link to detailed documentation

## Usage

### Quick Start

```bash
# Using Docker Compose (easiest)
docker-compose up -d

# Or using Docker CLI
docker build -t hollow-gear-5e .
docker run -d -p 8080:80 hollow-gear-5e
```

### Test the Build

```bash
./test-docker.sh
```

### Access the Application

Open http://localhost:8080 in your browser

## Image Specifications

- **Base Image**: nginx:alpine (~8 MB)
- **Final Size**: ~15-20 MB (including built app)
- **Build Time**: ~30-60 seconds (depends on machine)
- **Runtime**: nginx web server
- **Port**: 80 (mapped to 8080 on host)

## Key Features

1. **Multi-Stage Build**: Separates build dependencies from runtime
2. **Minimal Size**: Uses Alpine Linux base
3. **Health Checks**: Built-in container health monitoring
4. **Production Ready**: Optimized nginx configuration
5. **Security**: Basic security headers included
6. **Caching**: Aggressive caching for static assets
7. **Compression**: Gzip enabled for text files
8. **SPA Support**: Proper routing for React Router

## Environment Variables

Currently, the app is built statically. To add runtime configuration:

1. Build-time: Use `.env` file before building
2. Runtime: Inject via nginx environment variables module

## Production Considerations

### Scaling

- Run multiple containers behind a load balancer
- Use Kubernetes for orchestration
- Consider CDN for static assets

### Monitoring

- Use `/health` endpoint for health checks
- Monitor nginx access/error logs
- Track container resource usage

### Security

- Keep base images updated
- Scan for vulnerabilities with `docker scan`
- Use secrets management for sensitive data
- Consider running as non-root user

### Performance

- Enable HTTP/2 in nginx
- Use CDN for static assets
- Consider adding Redis for caching
- Enable nginx caching for frequently accessed content

## Next Steps

1. **Test Locally**: Run `./test-docker.sh` to verify the build
2. **Deploy**: Use docker-compose for local deployment
3. **CI/CD**: Enable GitHub Actions workflow for automation
4. **Production**: Deploy to your hosting platform (AWS, GCP, Azure, etc.)
5. **Monitor**: Set up logging and monitoring

## Common Commands

```bash
# Build
docker build -t hollow-gear-5e .

# Run
docker run -d -p 8080:80 --name hollow-gear-5e hollow-gear-5e

# Logs
docker logs -f hollow-gear-5e

# Stop
docker stop hollow-gear-5e

# Remove
docker rm hollow-gear-5e

# Clean up
docker system prune -a
```

## Troubleshooting

### Build Fails

- Check `bun.lockb` is committed
- Ensure all dependencies are in package.json
- Try building without cache: `docker build --no-cache`

### Container Won't Start

- Check logs: `docker logs hollow-gear-5e`
- Verify nginx config: `docker exec hollow-gear-5e nginx -t`
- Check port availability: `lsof -i :8080`

### Image Too Large

- Verify multi-stage build is working
- Check `.dockerignore` is excluding unnecessary files
- Review build logs for unexpected inclusions

## Resources

- [Docker Documentation](https://docs.docker.com/)
- [nginx Documentation](https://nginx.org/en/docs/)
- [Alpine Linux](https://alpinelinux.org/)
- [Bun Documentation](https://bun.sh/docs)
- [Vite Production Build](https://vitejs.dev/guide/build.html)
