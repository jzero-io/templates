# RPC 服务模板指南

## 概述

RPC 服务模板基于 Protocol Buffers 提供高性能的微服务框架。通过 Proto 描述语言定义服务接口，支持自动代码生成和类型安全的通信。

## 核心特性

### 1. Proto 描述语言

使用 Protocol Buffers 定义服务接口：

```protobuf
syntax = "proto3";

package user;
option go_package = "./user";

service UserService {
    rpc CreateUser(CreateUserRequest) returns (CreateUserResponse);
}

message CreateUserRequest {
    string name = 1;
    string email = 2;
}

message CreateUserResponse {
    int64 id = 1;
    string name = 2;
}
```

### 2. 字段验证

使用 `buf.validate` 进行字段验证：

```protobuf
import "validate/validate.proto";

message CreateUserRequest {
    string name = 1 [(validate.rules).string.min_len = 1];
    string email = 2 [(validate.rules).string.email = true];
}
```

### 3. 中间件支持

支持在服务中配置中间件，用于认证、日志、限流等功能。

## 常用命令

### 添加 Proto 文件

将在 desc/proto 文件夹下新增 proto 文件：

```bash
# Service 为 Test
jzero add proto test
```

### 生成代码

```bash
# 生成服务代码
jzero gen

# 基于变更文件生成
jzero gen --git-change

# 指定描述文件目录或文件生成
jzero gen --desc desc/
jzero gen --desc desc/proto/user.proto
```

### 生成客户端

```bash
# 生成 zrpc 客户端
jzero gen zrpcclient
```

## 项目结构

```
.
├── desc/                   # 描述文件目录
│   └── proto/             # Proto 描述文件
│       └── user.proto     # 用户服务 Proto 定义
├── internal/
│   ├── logic/            # 业务逻辑
│   ├── server/           # gRPC 服务器
│   ├── svc/              # 服务上下文
│   └── middleware/       # 中间件
└── cmd/
    └── server.go         # 服务入口
```

## 开发流程

1. **添加 Proto 文件**：运行 `jzero add proto test` 在 desc/proto/ 目录创建 proto 文件
2. **生成代码**：运行 `jzero gen` 生成代码
3. **实现逻辑**：在 `internal/logic/` 中实现业务逻辑
4. **生成客户端**：运行 `jzero gen zrpcclient` 生成客户端

## 相关资源

- [Proto 指南](https://docs.jzero.io/zh-CN/guide/proto.html)
- [添加命令文档](https://docs.jzero.io/zh-CN/getting-started/add.html)
- [生成命令文档](https://docs.jzero.io/zh-CN/getting-started/gen.html)
- [客户端生成](https://docs.jzero.io/zh-CN/getting-started/genclient.html)
