# API Service Template Guide

## Table of Contents

- [Overview](#overview)
- [API Definition](#api-definition)
- [API Field Validation](#api-field-validation)
- [Group types folder by go_package](#group-types-folder-by-go_package)
- [Merge handlers of the same group into one file](#merge-handlers-of-the-same-group-into-one-file)
- [Common Commands](#common-commands)
  - [Add API Files](#add-api-files)
  - [Generate Code](#generate-code)
  - [Generate Swagger Documentation](#generate-swagger-documentation)
- [Project Structure](#project-structure)
- [Related Resources](#related-resources)

## Overview

API is a domain-specific language developed by go-zero (hereinafter referred to as API language or API description language), designed to implement a human-friendly basic description language for generating HTTP services.

jzero has extended the API syntax with the following features:

- `go_package`: Generate go types in the defined package, supporting duplicate type names across different API files, consistent with `go_package` in proto
- `compact_handler`: Generate handlers for the same route group in a single file, reducing the number of files, consistent with the proto server module

## API Definition

```api
info (
  // Define go_package: folder location for generated go types
  go_package: "user"
)

type User {
  Id int `json:"id"`
  Username string `json:"username"`
}

type PageRequest {
  Page int `form:"page"`
  Size int `form:"size"`
  Username string `form:"username,optional"` // Filter parameter, optional
}

type PageResponse {
  Total uint64 `json:"total"` // Total
  List []User `json:"list"` // Paginated data
}

type UpdateRequest {
  Id int `path:"id"`
  Username string `json:"username"`
}

type UpdateResponse {}

@server (
  prefix: /api/user // Route prefix
  group: user // Handler/logic folder location
  jwt: JwtAuth // Enable jwt authentication
  middleware: AuthX // Middleware for this route group
  compact_handler: true // Merge handlers of this group into one file
)
service simpleapi {
  @doc "User Pagination"
  @handler Page
  get /page (PageRequest) returns (PageResponse)

  @doc "Update User"
  @handler Update
  post /update (UpdateRequest) returns (UpdateResponse)
}
```

Corresponding curl commands:

```bash
# User pagination endpoint
curl -X GET "http://localhost:8080/api/user/page?page=1&size=10&username=test" \
-H "Authorization: Bearer "

# Update user endpoint
curl -X POST "http://localhost:8080/api/user/update/123" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer " \
-d '{"username": "new_username"}'
```

## API Field Validation

> jzero integrates https://github.com/go-playground/validator for field validation by default

```api
syntax = "v1"

type CreateRequest {
  Name string `json:"name" validate:"gte=2,lte=30"` // Name
}
```

## Group types folder by go_package

The go_package option, referenced from proto files, can group generated message structures. Similarly in API files, the go_package option can group generated type structures.

Two major advantages:

1. Avoid explosion of default generated types/types.go
2. Improve development experience, type names in different groups won't conflict

```api
syntax = "v1"

info (
go_package: "version"
)
```

## Merge handlers of the same group into one file

```api
@server (
  prefix: /api/v1
  group: system/user
  compact_handler: true
)
service simpleapi {
  @handler GetUserHandler
  get /system/user/getUser (GetUserRequest) returns (GetUserResponse)

  @handler DeleteUserHandler
  get /system/user/deleteUser (DeleteUserRequest) returns (DeleteUserResponse)
}
```

## Common Commands

### Add API Files

Add api files in the desc/api folder:

```bash
# group is test
jzero add api test

# group is test/test1
jzero add api test/test1
```

### Generate Code

```bash
# Generate service code
jzero gen

# Generate based on changed files
jzero gen --git-change

# Generate by specifying description directory or file
jzero gen --desc desc/
jzero gen --desc desc/api/user.api
```

### Generate Swagger Documentation

```bash
# Generate Swagger UI documentation
jzero gen swagger

# Access in browser
# GET /swagger/
```

## Project Structure

```
.
├── desc/                   # Description files
│   └── api/               # API description files
│       └── user.api       # User service API definition
├── internal/
│   ├── handler/           # HTTP handlers
│   ├── logic/            # Business logic
│   ├── svc/              # Service context
│   ├── types/            # Type definitions
│   └── middleware/       # Middleware
└── cmd/
    └── server.go         # Service entry point
```

## Related Resources

- [API Guide](https://docs.jzero.io/guide/api.html)
- [Add Command](https://docs.jzero.io/getting-started/add.html)
- [Gen Command](https://docs.jzero.io/getting-started/gen.html)
- [Swagger Generation](https://docs.jzero.io/getting-started/genclient.html)
