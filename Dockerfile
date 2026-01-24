# Stage 1: Build
FROM node:22-slim AS builder

# Set the working directory
WORKDIR /app

# Install dependencies (Copying lockfiles first optimizes caching)
COPY package.json package-lock.json* ./
RUN npm install

# Copy the rest of the source code
COPY . .

# Build the TanStack Start app
# This creates the .output directory
RUN npm run build

# Stage 2: Production
FROM node:22-slim AS runner

WORKDIR /app

# Copy only the production output from the builder stage
COPY --from=builder /app/.output ./.output

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3291
ENV HOST=0.0.0.0

# Expose the port the app runs on
EXPOSE 3291

# Start the server using the Nitro entry point
CMD ["node", ".output/server/index.mjs"]
