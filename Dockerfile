# Use a minimal Node image
FROM node:20-alpine AS base
WORKDIR /app

# Install production dependencies only
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev && \
    npm cache clean --force

# Copy compiled source (assume build step already run)
COPY . .

# Set environment to production
ENV NODE_ENV=production

# Run as non‑root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 3000
CMD ["node","src/server.js"]
