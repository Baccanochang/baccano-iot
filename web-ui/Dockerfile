# Use lightweight Alpine Linux
FROM alpine:latest

# Install CA certificates for HTTPS, timezone data, and nginx
RUN apk --no-cache add ca-certificates tzdata nginx

# Set working directory
WORKDIR /usr/share/nginx/html

# Copy the pre-built static files from host
COPY dist/ .

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Make nginx run in foreground
RUN echo "daemon off;" >> /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Set timezone environment variable
ENV TZ=Asia/Shanghai

# Start nginx
CMD ["nginx"]