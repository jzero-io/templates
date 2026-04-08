# VuePress Hope Docs Template

A modern documentation site template powered by VuePress with the beautiful Hope theme.

## Features

- **VuePress Hope Theme**: Feature-rich theme with excellent user experience
- **Markdown Support**: Write documentation using extended Markdown syntax
- **Blog Functionality**: Built-in blog system with categories and tags
- **Full-text Search**: Client-side search with Chinese support
- **Responsive Design**: Mobile-friendly experience out of the box
- **Dark Mode**: Automatic dark mode support
- **Navigation**: Auto-generated sidebar and navbar from file structure

## Getting Started

```bash
jzero new simple-vuepress-hope-docs --branch vuepress-hope-docs
cd simple-vuepress-hope-docs
npm install
npm run dev
```

Visit `http://localhost:8080` to view your documentation site.

## Project Structure

```
.
├── docs/
│   ├── README.md           # Homepage
│   ├── .vuepress/          # VuePress configuration
│   │   ├── config.js       # Main configuration
│   │   └── theme/          # Custom theme
│   ├── guide/              # Documentation
│   │   ├── README.md
│   │   ├── getting-started.md
│   │   └── configuration.md
│   └── blog/               # Blog posts
│       ├── README.md
│       └── 2024/
│           └── example-post.md
├── package.json
└── README.md
```

## Configuration

### Basic Setup (`docs/.vuepress/config.js`)

```javascript
module.exports = {
  title: "My Documentation",
  description: "Documentation built with VuePress",

  theme: "hope",

  themeConfig: {
    logo: "/logo.png",

    navbar: [
      {
        text: "Guide",
        link: "/guide/",
      },
      {
        text: "Blog",
        link: "/blog/",
      },
    ],

    sidebar: {
      "/guide/": [
        {
          title: "Getting Started",
          collapsable: false,
          children: [
            "getting-started",
            "configuration",
          ],
        },
      ],
    },
  },
};
```

## Writing Content

### Documentation Pages

Create Markdown files in `docs/guide/`:

```markdown
# Page Title

Content goes here...

## Code Blocks

```javascript
console.log("Hello, VuePress!");
```
```

### Blog Posts

Add blog posts in `docs/blog/`:

```markdown
---
title: My First Post
date: 2024-01-15
categories:
  - Tutorial
tags:
  - VuePress
  - Documentation
---

# My First Blog Post

Content goes here...
```

## Build and Deployment

### Local Build

```bash
npm run build
```

Output will be in the `docs/.vuepress/dist/` directory

### Deployment Options

#### Vercel

```bash
npm install -g vercel
vercel --prod
```

#### GitHub Pages

1. Set base URL in `config.js`:
```javascript
base: "/your-repo/",
```

2. Deploy workflow in `.github/workflows/deploy.yml`

#### Netlify

Create `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "docs/.vuepress/dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## Customization

### Styles

Create custom styles in `docs/.vuepress/styles/`:

```css
/* index.styl */
.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### Components

Add Vue components in `docs/.vuepress/components/`:

```vue
<template>
  <div class="my-component">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "MyComponent",
};
</script>
```

Use in Markdown:
```markdown
<MyComponent>
  Custom content goes here
</MyComponent>
```

## Plugins

### Common Plugins

```javascript
module.exports = {
  plugins: [
    "@vuepress/plugin-search",
    "@vuepress/plugin-medium-zoom",
    "vuepress-plugin-reading-time",
    "vuepress-plugin-comment",
  ],
};
```

## Best Practices

1. **Organize Content**: Group related documentation into folders
2. **Use Frontmatter**: Add metadata to all pages
3. **Optimize Images**: Compress images before adding
4. **Internal Links**: Use relative paths for internal links
5. **SEO**: Add appropriate meta tags and descriptions
6. **Accessibility**: Ensure good contrast and semantic HTML

## Learn More

- [VuePress Official Documentation](https://vuepress.vuejs.org/)
- [VuePress Hope Theme](https://theme-hope.vuejs.press/)
- [Markdown Guide](https://www.markdownguide.org/)
