# Use Node 25.2.1
FROM node:25.2.1

# Set working directory in container
WORKDIR /app

# Copy all files
COPY . .

# Build React app (Vite)
WORKDIR /app/client
RUN npm install
RUN npm run build

# Install server dependencies
WORKDIR /app/server
RUN npm install

# Expose port for OpenShift
EXPOSE 8080

# Start Express server
CMD ["node", "server.js"]
