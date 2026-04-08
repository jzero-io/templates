# API Service Template

Build RESTful API services with automatic Swagger documentation generation.

## Features

- Auto-generated Swagger UI accessible at `/swagger`
- RESTful API structure with best practices
- Request/response model validation
- Optional Redis caching support
- Database ORM integration

## Creating a New Project

```bash
jzero new my-api --frame api
cd my-api
jzero run
```

After starting the service, visit http://localhost:8001/swagger to view the interactive API documentation.

## Optional Features

You can enable additional features when creating the project:

```bash
# Enable model validation
jzero new my-api --frame api --feature=model

# Enable Redis caching
jzero new my-api --frame api --feature=redis

# Enable both model and Redis
jzero new my-api --frame api --feature=model+redis

# Enable cache
jzero new my-api --frame api --feature=cache
```

## Project Structure

```
my-api/
├── api/           # API handlers
├── model/         # Data models (if enabled)
├── internal/      # Internal packages
└── main.go        # Application entry point
```

## Development

```bash
# Run the development server
jzero run

# Build for production
jzero build
```

The Swagger documentation will automatically update based on your API definitions.
