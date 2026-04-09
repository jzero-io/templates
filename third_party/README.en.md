# How to Create Templates and Integrate into Template Market

This guide will help you create your own jzero templates and integrate them into the template market website for showcase.

## jzero Template System Overview

jzero supports two types of templates:

### 1. Official Built-in Templates (embedded)

Templates maintained by jzero official team, located in `cmd/jzero/.template/frame/` directory of the jzero main repository.

- **API Service Template**: RESTful API framework based on API description language
- **RPC Service Template**: gRPC microservice framework based on Protocol Buffers
- **API Gateway Template**: API gateway service template
- **CLI Template**: Command-line tool template

Usage:
```bash
jzero new your_project --frame api
jzero new your_project --frame rpc
jzero new your_project --frame gateway
```

### 2. Remote Repository Templates (remote)

Templates hosted in remote Git repositories, accessible by specifying repository and branch.

Usage:
```bash
jzero new your_project --remote https://github.com/jzero-io/templates.git --branch api-vercel
```

## Template Market Website Architecture

The template market website (templates repository) is a static site generator that showcases jzero templates.

### Website Structure

```
templates/
├── embedded/              # Built-in template showcase
│   ├── api/
│   │   ├── template.zh.json
│   │   ├── template.en.json
│   │   ├── guide.zh.md
│   │   └── guide.en.md
│   ├── rpc/
│   └── gateway/
├── external/              # External template showcase
│   ├── api-vercel/
│   ├── cli/
│   └── vuepress-hope-docs/
├── third_party/          # Third-party templates (TBD)
├── src/                  # Website build scripts
│   ├── build.js
│   ├── template-loader.js
│   └── templates/        # EJS templates
└── dist/                # Generated static website
```

### How It Works

1. **template-loader.js**: Automatically discovers and loads template configurations
   - Scans `embedded/`, `external/`, `third_party/` directories
   - Finds `template.{lang}.json` and `guide.{lang}.md` files
   - Parses Markdown and converts to HTML

2. **build.js**: Generates static website
   - Generates separate pages for each language version
   - Builds index pages, detail pages, contribution pages
   - Copies static assets

3. **Multi-language Support**
   - Default language: `zh`
   - Supported languages: `zh`, `en`
   - URL structure: `/` (default), `/en/` (English)

## How to Create jzero Templates

### Method 1: Create Built-in Template (requires modifying jzero main repository)

If you want to create a built-in template (similar to `api`, `rpc`, `gateway`):

1. **Create template in jzero repository**

```bash
# Clone jzero repository
git clone https://github.com/jzero-io/jzero.git
cd jzero

# Create template directory
mkdir -p cmd/jzero/.template/frame/your-template
```

2. **Create template files**

Template files support Go template syntax with these variables:

```go
{{ .Module }}     // Go module name
{{ .APP }}        // Application name
```

Example template file:

```go
// cmd/jzero/.template/frame/your-template/main.go.tpl
package main

import (
    "fmt"
    "{{ .Module }}/internal/config"
    "{{ .Module }}/internal/handler"
    "{{ .Module }}/internal/svc"
    
    "github.com/zeromicro/go-zero/core/conf"
    "github.com/zeromicro/go-zero/rest"
)

func main() {
    var c config.Config
    conf.MustLoad("etc/{{ .APP }}.yaml", &c)
    
    server := rest.MustNewServer(c.RestConf)
    svr := svc.NewServiceContext(c)
    
    handler.RegisterHandlers(server, svc)
    
    fmt.Printf("Starting {{ .APP }} at %s...\n", c.RestConf.Address)
    server.Start()
}
```

3. **Test template**

```bash
# Create project using template
jzero new test-your-template --frame your-template

# Enter project and run
cd test-your-template
go mod tidy
go run main.go
```

### Method 3: Convert Existing Project to Template

If you already have a developed project, you can use the `jzero template build` command to convert it to a template:

1. **Navigate to your project directory**

```bash
cd your-existing-project
```

2. **Convert project to template**

```bash
# Convert current project to a template named myapi
jzero template build --name myapi
```

This will create the `myapi` template in the `$HOME/.jzero/templates/` directory.

3. **Use the converted template to create new projects**

```bash
jzero new my-new-project --template myapi
```

### Method 2: Create Remote Repository Template (Recommended)

Remote repository templates are more flexible and maintained in your own repository.

1. **Create template repository**

```bash
# Create new repository
mkdir my-jzero-template
cd my-jzero-template
git init
```

2. **Create template file structure**

```
my-jzero-template/
├── app/                  # Template files
│   ├── main.go.tpl
│   ├── config.go.tpl
│   └── ...
├── desc/                # Descriptor files (optional)
│   └── api/
│       └── user.api
└── README.md            # Template documentation
```

3. **Push to GitHub**

```bash
git add .
git commit -m "Initial template"
git remote add origin https://github.com/yourusername/my-jzero-template.git
git push -u origin main
```

4. **Use template**

```bash
jzero new myproject --remote https://github.com/yourusername/my-jzero-template.git
```

## How to Integrate Templates into Template Market Website

### Integrate Built-in Template

If your template is already a built-in template in the jzero main repository:

1. **Create template showcase page in templates repository**

```bash
cd templates
mkdir -p embedded/your-template
```

2. **Create configuration file `template.zh.json`**

```json
{
  "id": "your-template",
  "name": "Your Template Name",
  "description": "Brief description of your template",
  "category": "API",
  "tags": ["api", "rest", "go"],
  "command": "jzero new your_project --frame your-template",
  "repository": "https://github.com/jzero-io/jzero/tree/main/cmd/jzero/.template/frame/your-template",
  "features": [
    "Feature 1",
    "Feature 2",
    "Feature 3"
  ]
}
```

3. **Create English configuration `template.en.json`**

```json
{
  "id": "your-template",
  "name": "Your Template Name",
  "description": "Brief description of your template",
  "category": "API",
  "tags": ["api", "rest", "go"],
  "command": "jzero new your_project --frame your-template",
  "repository": "https://github.com/jzero-io/jzero/tree/main/cmd/jzero/.template/frame/your-template",
  "features": [
    "Feature 1",
    "Feature 2",
    "Feature 3"
  ]
}
```

4. **Create usage guide `guide.zh.md`**

```markdown
# Your Template Guide

## Overview

Template overview description...

## Quick Start

\`\`\`bash
jzero new your_project --frame your-template
cd your_project
\`\`\`

## Project Structure

\`\`\`
.
├── main.go
├── config.go
└── ...
\`\`\`

## Related Resources

- [jzero Documentation](https://docs.jzero.io)
```

5. **Create English guide `guide.en.md`**

6. **Build and preview**

```bash
npm run build
npx serve dist
```

7. **Submit PR**

Submit your changes to the templates repository as a Pull Request.

### Integrate Remote Repository Template

If your template is hosted in a remote repository:

1. **Create template showcase page in templates repository**

```bash
cd templates
mkdir -p external/your-template
```

2. **Create configuration file** (same as above)

Note that the `command` field should use `--remote` and `--branch`:

```json
{
  "command": "jzero new your_project --remote https://github.com/yourusername/my-jzero-template.git --branch main"
}
```

3. **Create usage guide** (same as above)

4. **Build and submit PR**

## Configuration File Details

### Required Fields

| Field | Type | Description |
|------|------|-------------|
| `id` | string | Template unique identifier (lowercase letters, numbers, hyphens) |
| `name` | string | Template name |
| `description` | string | Brief template description (50-150 characters) |
| `category` | string | Template category (API, RPC, CLI, Web, Tools, etc.) |
| `tags` | array | Tag array for search and categorization |
| `command` | string | Complete command to use the template |

### Optional Fields

| Field | Type | Description |
|------|------|-------------|
| `repository` | string | Template source code repository URL |
| `demo` | string | Online demo URL |
| `features` | array | List of template features |

### Category Suggestions

- **embedded/**: jzero official built-in templates
  - `API`: API service templates
  - `RPC`: RPC service templates
  - `Gateway`: Gateway templates
  - `CLI`: Command-line tool templates

- **external/**: Officially maintained remote templates
  - `Serverless`: Serverless-related
  - `Docs`: Documentation sites
  - `Tools`: Development tools

## Development Workflow

### Local Development

```bash
# 1. Clone templates repository
git clone https://github.com/jzero-io/templates.git
cd templates

# 2. Install dependencies
npm install

# 3. Create your template directory
mkdir -p external/your-template

# 4. Create configuration and guide files
# template.zh.json, template.en.json
# guide.zh.md, guide.en.md

# 5. Build and preview locally
npm run build
npx serve dist

# 6. Visit http://localhost:3000 to preview
```

### Development Mode

```bash
npm run dev
```

Development mode automatically watches for file changes and rebuilds, while also starting the preview server.

### Submission Process

1. **Fork templates repository**
2. **Create branch**: `git checkout -b add-your-template`
3. **Add template files**
4. **Test build**: `npm run build`
5. **Commit changes**: `git add . && git commit -m "Add: Your Template"`
6. **Push to fork**: `git push origin add-your-template`
7. **Create Pull Request**

## Best Practices

### 1. Template Naming

- Use meaningful, descriptive names
- Avoid overly generic names
- Recommended format: `<purpose>-<tech-stack>` (e.g., `api-vercel`, `cli-basic`)

### 2. Documentation

- Provide clear usage guides
- Include complete example code
- Explain template use cases
- Add related resource links

### 3. Code Quality

- Ensure template code runs correctly
- Follow Go code conventions
- Add necessary comments
- Include error handling

### 4. Multi-language Support

- Provide both Chinese and English configurations
- Ensure accurate content in both languages
- Use consistent technical terminology

### 5. Maintenance

- Fix discovered issues promptly
- Update dependencies to stable versions
- Respond to user feedback
- Maintain template compatibility with jzero versions

## Example References

### Built-in Template Examples

- [API Service Template](https://github.com/jzero-io/templates/tree/main/embedded/api)
- [RPC Service Template](https://github.com/jzero-io/templates/tree/main/embedded/rpc)
- [CLI Template](https://github.com/jzero-io/templates/tree/main/external/cli)

### Remote Template Examples

- [API Vercel Template](https://github.com/jzero-io/templates/tree/main/external/api-vercel)
- [VuePress Hope Docs Template](https://github.com/jzero-io/templates/tree/main/external/vuepress-hope-docs)

## Get Help

- 📖 [jzero Documentation](https://docs.jzero.io)
- 💬 [GitHub Discussions](https://github.com/jzero-io/templates/discussions)
- 🐛 [Issue Tracker](https://github.com/jzero-io/templates/issues)

---

Thank you for contributing to the jzero community! 🎉
