# Use lightweight Alpine Linux
FROM alpine:latest

# Install CA certificates for HTTPS and timezone data
RUN apk --no-cache add ca-certificates tzdata

# Set working directory
WORKDIR /app

# Copy the pre-built binary from host
COPY device-gateway .

# Make the binary executable
RUN chmod +x device-gateway

# Expose ports
EXPOSE 8070 1883 5683/udp

# Set timezone environment variable
ENV TZ=Asia/Shanghai

# Run the binary
CMD ["./device-gateway"]