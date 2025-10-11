#!/bin/bash

# Docker Build Test Script
# Tests the Docker build and container startup

set -e

echo "🐳 Starting Docker build test..."

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

IMAGE_NAME="hollow-gear-5e-test"
CONTAINER_NAME="hollow-gear-5e-test-container"
PORT=8081

# Cleanup function
cleanup() {
    echo -e "${YELLOW}🧹 Cleaning up...${NC}"
    docker stop $CONTAINER_NAME 2>/dev/null || true
    docker rm $CONTAINER_NAME 2>/dev/null || true
    docker rmi $IMAGE_NAME 2>/dev/null || true
}

# Set trap to cleanup on exit
trap cleanup EXIT

echo -e "${YELLOW}📦 Building Docker image...${NC}"
docker build -t $IMAGE_NAME .

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build successful${NC}"
else
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi

# Check image size
IMAGE_SIZE=$(docker images $IMAGE_NAME --format "{{.Size}}")
echo -e "${GREEN}📊 Image size: $IMAGE_SIZE${NC}"

echo -e "${YELLOW}🚀 Starting container...${NC}"
docker run -d -p $PORT:80 --name $CONTAINER_NAME $IMAGE_NAME

# Wait for container to start
sleep 3

# Check if container is running
if docker ps | grep -q $CONTAINER_NAME; then
    echo -e "${GREEN}✅ Container started successfully${NC}"
else
    echo -e "${RED}❌ Container failed to start${NC}"
    docker logs $CONTAINER_NAME
    exit 1
fi

# Test health endpoint
echo -e "${YELLOW}🏥 Testing health endpoint...${NC}"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:$PORT/health)

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ Health check passed (HTTP $HTTP_CODE)${NC}"
else
    echo -e "${RED}❌ Health check failed (HTTP $HTTP_CODE)${NC}"
    exit 1
fi

# Test main page
echo -e "${YELLOW}🌐 Testing main page...${NC}"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:$PORT/)

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ Main page accessible (HTTP $HTTP_CODE)${NC}"
else
    echo -e "${RED}❌ Main page failed (HTTP $HTTP_CODE)${NC}"
    exit 1
fi

# Check container health status
echo -e "${YELLOW}🔍 Checking container health status...${NC}"
HEALTH_STATUS=$(docker inspect --format='{{.State.Health.Status}}' $CONTAINER_NAME 2>/dev/null || echo "none")
echo -e "${GREEN}📊 Health status: $HEALTH_STATUS${NC}"

# Show container stats
echo -e "${YELLOW}📊 Container stats:${NC}"
docker stats --no-stream $CONTAINER_NAME

echo -e "${GREEN}✅ All tests passed!${NC}"
echo -e "${GREEN}🎉 Docker image is ready for deployment${NC}"
echo ""
echo "To run the container manually:"
echo "  docker run -d -p 8080:80 --name hollow-gear-5e hollow-gear-5e"
echo ""
echo "To access the application:"
echo "  http://localhost:8080"
