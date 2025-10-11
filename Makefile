.PHONY: help build run stop clean test logs shell rebuild up down

# Variables
IMAGE_NAME = hollow-gear-5e
CONTAINER_NAME = hollow-gear-5e
PORT = 8080

help: ## Show this help message
	@echo "Hollow Gear 5E - Docker Commands"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

build: ## Build the Docker image
	@echo "🔨 Building Docker image..."
	docker build -t $(IMAGE_NAME) .
	@echo "✅ Build complete!"

run: ## Run the container
	@echo "🚀 Starting container..."
	docker run -d -p $(PORT):80 --name $(CONTAINER_NAME) $(IMAGE_NAME)
	@echo "✅ Container started at http://localhost:$(PORT)"

stop: ## Stop the container
	@echo "🛑 Stopping container..."
	docker stop $(CONTAINER_NAME) || true
	@echo "✅ Container stopped"

clean: stop ## Stop and remove container
	@echo "🧹 Removing container..."
	docker rm $(CONTAINER_NAME) || true
	@echo "✅ Container removed"

clean-all: clean ## Remove container and image
	@echo "🧹 Removing image..."
	docker rmi $(IMAGE_NAME) || true
	@echo "✅ Image removed"

test: ## Run the test script
	@echo "🧪 Running tests..."
	./test-docker.sh

logs: ## Show container logs
	docker logs -f $(CONTAINER_NAME)

shell: ## Open a shell in the running container
	docker exec -it $(CONTAINER_NAME) /bin/sh

rebuild: clean-all build run ## Clean, rebuild, and run

up: ## Start with docker-compose
	@echo "🚀 Starting with docker-compose..."
	docker-compose up -d
	@echo "✅ Services started"

down: ## Stop docker-compose services
	@echo "🛑 Stopping services..."
	docker-compose down
	@echo "✅ Services stopped"

stats: ## Show container resource usage
	docker stats $(CONTAINER_NAME)

health: ## Check container health
	@echo "🏥 Container health status:"
	@docker inspect --format='{{.State.Health.Status}}' $(CONTAINER_NAME) 2>/dev/null || echo "No health check configured"

size: ## Show image size
	@echo "📊 Image size:"
	@docker images $(IMAGE_NAME) --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"

inspect: ## Inspect the container
	docker inspect $(CONTAINER_NAME)

prune: ## Clean up unused Docker resources
	@echo "🧹 Cleaning up Docker resources..."
	docker system prune -f
	@echo "✅ Cleanup complete"
