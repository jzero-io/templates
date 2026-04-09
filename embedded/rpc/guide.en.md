# RPC Service Template Guide

## Overview

The RPC service template provides a high-performance microservice framework based on Protocol Buffers. Define service interfaces through Proto description language with automatic code generation and type-safe communication.

## Core Features

### 1. Proto Description Language

Define service interfaces using Protocol Buffers:

```protobuf
syntax = "proto3";

package user;
option go_package = "./user";

service UserService {
    rpc CreateUser(CreateUserRequest) returns (CreateUserResponse);
}

message CreateUserRequest {
    string name = 1;
    string email = 2;
}

message CreateUserResponse {
    int64 id = 1;
    string name = 2;
}
```

### 2. Field Validation

Use `buf.validate` for field validation:

```protobuf
import "validate/validate.proto";

message CreateUserRequest {
    string name = 1 [(validate.rules).string.min_len = 1];
    string email = 2 [(validate.rules).string.email = true];
}
```

### 3. Middleware Support

Support configuring middleware in services for authentication, logging, rate limiting, etc.

## Common Commands

### Add Proto Files

Add proto files in the desc/proto folder:

```bash
# Service is Test
jzero add proto test
```

### Generate Code

```bash
# Generate service code
jzero gen

# Generate based on changed files
jzero gen --git-change

# Generate by specifying description directory or file
jzero gen --desc desc/
jzero gen --desc desc/proto/user.proto
```

### Generate Client

```bash
# Generate zrpc client
jzero gen zrpcclient
```

## Project Structure

```
.
├── desc/                   # Description files
│   └── proto/             # Proto description files
│       └── user.proto     # User service Proto definition
├── internal/
│   ├── logic/            # Business logic
│   ├── server/           # gRPC server
│   ├── svc/              # Service context
│   └── middleware/       # Middleware
└── cmd/
    └── server.go         # Service entry point
```

## Development Workflow

1. **Add Proto File**: Run `jzero add proto test` to create proto file in desc/proto/ directory
2. **Generate Code**: Run `jzero gen` to generate code
3. **Implement Logic**: Implement business logic in `internal/logic/`
4. **Generate Client**: Run `jzero gen zrpcclient` to generate client

## Related Resources

- [Proto Guide](https://docs.jzero.io/guide/proto.html)
- [Add Command](https://docs.jzero.io/getting-started/add.html)
- [Gen Command](https://docs.jzero.io/getting-started/gen.html)
- [Client Generation](https://docs.jzero.io/getting-started/genclient.html)
