# Vercel API 模板

专为 Vercel 无服务器部署优化的 API 模板。

## 特性

- **RESTful API 结构**：清晰有序的 API 设计
- **Vercel 无服务器部署**：专为 Vercel 无服务器函数优化
- **内置中间件**：开箱即用的常用中间件
- **示例端点**：现成可用的 API 示例端点

## 快速开始

```bash
jzero new simpleapi-vercel --branch api-vercel
cd simpleapi-vercel
```

## 项目结构

```
.
├── api/              # API 端点
│   ├── handlers/     # 请求处理器
│   ├── logic/        # 业务逻辑
│   └── middleware/   # 中间件函数
├── internal/         # 内部包
├── go.mod            # Go 模块文件
└── vercel.json       # Vercel 配置
```

## 使用示例

### 创建新端点

```go
// api/hello/hello.go
package hello

import (
    "net/http"
    
    "github.com/zeromicro/go-zero/rest/httpx"
)

func Handler(w http.ResponseWriter, r *http.Request) {
    httpx.OkJson(w, map[string]string{
        "message": "Hello from Vercel!",
    })
}
```

### 部署到 Vercel

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel
```

## 配置

### vercel.json

```json
{
  "functions": {
    "api/**/*.go": {
      "runtime": "go1.x"
    }
  }
}
```

## 更多信息

- [Vercel 文档](https://vercel.com/docs)
- [Go-Zero 文档](https://go-zero.dev/)
