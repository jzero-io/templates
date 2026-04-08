# 第三方模板制作指南

欢迎为 Jzero 模板市场贡献第三方模板！本指南将帮助您创建和发布自己的模板。

## 什么是第三方模板？

第三方模板是由社区开发者创建并维护的项目模板，可以帮助其他开发者快速启动特定类型的项目。

## 模板结构

每个第三方模板需要包含以下文件：

```
your-template/
├── template.json          # 模板配置文件（必需）
├── template.zh.json       # 中文配置文件（可选，用于多语言支持）
├── README.md              # 模板说明文档（必需）
└── [template files]       # 模板文件和目录
```

## 配置文件说明

### template.json

模板配置文件是 JSON 格式，包含以下字段：

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

### 字段说明

| 字段 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `id` | string | ✅ | 模板唯一标识符，只能包含小写字母、数字和连字符 |
| `name` | string | ✅ | 模板名称 |
| `description` | string | ✅ | 模板简短描述（建议 50-150 字符） |
| `category` | string | ✅ | 模板分类（如：Web、API、CLI、工具等） |
| `tags` | array | ✅ | 模板标签数组，用于搜索和分类 |
| `command` | string | ✅ | 使用模板的命令 |
| `repository` | string | ❌ | 模板源码仓库地址 |
| `demo` | string | ❌ | 在线演示地址 |
| `features` | array | ❌ | 模板特性列表 |

### 多语言支持

如果需要支持中文，创建 `template.zh.json` 文件：

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

## 创建模板

### 1. 创建模板目录

在 `third_party/` 目录下创建您的模板目录：

```bash
mkdir third_party/your-template-id
cd third_party/your-template-id
```

### 2. 创建配置文件

创建 `template.json` 文件：

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

### 3. 创建 README.md

在模板目录下创建详细的 README.md：

```markdown
# My Modern Web App

一个功能完整的全栈 Web 应用模板。

## 功能特性

- React 18 + TypeScript
- Node.js + Express 后端
- PostgreSQL 数据库
- JWT 认证
- Docker 部署支持

## 快速开始

\`\`\`bash
jzero new myapp --template my-web-app
cd myapp
npm install
npm run dev
\`\`\`

## 项目结构

\`\`\`
myapp/
├── frontend/          # React 前端
├── backend/           # Node.js 后端
├── database/          # 数据库脚本
└── docker-compose.yml # Docker 配置
\`\`\`

## 许可证

MIT License
```

## 最佳实践

### 1. 模板命名

- 使用有意义的名称，能清晰表达模板用途
- 避免使用过于通用的名称（如 `app`、`template`）
- 推荐格式：`<用途>-<技术栈>-<特性>` (如 `blog-vue3-ts`)

### 2. 分类选择

常用分类：
- **Web**: Web 应用、网站
- **API**: API 服务、微服务
- **CLI**: 命令行工具
- **Mobile**: 移动应用
- **Desktop**: 桌面应用
- **Library**: 库/框架
- **Tools**: 开发工具
- **Docs**: 文档站点

### 3. 标签使用

- 添加 3-8 个相关标签
- 包含主要技术栈（如 react、vue、nodejs）
- 包含框架或库（如 express、fastify）
- 包含项目类型（如 fullstack、microservice）

### 4. 文档编写

- README.md 应包含：
  - 项目简介
  - 功能特性
  - 快速开始指南
  - 项目结构说明
  - 配置说明
  - 部署指南

### 5. 版本管理

- 使用语义化版本号
- 维护 CHANGELOG.md
- 及时更新依赖

## 提交模板

### 1. 准备提交

确保您的模板包含：
- ✅ 完整的 `template.json` 配置
- ✅ 详细的 `README.md` 文档
- ✅ 可运行的模板代码
- ✅ 仓库地址（如果有）

### 2. 创建 Pull Request

1. Fork 本仓库
2. 在 `third_party/` 目录下创建您的模板
3. 创建 Pull Request
4. 等待审核

### 3. 审核标准

- 配置文件格式正确
- 文档完整清晰
- 代码可以正常运行
- 符合社区规范

## 模板维护

作为模板作者，您需要：

- 及时修复模板中的 bug
- 更新依赖到稳定版本
- 响应用户的问题和反馈
- 保持模板与 Jzero 的兼容性

## 示例模板

您可以参考现有的第三方模板作为参考：

- [示例 1](https://github.com/example/template1)
- [示例 2](https://github.com/example/template2)

## 常见问题

### Q: 模板可以包含商业内容吗？

A: 可以，但需要在 README 中明确说明许可证。

### Q: 可以提交商业模板吗？

A: 可以，但需要在描述中标注为付费模板。

### Q: 如何更新已提交的模板？

A: 创建新的 Pull Request，在标题中注明 "Update: [模板名称]"。

### Q: 模板被拒绝怎么办？

A: 查看审核意见，修改后重新提交。

## 获取帮助

- 📖 [Jzero 官方文档](https://jzero.io/docs)
- 💬 [GitHub Discussions](https://github.com/jzero-io/templates/discussions)
- 🐛 [问题反馈](https://github.com/jzero-io/templates/issues)

## 许可证

提交到 Jzero 模板市场的第三方模板默认采用 MIT 许可证，除非另有说明。

---

感谢您为 Jzero 社区做出贡献！🎉
