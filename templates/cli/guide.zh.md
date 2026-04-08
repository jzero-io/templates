# 命令行工具模板

一个命令行应用程序模板，实现了常见的 CLI 模式和最佳实践。

## 特性

- **命令解析**：内置参数和标志解析
- **交互式提示**：用户友好的交互输入
- **配置管理**：支持 YAML/TOML/JSON 配置
- **丰富的输出**：彩色和格式化的控制台输出
- **错误处理**：优雅的错误消息和退出码

## 快速开始

```bash
jzero new simplecli --branch cli
cd simplecli
go mod tidy
go build -o cli main.go
./cli --help
```

## 项目结构

```
.
├── cmd/             # 命令实现
├── config/          # 配置处理
├── internal/
│   ├── printer/     # 输出格式化
│   └── validator/   # 输入验证
├── main.go          # 入口点
└── config.yaml      # 默认配置
```

## 使用示例

### 基本命令

```bash
./cli command-name --flag value
```

### 交互模式

```bash
./cli interactive
# 按照提示操作...
```

### 配置文件

创建 `config.yaml`：
```yaml
logLevel: info
outputFormat: json
timeout: 30s
```

使用配置运行：
```bash
./cli --config config.yaml
```

## 添加新命令

1. 在 `cmd/` 中创建命令文件：
```go
package cmd

import (
    "github.com/urfave/cli/v2"
)

func NewExampleCommand() *cli.Command {
    return &cli.Command{
        Name:  "example",
        Usage: "示例命令描述",
        Flags: []cli.Flag{
            &cli.StringFlag{
                Name:  "input",
                Usage: "输入文件路径",
            },
        },
        Action: func(c *cli.Context) error {
            // 你的逻辑
            return nil
        },
    }
}
```

2. 在 `main.go` 中注册：
```go
app.Commands = append(app.Commands, cmd.NewExampleCommand())
```

## 构建和分发

### 为多平台构建

```bash
# macOS
GOOS=darwin GOARCH=amd64 go build -o cli-darwin-amd64 main.go

# Linux
GOOS=linux GOARCH=amd64 go build -o cli-linux-amd64 main.go

# Windows
GOOS=windows GOARCH=amd64 go build -o cli-windows-amd64.exe main.go
```

### Homebrew 安装（可选）

创建 tap 以便于安装：
```bash
brew tap yourusername/cli
brew install yourusername/cli/cli
```

## 最佳实践

1. **退出码**：使用标准退出码（0 表示成功，1 表示错误）
2. **错误消息**：提供有用的错误消息和建议
3. **标志**：同时使用短标志和长标志（`-v` 和 `--verbose`）
4. **帮助文本**：在命令帮助文本中包含示例
5. **测试**：为命令逻辑编写测试

## 更多信息

- [urfave/cli 文档](https://cli.urfave.org/)
- [命令行界面指南](https://clig.dev/)
