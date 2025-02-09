
# Stage 1: Build the application
FROM node:22-alpine AS builder

WORKDIR /app

# Install build dependencies for Alpine
RUN apk add --no-cache python3 make g++

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the Next.js application
RUN npm run build

# Stage 2: Serve the application
FROM node:22-alpine

WORKDIR /app

# Install a lightweight HTTP server
RUN npm install -g serve

# Copy built files from the builder stage
COPY --from=builder /app ./

# Expose the default port for Next.js
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]
