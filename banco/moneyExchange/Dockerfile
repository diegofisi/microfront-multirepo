# Dockerfile for MoneyExchange Microfrontend (React)
FROM node:18-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json ./

# Create a temporary package.json without file: dependencies
RUN grep -v '"common-resources"' package.json | grep -v '"common-utils"' > package.temp.json && \
    mv package.temp.json package.json

# Install dependencies including rxjs which is needed for webpack sharing
RUN pnpm install && pnpm add rxjs

# Copy application source
COPY . .

# Expose port
EXPOSE 3001

# Start the development server with Docker configuration
CMD ["pnpm", "run", "start:docker"]
