# API 服务模板指南

## 目录

- [概述](#概述)
- [API 定义](#api-定义)
- [API 字段校验](#api-字段校验)
- [将 types 文件夹按照 go_package 进行分组](#将-types-文件夹按照-go_package-进行分组)
- [合并同一个 group 的 handler 为同一个文件](#合并同一个-group-的-handler-为同一个文件)
- [常用命令](#常用命令)
  - [添加 API 文件](#添加-api-文件)
  - [生成代码](#生成代码)
  - [生成 Swagger 文档](#生成-swagger-文档)
- [项目结构](#项目结构)
- [相关资源](#相关资源)

## 概述

api 是 go-zero 自研的领域特性语言（下文称 api 语言或 api 描述语言），旨在实现人性化的基础描述语言，作为生成 HTTP 服务最基本的描述语言。

jzero 扩展了 api 语法，支持了以下特性：

- `go_package`: 将 go types 生成在定义的 package 中，所以能支持不同 api 文件的 type 定义可以同名，保持和 proto 中的 `go_package` 一致
- `compact_handler`: 能将同一组路由的 handler 生成在同一个文件中，减少文件的数量，保持和 proto 的 server 模块一致

## API 定义

```api
info (
  // 定义 go_package: 生成的 go types 放入的文件夹位置
  go_package: "user"
)

type User {
  Id int `json:"id"`
  Username string `json:"username"`
}

type PageRequest {
  Page int `form:"page"`
  Size int `form:"size"`
  Username string `form:"username,optional"` // 过滤参数，可选
}

type PageResponse {
  Total uint64 `json:"total"` // 总数
  List []User `json:"list"` // 分页数据
}

type UpdateRequest {
  Id int `path:"id"`
  Username string `json:"username"`
}

type UpdateResponse {}

@server (
  prefix: /api/user // 路由 prefix
  group: user // 生成的 handler/logic 文件夹位置
  jwt: JwtAuth // 是否启用 jwt 验证
  middleware: AuthX // 该组路由的中间件
  compact_handler: true // 是否合并该组的 handler 为同一个文件，默认每个路由都有 handler 文件
)
service simpleapi {
  @doc "用户分页"
  @handler Page
  get /page (PageRequest) returns (PageResponse)

  @doc "更新用户"
  @handler Update
  post /update (UpdateRequest) returns (UpdateResponse)
}
```

对应的 curl 命令：

```bash
# 用户分页接口
curl -X GET "http://localhost:8080/api/user/page?page=1&size=10&username=test" \
-H "Authorization: Bearer "

# 更新用户接口
curl -X POST "http://localhost:8080/api/user/update/123" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer " \
-d '{"username": "new_username"}'
```

## API 字段校验

> jzero 默认集成 https://github.com/go-playground/validator 进行字段校验

```api
syntax = "v1"

type CreateRequest {
  Name string `json:"name" validate:"gte=2,lte=30"` // 名称
}
```

## 将 types 文件夹按照 go_package 进行分组

go_package 的选项，参考自 proto 文件，能将 message 生成的结构体分组。在 api 文件中同理，go_package 选项能将定义的 type 生成的结构体分组。

两大优点：

1. 避免默认生成的 types/types.go 爆炸
2. 提升开发体验，不同 group 下的 type 命名不会冲突

```api
syntax = "v1"

info (
go_package: "version"
)
```

## 合并同一个 group 的 handler 为同一个文件

```api
@server (
  prefix: /api/v1
  group: system/user
  compact_handler: true
)
service simpleapi {
  @handler GetUserHandler
  get /system/user/getUser (GetUserRequest) returns (GetUserResponse)

  @handler DeleteUserHandler
  get /system/user/deleteUser (DeleteUserRequest) returns (DeleteUserResponse)
}
```

## 常用命令

### 添加 API 文件

将在 desc/api 文件夹下新增 api 文件：

```bash
# group 为 test
jzero add api test

# group 为 test/test1
jzero add api test/test1
```

### 生成代码

```bash
# 生成服务代码
jzero gen

# 基于变更文件生成
jzero gen --git-change

# 指定描述文件目录或文件生成
jzero gen --desc desc/
jzero gen --desc desc/api/user.api
```

### 生成 Swagger 文档

```bash
# 生成 Swagger UI 文档
jzero gen swagger

# 在代码中访问
# GET /swagger/
```

## 项目结构

```
.
├── desc/                   # 描述文件目录
│   └── api/               # API 描述文件
│       └── user.api       # 用户服务 API 定义
├── internal/
│   ├── handler/           # HTTP 处理器
│   ├── logic/            # 业务逻辑
│   ├── svc/              # 服务上下文
│   ├── types/            # 类型定义
│   └── middleware/       # 中间件
└── cmd/
    └── server.go         # 服务入口
```

## 相关资源

- [API 指南](https://docs.jzero.io/zh-CN/guide/api.html)
- [添加命令文档](https://docs.jzero.io/zh-CN/getting-started/add.html)
- [生成命令文档](https://docs.jzero.io/zh-CN/getting-started/gen.html)
- [Swagger 生成](https://docs.jzero.io/zh-CN/getting-started/genclient.html)
