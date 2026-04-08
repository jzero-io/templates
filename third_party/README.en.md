# Third-party Template Guide

Welcome to contribute third-party templates to the Jzero Template Market! This guide will help you create and publish your own templates.

## What are Third-party Templates?

Third-party templates are project templates created and maintained by community developers to help other developers quickly start specific types of projects.

## Template Structure

Each third-party template should contain the following files:

```
your-template/
├── template.json          # Template config file (required)
├── template.zh.json       # Chinese config file (optional, for i18n)
├── README.md              # Template documentation (required)
└── [template files]       # Template files and directories
```

## Configuration File

### template.json

Template configuration file is in JSON format with the following fields:

```json
{
  "id": "your-template-id",
  "name": "Your Template Name",
  "description": "A brief description of your template",
  "category": "Category Name",
  "tags": ["tag1", "tag2", "tag3"],
  "command": "jzero new project_name --template your-template-id",
  "repository": "https://github.com/username/repo",
  "demo": "https://your-demo-url.com",
  "features": [
    "Feature 1",
    "Feature 2",
    "Feature 3"
  ]
}
```

### Field Description

| Field | Type | Required | Description |
|------|------|------|------|
| `id` | string | ✅ | Template unique identifier, lowercase letters, numbers, and hyphens only |
| `name` | string | ✅ | Template name |
| `description` | string | ✅ | Brief template description (recommended 50-150 characters) |
| `category` | string | ✅ | Template category (e.g., Web, API, CLI, Tools) |
| `tags` | array | ✅ | Template tag array for search and categorization |
| `command` | string | ✅ | Command to use the template |
| `repository` | string | ❌ | Template repository URL |
| `demo` | string | ❌ | Online demo URL |
| `features` | array | ❌ | Template feature list |

### Multi-language Support

To support Chinese, create a `template.zh.json` file:

```json
{
  "id": "your-template-id",
  "name": "模板中文名称",
  "description": "模板的中文描述",
  "category": "分类名称",
  "tags": ["标签1", "标签2"],
  "command": "jzero new project_name --template your-template-id",
  "repository": "https://github.com/username/repo",
  "demo": "https://your-demo-url.com",
  "features": [
    "特性1",
    "特性2"
  ]
}
```

## Creating Templates

### 1. Create Template Directory

Create your template directory in `third_party/`:

```bash
mkdir third_party/your-template-id
cd third_party/your-template-id
```

### 2. Create Configuration File

Create `template.json`:

```json
{
  "id": "my-web-app",
  "name": "My Modern Web App",
  "description": "A full-stack web application with React and Node.js",
  "category": "Web",
  "tags": ["react", "nodejs", "fullstack", "typescript"],
  "command": "jzero new myapp --template my-web-app",
  "repository": "https://github.com/username/my-web-app-template",
  "demo": "https://my-web-app-demo.example.com",
  "features": [
    "React 18 with TypeScript",
    "Node.js backend with Express",
    "PostgreSQL database integration",
    "JWT authentication",
    "Docker support"
  ]
}
```

### 3. Create README.md

Create detailed README.md in the template directory:

```markdown
# My Modern Web App

A full-featured full-stack web application template.

## Features

- React 18 + TypeScript
- Node.js + Express backend
- PostgreSQL database
- JWT authentication
- Docker deployment support

## Quick Start

\`\`\`bash
jzero new myapp --template my-web-app
cd myapp
npm install
npm run dev
\`\`\`

## Project Structure

\`\`\`
myapp/
├── frontend/          # React frontend
├── backend/           # Node.js backend
├── database/          # Database scripts
└── docker-compose.yml # Docker configuration
\`\`\`

## License

MIT License
```

## Best Practices

### 1. Template Naming

- Use meaningful names that clearly express the template purpose
- Avoid overly generic names (like `app` or `template`)
- Recommended format: `<purpose>-<techstack>-<features>` (e.g., `blog-vue3-ts`)

### 2. Category Selection

Common categories:
- **Web**: Web applications, websites
- **API**: API services, microservices
- **CLI**: Command-line tools
- **Mobile**: Mobile applications
- **Desktop**: Desktop applications
- **Library**: Libraries/frameworks
- **Tools**: Development tools
- **Docs**: Documentation sites

### 3. Tags Usage

- Add 3-8 relevant tags
- Include main tech stack (e.g., react, vue, nodejs)
- Include frameworks or libraries (e.g., express, fastify)
- Include project type (e.g., fullstack, microservice)

### 4. Documentation

README.md should include:
- Project introduction
- Features
- Quick start guide
- Project structure
- Configuration guide
- Deployment guide

### 5. Version Management

- Use semantic versioning
- Maintain CHANGELOG.md
- Update dependencies to stable versions

## Submission

### 1. Prepare for Submission

Ensure your template includes:
- ✅ Complete `template.json` configuration
- ✅ Detailed `README.md` documentation
- ✅ Runnable template code
- ✅ Repository URL (if available)

### 2. Create Pull Request

1. Fork this repository
2. Create your template in `third_party/` directory
3. Create Pull Request
4. Wait for review

### 3. Review Criteria

- Configuration file format is correct
- Documentation is complete and clear
- Code runs correctly
- Follows community guidelines

## Template Maintenance

As a template author, you should:

- Fix bugs in templates promptly
- Update dependencies to stable versions
- Respond to user questions and feedback
- Keep templates compatible with Jzero

## Example Templates

You can refer to existing third-party templates:

- [Example 1](https://github.com/example/template1)
- [Example 2](https://github.com/example/template2)

## FAQ

### Q: Can templates include commercial content?

A: Yes, but must clearly state the license in README.

### Q: Can I submit paid templates?

A: Yes, but must mark them as paid templates in the description.

### Q: How do I update submitted templates?

A: Create a new Pull Request with "Update: [template name]" in the title.

### Q: What if my template is rejected?

A: Review the feedback, make changes, and resubmit.

## Get Help

- 📖 [Jzero Documentation](https://jzero.io/docs)
- 💬 [GitHub Discussions](https://github.com/jzero-io/templates/discussions)
- 🐛 [Issue Tracker](https://github.com/jzero-io/templates/issues)

## License

Third-party templates submitted to the Jzero Template Market are licensed under MIT License unless otherwise specified.

---

Thank you for contributing to the Jzero community! 🎉
