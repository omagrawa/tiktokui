# Multi-stage build for React app
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

# Install all dependencies (including devDependencies like vite)
RUN npm install

COPY . .

# Build the app using vite
RUN npm run build

# Production stage with nginx
FROM nginx:alpine

# Copy built app from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
