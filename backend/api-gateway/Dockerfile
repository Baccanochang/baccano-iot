# Use lightweight Alpine Linux
FROM alpine:latest

# Install CA certificates for HTTPS
RUN apk --no-cache add ca-certificates tzdata

# Set working directory
WORKDIR /app

# Copy the pre-built binary from host
COPY api-gateway .

# Make the binary executable
RUN chmod +x api-gateway

# Expose port
EXPOSE 8080

# Set timezone environment variable
ENV TZ=Asia/Shanghai

# Run the binary
CMD ["./api-gateway"]