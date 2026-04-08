# API Vercel Template

An API template optimized for Vercel serverless deployment.

## Features

- **RESTful API Structure**: Clean and organized API design
- **Vercel Serverless Deployment**: Optimized for Vercel's serverless functions
- **Built-in Middleware**: Common middleware included out of the box
- **Example Endpoints**: Ready-to-use example API endpoints

## Getting Started

```bash
jzero new simpleapi-vercel --branch api-vercel
cd simpleapi-vercel
```

## Project Structure

```
.
├── api/              # API endpoints
│   ├── handlers/     # Request handlers
│   ├── logic/        # Business logic
│   └── middleware/   # Middleware functions
├── internal/         # Internal packages
├── go.mod            # Go module file
└── vercel.json       # Vercel configuration
```

## Usage Examples

### Create a New Endpoint

```go
// api/hello/hello.go
package hello

import (
    "net/http"
    
    "github.com/zeromicro/go-zero/rest/httpx"
)

func Handler(w http.ResponseWriter, r *http.Request) {
    httpx.OkJson(w, map[string]string{
        "message": "Hello from Vercel!",
    })
}
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## Configuration

### vercel.json

```json
{
  "functions": {
    "api/**/*.go": {
      "runtime": "go1.x"
    }
  }
}
```

## Learn More

- [Vercel Documentation](https://vercel.com/docs)
- [Go-Zero Documentation](https://go-zero.dev/)
