package main

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strconv"
	"strings"
	"syscall"
	"time"

	"github.com/spf13/cobra"
	versioncmd "{{ .Module }}/internal/command/version"
	"{{ .Module }}/internal/config"
)

var (
	version = ""
	commit  string
	date    string
)

// pluginHandler handles plugin discovery and execution
type pluginHandler struct {
	validPrefixes []string
}

// newPluginHandler creates a new plugin handler with given prefixes
func newPluginHandler(validPrefixes []string) *pluginHandler {
	return &pluginHandler{
		validPrefixes: validPrefixes,
	}
}

// lookup searches for a plugin executable with the given filename
// and returns its full path if found, or a boolean false if not found.
func (h *pluginHandler) lookup(filename string) (string, bool) {
	// Search PATH for plugins with valid prefix
	for _, prefix := range h.validPrefixes {
		path, err := exec.LookPath(fmt.Sprintf("%s-%s", prefix, filename))
		if err == nil && len(path) > 0 {
			return path, true
		}
	}

	return "", false
}

// execute receives an executable's filepath, a slice
// of arguments, and a slice of environment variables
// to relay to the executable.
func (h *pluginHandler) execute(executablePath string, cmdArgs, environment []string) error {
	return syscall.Exec(executablePath, cmdArgs, environment)
}

// handlePluginCommand receives command-line arguments
// and attempts to find a plugin executable that satisfies the given arguments.
func (h *pluginHandler) handlePluginCommand(cmdArgs []string) error {
	var remainingArgs []string // all "non-flag" arguments

	for idx := range cmdArgs {
		if strings.HasPrefix(cmdArgs[idx], "-") {
			break
		}
		remainingArgs = append(remainingArgs, strings.ReplaceAll(cmdArgs[idx], "-", "_"))
	}

	foundBinaryPath := ""

	// attempt to find binary, starting at longest possible name with given cmdArgs
	for len(remainingArgs) > 0 {
		path, found := h.lookup(strings.Join(remainingArgs, "-"))
		if !found {
			remainingArgs = remainingArgs[:len(remainingArgs)-1]
			continue
		}

		foundBinaryPath = path
		break
	}

	if len(foundBinaryPath) == 0 {
		return nil
	}

	// invoke cmd binary relaying the current environment and args given
	// remainingArgs will always have at least one element.
	// exec will make remainingArgs[0] the "binary name".
	if err := h.execute(foundBinaryPath, append([]string{foundBinaryPath}, cmdArgs[len(remainingArgs):]...), os.Environ()); err != nil {
		return err
	}

	return nil
}

func main() {
	versioncmd.Version = version
	versioncmd.Date = date
	versioncmd.Commit = commit

	Execute()
}

// rootCmd represents the base command when called without any subcommands
var rootCmd = &cobra.Command{
	Use:   "{{.APP}}",
	Short: "{{.APP}} cli tool",
	Run: func(cmd *cobra.Command, args []string) {
		if parseBool, err := strconv.ParseBool(cmd.Flags().Lookup("version").Value.String()); err == nil && parseBool {
			versioncmd.GetVersion()
			return
		}
		if err := cmd.Help(); err != nil {
			cobra.CheckErr(err)
		}
	},
}

// Execute adds all child commands to the root command and sets flags appropriately.
// This is called by main.main(). It only needs to happen once to the rootCmd.
func Execute() {
	// Initialize plugin handler
	pluginHandler := newPluginHandler([]string{"{{.APP}}"})
	if len(os.Args) > 1 {
		cmdPathPieces := os.Args[1:]

		// only look for suitable extension executables if
		// the specified command does not already exist
		if _, _, err := rootCmd.Find(cmdPathPieces); err != nil {
			cobra.CheckErr(pluginHandler.handlePluginCommand(cmdPathPieces))
		}
	}

	cobra.CheckErr(rootCmd.Execute())
}

func init() {
	cobra.OnInitialize(InitConfig)

	home, err := os.UserHomeDir()
	cobra.CheckErr(err)

	rootCmd.PersistentFlags().StringVarP(&config.CfgFile, "config", "f", filepath.Join(home, ".{{.APP}}.yaml"), "set config file")
	rootCmd.PersistentFlags().StringVarP(&config.CfgEnvFile, "config-env", "", ".{{.APP}}.env.yaml", "set config env file")
	rootCmd.PersistentFlags().BoolP("debug", "", false, "debug mode")
	rootCmd.PersistentFlags().IntP("debug-sleep-time", "", 0, "debug sleep time")
	rootCmd.Flags().BoolP("version", "v", false, "show version")

	rootCmd.AddCommand(versioncmd.GetCommand())
}

// InitConfig reads in config file and ENV variables if set.
func InitConfig() {
	if len(os.Args) >= 2 {
		if os.Args[1] == versioncmd.GetCommand().Use {
			return
		}
	}

	cobra.CheckErr(config.InitConfig(rootCmd))
	if config.C.Debug {
		if config.C.DebugSleepTime > 0 {
			fmt.Printf("using debug mode, please wait time.Sleep(time.Second * %d)\n", config.C.DebugSleepTime)
		} else {
			fmt.Printf("using debug mode\n")
		}
		time.Sleep(time.Duration(config.C.DebugSleepTime) * time.Second)
		fmt.Printf("get config: %#v\n", config.C)
	}
}
