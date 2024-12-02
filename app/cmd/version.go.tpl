package cmd

import (
	"fmt"
	"github.com/spf13/cobra"
	"{{ .Module }}/config"
)

var (
	Version string
)

var versionCmd = &cobra.Command{
	Use:   "version",
	Short: "Print the version number",
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Println("{{ .APP }} version: ", Version)
	},
}

func init() {
	rootCmd.AddCommand(versionCmd)
}

func SetVersion(version string) {
	Version = version
	config.C.Version = version
}
