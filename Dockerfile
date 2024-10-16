# Use Node.js base image
FROM node:14

# Set working directory
WORKDIR /app

# Copy backend package.json and install backend dependencies
COPY backend/package.json backend/pnpm-lock.yaml ./backend/
RUN cd backend && npm install

# Copy frontend package.json and install frontend dependencies
COPY frontend/package.json frontend/pnpm-lock.yaml ./frontend/
RUN cd frontend && npm install

# Build the frontend
COPY frontend/ ./frontend/
RUN cd frontend && npm run build

# Copy backend code
COPY backend/ ./backend/

# Move the built frontend into the backend's public directory to serve as static files
RUN cp -r frontend/dist/* backend/public/

# Expose the port the backend will run on
EXPOSE 3000

# Set environment variables for the backend
ENV SUBDOMAIN=${NAME:-default}

# Run the backend server
CMD ["node", "backend/server.js"]
