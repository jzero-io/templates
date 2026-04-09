# API Vercel 模板指南

## 概述

jzero 深度打通 Vercel 生态，让 Go 开发者享受前端级别的部署体验！通过 `.api` 定义自动生成符合 Vercel 规范的无服务器函数，无需再部署到自己的服务器上。

### 核心价值

- ✅ **零配置部署**：从 Git 仓库直接部署，无需额外配置，无需自己的服务器，无需 ci/cd 流程
- ✅ **全球边缘网络**：借助 Vercel 的全球基础设施，将 Go 函数部署到离用户最近的边缘节点，实现毫秒级响应
- ✅ **免费域名与 HTTPS**：自动获得 `.vercel.app` 生产级域名，内置 CDN 加速和 SSL 证书
- ✅ **预览环境**：每次提交 PR 自动生成独立预览 URL

## 快速开始

### 安装 jzero

```bash
# 安装 jzero
go install github.com/jzero-io/jzero@latest

# 安装相关工具
jzero check
go install github.com/jzero-io/gorename@latest
```

### 创建 Vercel 项目

```bash
# 从远程模板创建新的 Vercel 无服务器项目
jzero new jzero-api-vercel-example --remote https://github.com/jzero-io/templates --branch api-vercel

# 添加新的 api
jzero add api test

# 生成代码
jzero gen
```

## 项目结构

```
jzero-api-vercel-example/
├── vercel/
│   └── client.go       # Vercel Go 运行时入口
├── desc/               # API 定义
│   └── api/           # .api 文件
├── server/            # 服务端
│   ├── handler/       # HTTP 处理器
│   ├── logic/         # 业务逻辑
│   └── types/         # 类型定义
├── vercel.json        # Vercel 平台配置
├── main.go            # 本地运行入口
└── go.mod             # Go 模块文件
```

## 部署到 Vercel

### Git 推送即部署

jzero 生成的项目完全兼容 Vercel 的 Git 工作流，实现代码推送自动部署：

```bash
cd jzero-api-vercel-example

# 初始化 git
git init
git add .
git commit -m "Initial commit"

# 在 GitHub 上创建仓库并推送
git remote add origin https://github.com/your-username/jzero-api-vercel-example.git
git push -u origin main
```

### Vercel 平台自动识别

1. 访问 [Vercel 控制台](https://vercel.com/dashboard)
2. 点击 "Add New Project"
3. 导入您的 GitHub 仓库
4. `vercel.json` 配置让 Vercel 自动识别为 Go 项目
5. 点击 "Deploy"

**🎉 部署完成！您的 Go API 已接入 Vercel 全球网络**

## 相关资源

- [jzero GitHub](https://github.com/jzero-io/jzero)
- [jzero 官网](https://jzero.io)
- [Vercel 模板仓库](https://github.com/jzero-io/templates/tree/api-vercel)
- [示例代码仓库](https://github.com/jaronnie/jzero-api-vercel-example)
