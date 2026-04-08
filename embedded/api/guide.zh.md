# API 服务模板

构建带有自动 Swagger 文档生成的 RESTful API 服务。

## 特性

- 自动生成 Swagger UI 文档，访问 `/swagger` 即可查看
- 遵循最佳实践的 RESTful API 结构
- 请求/响应数据模型验证
- 可选的 Redis 缓存支持
- 数据库 ORM 集成

## 创建新项目

```bash
jzero new my-api --frame api
cd my-api
jzero run
```

启动服务后，访问 http://localhost:8001/swagger 查看交互式 API 文档。

## 可选功能

创建项目时可以启用额外的功能：

```bash
# 启用数据模型验证
jzero new my-api --frame api --feature=model

# 启用 Redis 缓存
jzero new my-api --frame api --feature=redis

# 同时启用模型和 Redis
jzero new my-api --frame api --feature=model+redis

# 启用缓存
jzero new my-api --frame api --feature=cache
```

## 项目结构

```
my-api/
├── api/           # API 处理器
├── model/         # 数据模型（如果启用）
├── internal/      # 内部包
└── main.go        # 应用入口
```

## 开发

```bash
# 运行开发服务器
jzero run

# 构建生产版本
jzero build
```

Swagger 文档会根据您的 API 定义自动更新。
