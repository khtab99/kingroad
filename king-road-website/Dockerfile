FROM node:18-alpine

# Set app directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy source files (will be overridden by volume in dev)
COPY . .

# Expose port
EXPOSE 3000

# Run Next.js in dev mode
CMD ["npm", "run", "dev"]
