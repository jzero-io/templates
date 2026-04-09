# API Vercel Template Guide

## Overview

jzero deeply integrates with Vercel ecosystem, bringing Go developers a frontend-level deployment experience! Automatically generate Vercel-compliant serverless functions from `.api` definitions, no need to deploy to your own servers.

### Core Value

- ✅ **Zero-Config Deployment**: Deploy directly from Git repository, no extra configuration needed, no servers required, no CI/CD pipeline
- ✅ **Global Edge Network**: Deploy Go functions to edge nodes nearest to users using Vercel's global infrastructure, achieving millisecond-level response
- ✅ **Free Domain & HTTPS**: Automatically get `.vercel.app` production-grade domain with built-in CDN acceleration and SSL certificates
- ✅ **Preview Environments**: Automatically generate independent preview URLs for each PR

## Quick Start

### Install jzero

```bash
# Install jzero
go install github.com/jzero-io/jzero@latest

# Install related tools
jzero check
go install github.com/jzero-io/gorename@latest
```

### Create Vercel Project

```bash
# Create new Vercel serverless project from remote template
jzero new jzero-api-vercel-example --remote https://github.com/jzero-io/templates --branch api-vercel

# Add new api
jzero add api test

# Generate code
jzero gen
```

## Project Structure

```
jzero-api-vercel-example/
├── vercel/
│   └── client.go       # Vercel Go runtime entry
├── desc/               # API definitions
│   └── api/           # .api files
├── server/            # Server side
│   ├── handler/       # HTTP handlers
│   ├── logic/         # Business logic
│   └── types/         # Type definitions
├── vercel.json        # Vercel platform configuration
├── main.go            # Local runtime entry
└── go.mod             # Go module file
```

## Deploy to Vercel

### Git Push to Deploy

jzero-generated projects are fully compatible with Vercel's Git workflow for automatic deployment:

```bash
cd jzero-api-vercel-example

# Initialize git
git init
git add .
git commit -m "Initial commit"

# Create repository on GitHub and push
git remote add origin https://github.com/your-username/jzero-api-vercel-example.git
git push -u origin main
```

### Vercel Platform Auto-Detection

1. Visit [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your GitHub repository
4. `vercel.json` configuration lets Vercel automatically recognize it as a Go project
5. Click "Deploy"

**🎉 Deployment complete! Your Go API is now connected to Vercel's global network**

## Related Resources

- [jzero GitHub](https://github.com/jzero-io/jzero)
- [jzero Official Site](https://jzero.io)
- [Vercel Template Repository](https://github.com/jzero-io/templates/tree/api-vercel)
- [Example Code Repository](https://github.com/jaronnie/jzero-api-vercel-example)
