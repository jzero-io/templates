# 如何制作模板并集成到模板市场

本指南将帮助您创建自己的 jzero 模板，并将其集成到模板市场网站中展示。

## jzero 模板系统概述

jzero 支持两种类型的模板：

### 1. 官方内置模板（embedded）

由 jzero 官方维护的模板，位于 jzero 主仓库的 `cmd/jzero/.template/frame/` 目录下。

- **API 服务模板**：基于 API 描述语言的 RESTful API 框架
- **RPC 服务模板**：基于 Protocol Buffers 的 gRPC 微服务框架
- **API Gateway 模板**：API 网关服务模板
- **CLI 模板**：命令行工具模板

使用方式：
```bash
jzero new your_project --frame api
jzero new your_project --frame rpc
jzero new your_project --frame gateway
```

### 2. 远程仓库模板（remote）

托管在远程 Git 仓库的模板，可以通过指定仓库和分支来使用。

使用方式：
```bash
jzero new your_project --remote https://github.com/jzero-io/templates.git --branch api-vercel
```

## 模板市场网站架构

模板市场网站（templates 仓库）是一个静态网站生成器，用于展示 jzero 模板。

### 网站结构

```
templates/
├── embedded/              # 内置模板展示
│   ├── api/
│   │   ├── template.zh.json
│   │   ├── template.en.json
│   │   ├── guide.zh.md
│   │   └── guide.en.md
│   ├── rpc/
│   └── gateway/
├── external/              # 外部模板展示
│   ├── api-vercel/
│   ├── cli/
│   └── vuepress-hope-docs/
├── third_party/          # 第三方模板（待实现）
├── src/                  # 网站构建脚本
│   ├── build.js
│   ├── template-loader.js
│   └── templates/        # EJS 模板
└── dist/                # 生成的静态网站
```

### 工作原理

1. **template-loader.js**：自动发现并加载模板配置
   - 扫描 `embedded/`、`external/`、`third_party/` 目录
   - 查找 `template.{lang}.json` 和 `guide.{lang}.md` 文件
   - 解析 Markdown 并转换为 HTML

2. **build.js**：生成静态网站
   - 为每个语言版本生成独立页面
   - 构建索引页、详情页、贡献页
   - 复制静态资源

3. **多语言支持**
   - 默认语言：`zh`
   - 支持语言：`zh`、`en`
   - URL 结构：`/`（默认）、`/en/`（英文）

## 如何制作 jzero 模板

### 方式一：创建内置模板（需要修改 jzero 主仓库）

如果您想创建一个内置模板（类似于 `api`、`rpc`、`gateway`），需要：

1. **在 jzero 仓库中创建模板**

```bash
# 克隆 jzero 仓库
git clone https://github.com/jzero-io/jzero.git
cd jzero

# 创建模板目录
mkdir -p cmd/jzero/.template/frame/your-template
```

2. **创建模板文件**

模板文件支持 Go template 语法，可以使用以下变量：

```go
{{ .Module }}     // Go 模块名
{{ .APP }}        // 应用名
```

示例模板文件：

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

3. **测试模板**

```bash
# 使用模板创建项目
jzero new test-your-template --frame your-template

# 进入项目并运行
cd test-your-template
go mod tidy
go run main.go
```

### 方式二：创建远程仓库模板（推荐）

远程仓库模板更灵活，您可以在自己的仓库中维护。

1. **创建模板仓库**

```bash
# 创建新仓库
mkdir my-jzero-template
cd my-jzero-template
git init
```

2. **创建模板文件结构**

```
my-jzero-template/
├── app/                  # 模板文件
│   ├── main.go.tpl
│   ├── config.go.tpl
│   └── ...
├── desc/                # 描述文件（可选）
│   └── api/
│       └── user.api
└── README.md            # 模板说明
```

3. **推送到 GitHub**

```bash
git add .
git commit -m "Initial template"
git remote add origin https://github.com/yourusername/my-jzero-template.git
git push -u origin main
```

4. **使用模板**

```bash
jzero new myproject --remote https://github.com/yourusername/my-jzero-template.git
```

### 方式三：将现有项目转化为模板

如果您已经有了一个开发好的项目，可以使用 `jzero template build` 命令将其转化为模板：

1. **进入您的项目目录**

```bash
cd your-existing-project
```

2. **将项目转化为模板**

```bash
# 将当前项目转化为名为 myapi 的模板
jzero template build --name myapi
```

这将在 `$HOME/.jzero/templates/` 目录下创建 `myapi` 模板。

3. **使用转化后的模板创建新项目**

```bash
jzero new my-new-project --template myapi
```

## 如何将模板集成到模板市场网站

### 集成内置模板

如果您的模板已经在 jzero 主仓库中作为内置模板：

1. **在 templates 仓库中创建模板展示页面**

```bash
cd templates
mkdir -p embedded/your-template
```

2. **创建配置文件 `template.zh.json`**

```json
{
  "id": "your-template",
  "name": "您的模板名称",
  "description": "模板的简短描述",
  "category": "API",
  "tags": ["api", "rest", "go"],
  "command": "jzero new your_project --frame your-template",
  "repository": "https://github.com/jzero-io/jzero/tree/main/cmd/jzero/.template/frame/your-template",
  "features": [
    "特性1",
    "特性2",
    "特性3"
  ]
}
```

3. **创建英文配置 `template.en.json`**

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

4. **创建使用指南 `guide.zh.md`**

```markdown
# 您的模板指南

## 概述

模板的概述说明...

## 快速开始

```bash
jzero new your_project --frame your-template
cd your_project
```

## 项目结构

```
.
├── main.go
├── config.go
└── ...
```

## 相关资源

- [jzero 文档](https://docs.jzero.io)

5. **创建英文指南 `guide.en.md`**

6. **构建并预览**

```bash
npm run dev
```

7. **提交 PR**

将您的更改提交到 templates 仓库的 Pull Request。

### 集成远程仓库模板

如果您的模板托管在远程仓库：

1. **在 templates 仓库中创建模板展示页面**

```bash
cd templates
mkdir -p external/your-template
```

2. **创建配置文件**（同上）

注意 `command` 字段应使用 `--remote` 和 `--branch`：

```json
{
  "command": "jzero new your_project --remote https://github.com/yourusername/my-jzero-template.git --branch main"
}
```

3. **创建使用指南**（同上）

4. **构建并提交 PR**

## 配置文件详细说明

### 必需字段

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | string | 模板唯一标识符（小写字母、数字、连字符） |
| `name` | string | 模板名称 |
| `description` | string | 模板简短描述（50-150 字符） |
| `category` | string | 模板分类（API、RPC、CLI、Web、Tools 等） |
| `tags` | array | 标签数组，用于搜索和分类 |
| `command` | string | 使用模板的完整命令 |

### 可选字段

| 字段 | 类型 | 说明 |
|------|------|------|
| `repository` | string | 模板源码仓库地址 |
| `demo` | string | 在线演示地址 |
| `features` | array | 模板特性列表 |

### 分类建议

- **embedded/**：jzero 官方内置模板
  - `API`：API 服务模板
  - `RPC`：RPC 服务模板
  - `Gateway`：网关模板
  - `CLI`：命令行工具模板

- **external/**：官方维护的远程模板
  - `Serverless`：无服务器相关
  - `Docs`：文档站点
  - `Tools`：开发工具

## 开发工作流

### 本地开发

```bash
# 1. 克隆 templates 仓库
git clone https://github.com/jzero-io/templates.git
cd templates

# 2. 安装依赖
npm install

# 3. 创建您的模板目录
mkdir -p external/your-template

# 4. 创建配置和指南文件
# template.zh.json, template.en.json
# guide.zh.md, guide.en.md

# 5. 本地构建预览
npm run build
npx serve dist

# 6. 访问 http://localhost:3000 预览
```

### 开发模式

```bash
npm run dev
```

开发模式会自动监听文件变化并重新构建，同时启动预览服务器。

### 提交流程

1. **Fork templates 仓库**
2. **创建分支**：`git checkout -b add-your-template`
3. **添加模板文件**
4. **测试构建**：`npm run build`
5. **提交更改**：`git add . && git commit -m "Add: Your Template"`
6. **推送到 fork**：`git push origin add-your-template`
7. **创建 Pull Request**

## 最佳实践

### 1. 模板命名

- 使用有意义、描述性的名称
- 避免过于通用的名称
- 推荐格式：`<用途>-<技术栈>`（如 `api-vercel`、`cli-basic`）

### 2. 文档编写

- 提供清晰的使用指南
- 包含完整的示例代码
- 说明模板的适用场景
- 添加相关资源链接

### 3. 代码质量

- 确保模板代码可以正常运行
- 遵循 Go 代码规范
- 添加必要的注释
- 包含错误处理

### 4. 多语言支持

- 同时提供中文和英文配置
- 确保两种语言的内容准确
- 使用一致的技术术语

### 5. 维护更新

- 及时修复发现的问题
- 更新依赖到稳定版本
- 响应用户反馈
- 保持模板与 jzero 版本兼容

## 示例参考

### 内置模板示例

- [API 服务模板](https://github.com/jzero-io/templates/tree/main/embedded/api)
- [RPC 服务模板](https://github.com/jzero-io/templates/tree/main/embedded/rpc)
- [CLI 模板](https://github.com/jzero-io/templates/tree/main/external/cli)

### 远程模板示例

- [API Vercel 模板](https://github.com/jzero-io/templates/tree/main/external/api-vercel)
- [VuePress Hope Docs 模板](https://github.com/jzero-io/templates/tree/main/external/vuepress-hope-docs)

## 获取帮助

- 📖 [jzero 官方文档](https://docs.jzero.io)
- 💬 [GitHub Discussions](https://github.com/jzero-io/templates/discussions)
- 🐛 [问题反馈](https://github.com/jzero-io/templates/issues)

---

感谢您为 jzero 社区做出贡献！🎉
