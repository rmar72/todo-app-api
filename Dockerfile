# Use Node.js LTS version
FROM node:18-alpine 
# Use alpine for smaller image size

WORKDIR /usr/src/app

# Copy package*.json first
COPY package*.json ./

# Install dependencies ONLY for production
RUN npm ci --omit=dev

# Copy source code AFTER installing dependencies
COPY . .

# Build TypeScript to JavaScript
RUN npm run build

RUN echo "Checking dist directory contents..."
RUN ls -lR dist 
# Recursive listing with details


EXPOSE 8081

CMD ["node", "dist/src/server.js"]
