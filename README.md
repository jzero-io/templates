# JZero Template Market

A static website generator for showcasing JZero templates with a modern, responsive interface.

[![Deploy to GitHub Pages](https://github.com/jzero-io/templates/workflows/Build%20and%20Deploy%20to%20gh-pages/badge.svg)](https://github.com/jzero-io/templates/actions)

## Quick Start

### 🚀 One-Click Deployment

The easiest way to deploy is using GitHub Actions:

1. **Fork or use this repository**
2. **Enable GitHub Pages** in repository Settings → Pages → Source: "GitHub Actions"
3. **Push to main branch** - The site will automatically build and deploy!

That's it! Your site will be available at `https://<username>.github.io/<repository>/`

### Local Development

```bash
# Install dependencies
npm install --registry=https://registry.npmmirror.com

# Build the site
npm run build

# Preview locally
npm run serve
```

## Features

- 📋 **Template Listing**: Display all available templates with cards showing key information
- 🔍 **Search & Filter**: Search templates by keyword, category, tag, or difficulty level
- 📄 **Detail Pages**: Each template has its own detailed page with usage guide
- 📋 **One-Click Copy**: Copy template commands with a single click
- 🎨 **Responsive Design**: Beautiful UI that works on all devices
- ⚡ **Static Site**: Fast loading with pre-generated HTML pages

## Quick Start

### 1. Install Dependencies

```bash
npm install --registry=https://registry.npmmirror.com
```

### 2. Build the Site

```bash
npm run build
```

This will generate the static site in the `dist/` directory.

### 3. Preview Locally

```bash
npm run serve
```

Or use any static file server:

```bash
npx serve dist
# or
python -m http.server 8000 -d dist
```

Visit `http://localhost:3000` (or `http://localhost:8000`) to see the site.

## Project Structure

```
.
├── templates/              # Template data directories
│   ├── api-vercel/
│   │   ├── template.json  # Template configuration
│   │   └── guide.md       # Usage guide (Markdown)
│   ├── cli/
│   └── vuepress-hope-docs/
├── src/
│   ├── build.js           # Build script
│   ├── template-loader.js # Template data loader
│   ├── templates/         # EJS templates
│   │   ├── layout.ejs
│   │   ├── index.ejs
│   │   └── detail.ejs
│   └── assets/            # Static assets
│       ├── css/style.css
│       └── js/main.js
├── dist/                  # Generated static site
├── package.json
└── builder.config.json    # Build configuration
```

## Adding New Templates

### 1. Create Template Directory

Create a new directory in `templates/`:

```bash
mkdir templates/my-template
```

### 2. Create template.json

```json
{
  "id": "my-template",
  "name": "My Awesome Template",
  "description": "A brief description of what this template does",
  "category": "API",
  "tags": ["api", "rest", "go"],
  "difficulty": "beginner",
  "command": "jzero new my-app --branch my-template",
  "branch": "my-template",
  "features": [
    "Feature 1",
    "Feature 2",
    "Feature 3"
  ],
  "repository": "https://github.com/jzero-io/templates/tree/my-template"
}
```

### 3. Create guide.md

Add a detailed usage guide in Markdown format:

```markdown
# My Template

A detailed guide for using this template.

## Features

- Feature 1
- Feature 2

## Getting Started

```bash
jzero new my-app --branch my-template
cd my-app
```

## Usage

Instructions here...
```

### 4. Rebuild

```bash
npm run build
```

## Configuration

Edit `builder.config.json` to customize the site:

```json
{
  "title": "JZero Template Market",
  "description": "Discover and use JZero templates",
  "templatesDir": "templates",
  "outputDir": "dist",
  "theme": {
    "primaryColor": "#007bff",
    "secondaryColor": "#6c757d",
    "backgroundColor": "#f8f9fa"
  }
}
```

## Available Templates

### [api-vercel](https://github.com/jzero-io/templates/tree/api-vercel)

A simple API template optimized for Vercel deployment.

```shell
jzero new simpleapi-vercel --branch api-vercel
```

**Tags**: api, vercel, serverless, rest

### [cli](https://github.com/jzero-io/templates/tree/cli)

A command-line application template with common CLI patterns.

```shell
jzero new simplecli --branch cli
```

**Tags**: cli, command-line, tool, automation

### [vuepress-hope-docs](https://github.com/jzero-io/templates/tree/vuepress-hope-docs)

Documentation site template using VuePress Hope theme.

```shell
jzero new simple-vuepress-hope-docs --branch vuepress-hope-docs
```

**Tags**: documentation, vuepress, markdown, blog

## Using Custom Templates

To use templates from other repositories:

```shell
jzero new your_template --remote https://github.com/xx/xx.git --branch your_branch
```

## Development

### Watch Mode (Coming Soon)

```bash
npm run dev
```

### Clean Build

```bash
npm run clean
npm run build
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.