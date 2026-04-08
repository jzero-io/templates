# VuePress Hope 文档模板

一个由 VuePress 驱动、使用精美 Hope 主题的现代文档站点模板。

## 特性

- **VuePress Hope 主题**：功能丰富的主题，提供优秀的用户体验
- **Markdown 支持**：使用扩展的 Markdown 语法编写文档
- **博客功能**：内置博客系统，支持分类和标签
- **全文搜索**：客户端搜索，支持中文
- **响应式设计**：开箱即用的移动端友好体验
- **深色模式**：自动支持深色模式
- **导航功能**：从文件结构自动生成侧边栏和导航栏

## 快速开始

```bash
jzero new simple-vuepress-hope-docs --branch vuepress-hope-docs
cd simple-vuepress-hope-docs
npm install
npm run dev
```

访问 `http://localhost:8080` 查看您的文档站点。

## 项目结构

```
.
├── docs/
│   ├── README.md           # 首页
│   ├── .vuepress/          # VuePress 配置
│   │   ├── config.js       # 主配置
│   │   └── theme/          # 自定义主题
│   ├── guide/              # 文档
│   │   ├── README.md
│   │   ├── getting-started.md
│   │   └── configuration.md
│   └── blog/               # 博客文章
│       ├── README.md
│       └── 2024/
│           └── example-post.md
├── package.json
└── README.md
```

## 配置

### 基础设置 (`docs/.vuepress/config.js`)

```javascript
module.exports = {
  title: "我的文档",
  description: "使用 VuePress 构建的文档",

  theme: "hope",

  themeConfig: {
    logo: "/logo.png",

    navbar: [
      {
        text: "指南",
        link: "/guide/",
      },
      {
        text: "博客",
        link: "/blog/",
      },
    ],

    sidebar: {
      "/guide/": [
        {
          title: "快速开始",
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

## 编写内容

### 文档页面

在 `docs/guide/` 中创建 Markdown 文件：

```markdown
# 页面标题

内容写在这里...

## 代码块

```javascript
console.log("Hello, VuePress!");
```
```

### 博客文章

在 `docs/blog/` 中添加博客文章：

```markdown
---
title: 我的第一篇文章
date: 2024-01-15
categories:
  - 教程
tags:
  - VuePress
  - 文档
---

# 我的第一篇博客文章

内容写在这里...
```

## 构建和部署

### 本地构建

```bash
npm run build
```

输出将在 `docs/.vuepress/dist/` 目录中

### 部署选项

#### Vercel

```bash
npm install -g vercel
vercel --prod
```

#### GitHub Pages

1. 在 `config.js` 中设置基础 URL：
```javascript
base: "/your-repo/",
```

2. 在 `.github/workflows/deploy.yml` 中部署工作流

#### Netlify

创建 `netlify.toml`：
```toml
[build]
  command = "npm run build"
  publish = "docs/.vuepress/dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## 自定义

### 样式

在 `docs/.vuepress/styles/` 中创建自定义样式：

```css
/* index.styl */
.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### 组件

在 `docs/.vuepress/components/` 中添加 Vue 组件：

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

在 Markdown 中使用：

```markdown
<MyComponent>
  自定义内容写在这里
</MyComponent>
```

## 插件

### 常用插件

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

## 最佳实践

1. **组织内容**：将相关文档分组到文件夹中
2. **使用 Frontmatter**：为所有页面添加元数据
3. **优化图片**：添加前先压缩图片
4. **内部链接**：内部链接使用相对路径
5. **SEO**：添加适当的 meta 标签和描述
6. **可访问性**：确保良好的对比度和语义化 HTML

## 更多信息

- [VuePress 官方文档](https://vuepress.vuejs.org/)
- [VuePress Hope 主题](https://theme-hope.vuejs.press/)
- [Markdown 指南](https://www.markdownguide.org/)
