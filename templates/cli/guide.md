# CLI Tool Template

A feature-rich command-line application template that implements common CLI patterns and best practices.

## Features

- **Command Parsing**: Built-in argument and flag parsing
- **Interactive Prompts**: User-friendly interactive input
- **Config Management**: YAML/TOML/JSON configuration support
- **Rich Output**: Colored and formatted console output
- **Error Handling**: Graceful error messages and exit codes

## Getting Started

```bash
jzero new simplecli --branch cli
cd simplecli
go mod tidy
go build -o cli main.go
./cli --help
```

## Project Structure

```
.
├── cmd/             # Command implementations
├── config/          # Configuration handling
├── internal/
│   ├── printer/     # Output formatting
│   └── validator/   # Input validation
├── main.go          # Entry point
└── config.yaml      # Default config
```

## Usage Examples

### Basic Command

```bash
./cli command-name --flag value
```

### Interactive Mode

```bash
./cli interactive
# Follow the prompts...
```

### Configuration File

Create `config.yaml`:
```yaml
logLevel: info
outputFormat: json
timeout: 30s
```

Run with config:
```bash
./cli --config config.yaml
```

## Adding New Commands

1. Create command file in `cmd/`:
```go
package cmd

import (
    "github.com/urfave/cli/v2"
)

func NewExampleCommand() *cli.Command {
    return &cli.Command{
        Name:  "example",
        Usage: "Example command description",
        Flags: []cli.Flag{
            &cli.StringFlag{
                Name:  "input",
                Usage: "Input file path",
            },
        },
        Action: func(c *cli.Context) error {
            // Your logic here
            return nil
        },
    }
}
```

2. Register in `main.go`:
```go
app.Commands = append(app.Commands, cmd.NewExampleCommand())
```

## Build & Distribution

### Build for Multiple Platforms

```bash
# macOS
GOOS=darwin GOARCH=amd64 go build -o cli-darwin-amd64 main.go

# Linux
GOOS=linux GOARCH=amd64 go build -o cli-linux-amd64 main.go

# Windows
GOOS=windows GOARCH=amd64 go build -o cli-windows-amd64.exe main.go
```

### Homebrew Installation (Optional)

Create a tap for easy installation:
```bash
brew tap yourusername/cli
brew install yourusername/cli/cli
```

## Best Practices

1. **Exit Codes**: Use standard exit codes (0 for success, 1 for errors)
2. **Error Messages**: Provide helpful error messages with suggestions
3. **Flags**: Use both short and long flags (`-v` and `--verbose`)
4. **Help Text**: Include examples in command help text
5. **Testing**: Write tests for command logic

## Learn More

- [urfave/cli Documentation](https://cli.urfave.org/)
- [Command Line Interface Guidelines](https://clig.dev/)
