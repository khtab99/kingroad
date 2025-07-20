# Use official Node.js image as base
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy project files
COPY . .

# Build the Next.js app
RUN npm run build

# ---- Production image ----
FROM node:18-alpine AS runner

# Set working directory
WORKDIR /app

# Only copy necessary files for production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Set environment variables
ENV NODE_ENV production
ENV PORT 3001

# Expose the port
EXPOSE 3001

# Run the Next.js app
CMD ["npm", "start"]
