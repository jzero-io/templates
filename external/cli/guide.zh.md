# CLI 模板指南

## 概述

CLI 模板提供了一个基于 cobra 框架的命令行工具项目结构，支持插件系统和配置管理。

## 快速开始

```bash
# 创建新的 CLI 项目
jzero new YOUR_APP_NAME --branch cli
cd YOUR_APP_NAME
go mod tidy
go build
./YOUR_APP_NAME version
```

## 核心特性

### 1. Cobra 框架

基于 [spf13/cobra](https://github.com/spf13/cobra) 框架，提供强大的命令行功能：

- 自动生成命令和标志
- 自动生成帮助文档
- 支持子命令
- 智能提示（shell completions）

### 2. 配置管理

支持多种配置方式：

- **配置文件**：`~/.YOUR_APP.yaml`
- **环境变量配置**：`.YOUR_APP.env.yaml`
- **命令行标志**

#### 配置优先级

命令行标志 > 环境变量 > 配置文件

#### 环境变量设置

在 `.YOUR_APP.env.yaml` 中创建变量：

```yaml
# 环境变量
DATABASE_URL: postgres://localhost/mydb
LOG_LEVEL: debug
```

在 `~/.YOUR_APP.yaml` 中使用：

```yaml
# 使用环境变量
database:
  url: ${DATABASE_URL}
log:
  level: ${LOG_LEVEL}
```

环境变量前缀规则：
- 前缀为 `{APP_NAME}_` (大写)
- 层级结构用 `_` 连接
- 例如：`MY_APP_A_B` 对应 `config.C.a.b`

### 3. 插件系统

支持自动发现和执行插件：

- 插件可执行文件以 `YOUR_APP-` 为前缀
- 插件自动从 PATH 中搜索
- 支持多级命令命名

## 项目结构

```
.
├── main.go                      # 入口文件
├── internal/
│   ├── command/
│   │   └── version/            # 版本命令
│   │       └── version.go
│   └── config/
│       └── config.go           # 配置管理
└── go.mod
```

## 配置文件

### 主配置文件

默认位置：`~/.YOUR_APP.yaml`

```yaml
# 调试模式
debug: false

# 调试睡眠时间（秒）
debug-sleep-time: 0
```

### 环境变量配置文件

默认位置：`.YOUR_APP.env.yaml`

```yaml
# 可以在这里定义环境变量
# 这些变量可以在主配置文件中通过 ${VAR_NAME} 引用
```

## 命令

### 版本命令

```bash
./YOUR_APP_NAME version
```

输出：
```
YOUR_APP_NAME version 1.0.0 darwin/amd64
Go version go1.21.0
Git commit abc123
Build date 2024-01-01 12:00:00 +0000 UTC
```

### 帮助命令

```bash
./YOUR_APP_NAME --help
./YOUR_APP_NAME command --help
```

## 添加新命令

### 1. 创建命令文件

在 `internal/command/` 下创建新目录：

```go
package mycmd

import (
    "github.com/spf13/cobra"
)

var Cmd = &cobra.Command{
    Use:   "mycmd",
    Short: "我的命令",
    Run: func(cmd *cobra.Command, args []string) {
        // 命令逻辑
    },
}

func init() {
    // 添加标志
    Cmd.Flags().StringP("output", "o", "", "输出文件")
}
```

### 2. 注册命令

在 `main.go` 中添加：

```go
import (
    "{{ .Module }}/internal/command/mycmd"
)

func init() {
    rootCmd.AddCommand(mycmd.Cmd)
}
```

## 调试

启用调试模式：

```bash
# 通过配置文件
~/.YOUR_APP.yaml:
  debug: true

# 通过环境变量
export YOUR_APP_DEBUG=true
./YOUR_APP_NAME

# 通过命令行标志
./YOUR_APP_NAME --debug
```

设置调试睡眠时间：

```bash
./YOUR_APP_NAME --debug --debug-sleep-time 5
```

## 构建版本信息

构建时注入版本信息：

```bash
go build \
  -ldflags="-X 'main.version=1.0.0' \
           -X 'main.commit=$(git rev-parse HEAD)' \
           -X 'main.date=$(date -u +%Y-%m-%dT%H:%M:%SZ)'" \
  -o YOUR_APP_NAME
```

## 相关资源

- [Cobra 文档](https://github.com/spf13/cobra)
- [Viper 文档](https://github.com/spf13/viper)
- [jzero 文档](https://docs.jzero.io)
