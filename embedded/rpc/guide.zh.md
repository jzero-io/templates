# RPC 服务模板

使用 gRPC 协议构建高性能微服务，提供类型安全的接口。

## 特性

- 原生 gRPC 协议支持
- 二进制序列化的高性能 RPC
- 服务网格就绪的架构
- Protocol Buffers 类型安全接口
- 高效的数据传输

## 创建新项目

```bash
jzero new my-rpc --frame rpc
cd my-rpc
jzero run
```

您的 RPC 服务将在配置的端口上启动（默认：50051）。

## Protocol Buffers

在 `.proto` 文件中定义服务接口：

```protobuf
syntax = "proto3";

package service;
option go_package = "./service";

service Greeter {
  rpc SayHello (HelloRequest) returns (HelloReply) {}
}

message HelloRequest {
  string name = 1;
}

message HelloReply {
  string message = 2;
}
```

## 项目结构

```
my-rpc/
├── proto/          # Protocol Buffer 定义
├── internal/       # 内部实现
├── service/        # 生成的 gRPC 代码
└── main.go         # 应用入口
```

## 开发

```bash
# 运行服务
jzero run

# 从 proto 文件生成 gRPC 代码
jzero proto

# 构建生产版本
jzero build
```

## 客户端示例

创建客户端连接到您的 RPC 服务：

```go
conn, err := grpc.Dial("localhost:50051", grpc.WithTransportCredentials(insecure.NewCredentials()))
if err != nil {
    log.Fatal(err)
}
defer conn.Close()

client := pb.NewGreeterClient(conn)
resp, err := client.SayHello(ctx, &pb.HelloRequest{Name: "World"})
```

## gRPC 的优势

- **性能**：二进制序列化比 JSON 更快
- **类型安全**：编译时类型检查
- **代码生成**：从 proto 文件自动生成客户端和服务器代码
- **互操作性**：支持多种编程语言
