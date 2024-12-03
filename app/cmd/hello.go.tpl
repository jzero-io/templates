package cmd

import (
	"fmt"
	"github.com/spf13/cobra"
	"{{ .Module }}/config"
)

// helloCmd represents the hello command
var helloCmd = &cobra.Command{
	Use:   "hello",
	Short: `{{ .APP }} hello`,
	PreRunE: func(cmd *cobra.Command, args []string) error {
		fmt.Println("Start Before hooks")
		return nil
	},
	RunE: func(cmd *cobra.Command, args []string) error {
		fmt.Println("Run hello command")
		fmt.Println(config.C)
		return nil
	},
	PostRunE: func(cmd *cobra.Command, args []string) error {
		fmt.Println("Start after hooks")
		return nil
	},
}

// worldCmd represents the world command
var worldCmd = &cobra.Command{
	Use:   "world",
	Short: `{{ .APP }} hello world`,
	RunE: func(cmd *cobra.Command, args []string) error {
		fmt.Println("Run hello world command")
		fmt.Println(config.C)
		return nil
	},
}

func init() {
	{
		rootCmd.AddCommand(helloCmd)

		helloCmd.PersistentFlags().String("helloField", "hello", "hello field")
	}

	{
		helloCmd.AddCommand(worldCmd)

		helloCmd.PersistentFlags().String("worldField", "world", "world field")
	}
}
