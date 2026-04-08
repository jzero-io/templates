# API Gateway Template

High-performance API gateway that provides unified access to multiple microservices, supporting both gRPC and HTTP protocols.

## Features

- Unified gRPC and HTTP interface
- Service discovery and automatic routing
- Load balancing across multiple service instances
- Swagger documentation for HTTP endpoints
- Protocol translation between gRPC and HTTP

## Creating a New Project

```bash
jzero new my-gateway --frame gateway
cd my-gateway
jzero run
```

The gateway will start listening on the configured port (default: 8001).

## Architecture

The API gateway acts as a single entry point for client requests, routing them to appropriate backend services:

- **HTTP Requests**: Directly proxied to HTTP-based microservices
- **gRPC Requests**: Translated and routed to gRPC services
- **Mixed Services**: Handle both protocols seamlessly

## Configuration

Configure your upstream services in the configuration file:

```yaml
upstreams:
  - name: user-service
    type: grpc
    address: localhost:50051
  
  - name: order-service
    type: http
    address: http://localhost:8002
```

## Development

```bash
# Run the gateway
jzero run

# Build for production
jzero build
```

## Documentation

Access Swagger documentation at http://localhost:8001/swagger to explore HTTP endpoints.
