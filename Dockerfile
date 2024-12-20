# Stage 1: Build the application
FROM node:22 AS builder

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the Next.js application
RUN npm run build

# Stage 2: Serve the application
FROM node:22

WORKDIR /app

# Install a lightweight HTTP server
RUN npm install -g serve

# Copy built files from the builder stage
COPY --from=builder /app ./

# Expose the default port for Next.js
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]
