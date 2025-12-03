# Use lightweight Alpine Linux
FROM alpine:latest

# Install CA certificates for HTTPS and timezone data
RUN apk --no-cache add ca-certificates tzdata

# Set working directory
WORKDIR /app

# Copy the pre-built binary from host
COPY rule-engine .

# Make the binary executable
RUN chmod +x rule-engine

# Expose port
EXPOSE 8085

# Set timezone environment variable
ENV TZ=Asia/Shanghai

# Run the binary
CMD ["./rule-engine"]