# RPC Service Template

Build high-performance microservices using gRPC protocol with type-safe interfaces.

## Features

- Native gRPC protocol support
- High-performance RPC with binary serialization
- Service mesh ready architecture
- Type-safe interfaces with Protocol Buffers
- Efficient data transmission

## Creating a New Project

```bash
jzero new my-rpc --frame rpc
cd my-rpc
jzero run
```

Your RPC service will start on the configured port (default: 50051).

## Protocol Buffers

Define your service interface in `.proto` files:

```protobuf
syntax = "proto3";

package service;
option go_package = "./service";

service Greeter {
  rpc SayHello (HelloRequest) returns (HelloReply) {}
}

message HelloRequest {
  string name = 1;
}

message HelloReply {
  string message = 2;
}
```

## Project Structure

```
my-rpc/
├── proto/          # Protocol Buffer definitions
├── internal/       # Internal implementation
├── service/        # Generated gRPC code
└── main.go         # Application entry point
```

## Development

```bash
# Run the service
jzero run

# Generate gRPC code from proto files
jzero proto

# Build for production
jzero build
```

## Client Example

Create a client to connect to your RPC service:

```go
conn, err := grpc.Dial("localhost:50051", grpc.WithTransportCredentials(insecure.NewCredentials()))
if err != nil {
    log.Fatal(err)
}
defer conn.Close()

client := pb.NewGreeterClient(conn)
resp, err := client.SayHello(ctx, &pb.HelloRequest{Name: "World"})
```

## Benefits of gRPC

- **Performance**: Binary serialization is faster than JSON
- **Type Safety**: Compile-time type checking
- **Code Generation**: Client and server code generated from proto files
- **Interoperability**: Works across multiple programming languages
