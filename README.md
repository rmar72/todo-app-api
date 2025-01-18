# productivity-tools
My own set of Productivity Tools



### Development Workflow

# Initial Build-  start servivces independent of each other, (for first time)
docker-compose up -d db
docker-compose up -d --build api

# Once changes are made to API, build TS locally then restart container 
npm run build
docker-compose restart api

# Stop API container
docker-compose stop api
# Stop Db containier
docker-compose stop db
# Stop all containers
docker-compose down

### Production Workflow
1. Build the Docker image (one time):
You build the Docker image once as part of the CI/CD (Continuous Integration/Continuous Deployment) pipeline. You do not build the image on your production servers.

docker-compose build --no-cache api # Use --no-cache for clean builds in CI

2. Push the Image to a Registry:
After building the image, you push it to a Docker registry (like Docker Hub, Amazon ECR, Google Container Registry, or a private registry).
docker tag <image_id> <your_registry>/<your_image_name>:<tag> # Tag the image
docker push <your_registry>/<your_image_name>:<tag> # Push the image
<image_id>: The ID of the built image (you can get this with docker images).
<your_registry>: The address of the Docker registry.
<your_image_name>: The name you want to give your image.
<tag>: A tag to version your image (e.g., latest, v1.0.0, commit-sha).


3. Deploy to Production:
Pull the image from the registry and run it on the production servers (using Docker Compose, Kubernetes, Docker Swarm, or other orchestration tools).
Using docker compose on a single server:
docker-compose pull api # Pull the latest image from the registry
docker-compose up -d # Start the containers


Dockerfile for Production (Optimizations):
You can further optimize your Dockerfile for production:
Multi-stage builds: Use multi-stage builds to create a smaller final image. This involves using one image for building the application and then copying only the necessary artifacts (the dist folder and dependencies) to a smaller base image.
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

EXPOSE 8081

CMD ["node", "dist/src/server.js"]


Avoid unnecessary files: Ensure your .dockerignore file is correctly configured to exclude unnecessary files (like .git, test files, etc.).
Production docker-compose.yml (Important Considerations):

Restart policies: Use restart policies to ensure high availability

in yml file
restart: always # Or "on-failure"

Environment variables: Use environment variables for configuration (database credentials, API keys, etc.). Do not hardcode these values in your code or Dockerfile.
Volumes (for persistent data): Use volumes only for persistent data (like database data). Do not mount your source code in production.
Health checks: Implement health checks to monitor the health of your application:


in  yml file
healthcheck:
  test: ["CMD-SHELL", "curl -f http://localhost:8081 || exit 1"] # Example health check
  interval: 30s
  timeout: 10s
  retries: 3

Production Workflow Summary:
CI/CD:
Build the Docker image: docker-compose build --no-cache api
Tag and push the image: docker tag ... && docker push ...
Deployment:
Pull the image on the production server: docker-compose pull api
Run the containers: docker-compose up -d
