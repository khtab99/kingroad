# --- Stage 1: Build and export the static site ---
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Build and export static site
RUN npm run build && npm run export

# --- Stage 2: Serve the static site ---
FROM node:18-alpine AS production

WORKDIR /app

# Install static file server
RUN npm install -g serve

# Copy exported site
COPY --from=build /app/out .

# Expose the port your app will run on
EXPOSE 3002

# Serve the static content
CMD ["serve", "-l", "3002"]