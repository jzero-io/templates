# API 网关模板

高性能 API 网关，为多个微服务提供统一访问入口，同时支持 gRPC 和 HTTP 协议。

## 特性

- 统一的 gRPC 和 HTTP 接口
- 服务发现和自动路由
- 跨多个服务实例的负载均衡
- HTTP 端点的 Swagger 文档
- gRPC 和 HTTP 之间的协议转换

## 创建新项目

```bash
jzero new my-gateway --frame gateway
cd my-gateway
jzero run
```

网关将开始在配置的端口上监听（默认：8001）。

## 架构

API 网关作为客户端请求的单一入口点，将请求路由到适当的后端服务：

- **HTTP 请求**：直接代理到基于 HTTP 的微服务
- **gRPC 请求**：转换并路由到 gRPC 服务
- **混合服务**：无缝处理两种协议

## 配置

在配置文件中配置上游服务：

```yaml
upstreams:
  - name: user-service
    type: grpc
    address: localhost:50051
  
  - name: order-service
    type: http
    address: http://localhost:8002
```

## 开发

```bash
# 运行网关
jzero run

# 构建生产版本
jzero build
```

## 文档

访问 http://localhost:8001/swagger 查看 HTTP 端点的 Swagger 文档。
