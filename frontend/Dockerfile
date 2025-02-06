# dev config
# Stage 1: Build
FROM node:18-alpine AS build
WORKDIR /app


# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of the application and the .env file
COPY . .

# Build the production assets
RUN npm run build

# Stage 2: Runtime
FROM nginx:alpine AS runtime
WORKDIR /usr/share/nginx/html

# Copy built assets from the build stage
COPY --from=build /app/dist ./

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the HTTP port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]