#!/bin/bash
set -e

# Enable detailed logging
echo "Starting build process..."

# Clean up
rm -rf dist
rm -rf api/*.js

# Build with TypeScript
echo "Running TypeScript compiler..."
npx tsc

# Debug output of dist directory
echo "Files in dist directory after build:"
find dist -type f | sort

# Ensure api directory exists
mkdir -p api

# Copy compiled JS files to the api directory
echo "Copying compiled JS files to api directory..."
find dist/api -name "*.js" -exec cp {} api/ \; 2>/dev/null || true

# Debug output of api directory
echo "Files in api directory after copy:"
find api -type f | sort

echo "Build completed successfully!" 