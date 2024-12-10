package cmd

import (
	"errors"
	"fmt"
	"github.com/a8m/envsubst"
	"github.com/jzero-io/jzero-contrib/filex"
	"github.com/spf13/cobra"
	"github.com/spf13/pflag"
	"github.com/spf13/viper"
	"gopkg.in/yaml.v3"
	"os"
	"path"
	"{{ .Module }}/config"
)

var (
	configFile string
	envFile    string
)

var rootCmd = &cobra.Command{
	Use:   "{{ .APP }}",
	Short: "Short description of {{ .APP }}",
	Long:  `Long description of {{ .APP }}`,
}

func init() {
	cobra.OnInitialize(initConfig)

	userHome, err := os.UserHomeDir()
	cobra.CheckErr(err)
	rootCmd.PersistentFlags().StringVar(&configFile, "config", path.Join(userHome, ".{{- .APP }}", "etc.yaml"), "config file path")
	rootCmd.PersistentFlags().StringVar(&envFile, "env", path.Join(userHome, ".{{- .APP }}", ".env.yaml"), "env file path")
	rootCmd.PersistentFlags().String("syntax", "v1", "config file syntax version")

	err = viper.BindPFlag("syntax", rootCmd.PersistentFlags().Lookup("syntax"))
	cobra.CheckErr(err)
}

func Execute() {
	if err := rootCmd.Execute(); err != nil {
		os.Exit(1)
	}
}

func initEnv() {
	envPath := rootCmd.PersistentFlags().Lookup("env").Value.String()

	if !filex.FileExists(envPath) {
		return
	}

	if !filex.IsYamlFile(envPath) {
		cobra.CheckErr(errors.New("File is not a YAML file: " + envPath))
	}

	content, err := os.ReadFile(envPath)
	cobra.CheckErr(err)

	var envs map[string]interface{}
	err = yaml.Unmarshal(content, &envs)
	cobra.CheckErr(err)

	for key, value := range envs {
		err = os.Setenv(key, fmt.Sprintf("%v", value))
		cobra.CheckErr(err)
	}
}

func initConfig() {
	initEnv()

	// read config file using env to fill ${}
	cfgFile := rootCmd.PersistentFlags().Lookup("config").Value.String()

	if !filex.FileExists(cfgFile) {
		return
	}

	c, err := envsubst.ReadFile(cfgFile)

	var cs map[string]any
	err = yaml.Unmarshal(c, &cs)
	cobra.CheckErr(err)

	err = viper.MergeConfigMap(cs)
	cobra.CheckErr(err)

	// set all command flags to viper
	traverseBindViperFlags("", rootCmd)

	// set config
	config.SetConfig()
}

func traverseBindViperFlags(prefix string, command *cobra.Command) {
	bindViperFlags(prefix, command)
	for _, childCommand := range command.Commands() {
		tp := ""
		if prefix == "" {
			tp = childCommand.Name()
		} else {
			tp = fmt.Sprintf("%s.%s", prefix, childCommand.Name())
		}
		traverseBindViperFlags(tp, childCommand)
	}
}

func bindViperFlags(prefix string, command *cobra.Command) {
	command.Flags().VisitAll(func(f *pflag.Flag) {
		err := viper.BindPFlag(fmt.Sprintf("%s.%s", prefix, f.Name), f)
		cobra.CheckErr(err)
	})
}
