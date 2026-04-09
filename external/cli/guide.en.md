# CLI Template Guide

## Overview

The CLI template provides a command-line tool project structure based on the cobra framework with plugin system and configuration management support.

## Quick Start

```bash
# Create a new CLI project
jzero new YOUR_APP_NAME --branch cli
cd YOUR_APP_NAME
go mod tidy
go build
./YOUR_APP_NAME version
```

## Core Features

### 1. Cobra Framework

Built on [spf13/cobra](https://github.com/spf13/cobra) framework providing powerful CLI capabilities:

- Automatic command and flag generation
- Automatic help documentation
- Subcommand support
- Intelligent suggestions (shell completions)

### 2. Configuration Management

Multiple configuration methods supported:

- **Config file**: `~/.YOUR_APP.yaml`
- **Environment variables config**: `.YOUR_APP.env.yaml`
- **Command line flags**

#### Configuration Priority

Command line flags > Environment variables > Config file

#### Setting Environment Variables

Create variables in `.YOUR_APP.env.yaml`:

```yaml
# Environment variables
DATABASE_URL: postgres://localhost/mydb
LOG_LEVEL: debug
```

Use in `~/.YOUR_APP.yaml`:

```yaml
# Use environment variables
database:
  url: ${DATABASE_URL}
log:
  level: ${LOG_LEVEL}
```

Environment variable prefix rules:
- Prefix is `{APP_NAME}_` (uppercase)
- Hierarchy connected with `_`
- Example: `MY_APP_A_B` maps to `config.C.a.b`

### 3. Plugin System

Supports automatic plugin discovery and execution:

- Plugin executables prefixed with `YOUR_APP-`
- Plugins automatically searched from PATH
- Multi-level command naming supported

## Project Structure

```
.
├── main.go                      # Entry point
├── internal/
│   ├── command/
│   │   └── version/            # Version command
│   │       └── version.go
│   └── config/
│       └── config.go           # Configuration management
└── go.mod
```

## Configuration Files

### Main Config File

Default location: `~/.YOUR_APP.yaml`

```yaml
# Debug mode
debug: false

# Debug sleep time (seconds)
debug-sleep-time: 0
```

### Environment Variables Config File

Default location: `.YOUR_APP.env.yaml`

```yaml
# Define environment variables here
# These can be referenced in main config using ${VAR_NAME}
```

## Commands

### Version Command

```bash
./YOUR_APP_NAME version
```

Output:
```
YOUR_APP_NAME version 1.0.0 darwin/amd64
Go version go1.21.0
Git commit abc123
Build date 2024-01-01 12:00:00 +0000 UTC
```

### Help Command

```bash
./YOUR_APP_NAME --help
./YOUR_APP_NAME command --help
```

## Adding New Commands

### 1. Create Command File

Create new directory under `internal/command/`:

```go
package mycmd

import (
    "github.com/spf13/cobra"
)

var Cmd = &cobra.Command{
    Use:   "mycmd",
    Short: "My command",
    Run: func(cmd *cobra.Command, args []string) {
        // Command logic
    },
}

func init() {
    // Add flags
    Cmd.Flags().StringP("output", "o", "", "Output file")
}
```

### 2. Register Command

Add in `main.go`:

```go
import (
    "{{ .Module }}/internal/command/mycmd"
)

func init() {
    rootCmd.AddCommand(mycmd.Cmd)
}
```

## Debugging

Enable debug mode:

```bash
# Via config file
~/.YOUR_APP.yaml:
  debug: true

# Via environment variable
export YOUR_APP_DEBUG=true
./YOUR_APP_NAME

# Via command line flag
./YOUR_APP_NAME --debug
```

Set debug sleep time:

```bash
./YOUR_APP_NAME --debug --debug-sleep-time 5
```

## Building Version Information

Inject version information during build:

```bash
go build \
  -ldflags="-X 'main.version=1.0.0' \
           -X 'main.commit=$(git rev-parse HEAD)' \
           -X 'main.date=$(date -u +%Y-%m-%dT%H:%M:%SZ)'" \
  -o YOUR_APP_NAME
```

## Related Resources

- [Cobra Documentation](https://github.com/spf13/cobra)
- [Viper Documentation](https://github.com/spf13/viper)
- [jzero Documentation](https://docs.jzero.io)
