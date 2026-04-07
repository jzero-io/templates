package config

import (
	"fmt"
	"os"
	"strings"

	"github.com/a8m/envsubst"
	"github.com/spf13/cast"
	"github.com/spf13/cobra"
	"github.com/spf13/pflag"
	"github.com/spf13/viper"
	"gopkg.in/yaml.v3"
)

// C global command flags
var C Config

var (
	CfgFile    string
	CfgEnvFile string
	EnvPrefix  = "{{.APP | upper}}"
)

type Config struct {
	// root persistent flags
	Debug bool `mapstructure:"debug"`

	DebugSleepTime int `mapstructure:"debug-sleep-time"`
}

func TraverseCommands(prefix string, cmd *cobra.Command) error {
	err := SetConfig(prefix, cmd.Flags())
	if err != nil {
		return err
	}

	for _, subCommand := range cmd.Commands() {
		newPrefix := fmt.Sprintf("%s.%s", prefix, subCommand.Use)
		if prefix == "" {
			newPrefix = subCommand.Use
		}

		err = TraverseCommands(newPrefix, subCommand)
		if err != nil {
			return err
		}
	}

	return nil
}

func ResetConfig() {
	C = Config{}
}

func InitConfig(rootCmd *cobra.Command) error {
	if _, err := os.Stat(CfgFile); err == nil {
		viper.SetConfigFile(CfgFile)
		// If a config file is found, read it in.
		if err := viper.ReadInConfig(); err != nil {
			return err
		}
	}

	if _, err := os.Stat(CfgEnvFile); err == nil {
		data, err := envsubst.ReadFile(CfgEnvFile)
		if err != nil {
			return err
		}
		var envMap map[string]any
		err = yaml.Unmarshal(data, &envMap)
		if err != nil {
			return err
		}

		for k, v := range envMap {
			if vs, ok := v.([]any); ok {
				var envs []string
				for _, e := range vs {
					envs = append(envs, cast.ToString(e))
				}
				_ = os.Setenv(k, strings.Join(envs, ","))
			} else {
				_ = os.Setenv(k, cast.ToString(v))
			}
		}
	}

	if err := TraverseCommands("", rootCmd); err != nil {
		return err
	}
	return nil
}

func SetConfig(command string, flagSet *pflag.FlagSet) error {
	flagSet.VisitAll(func(flag *pflag.Flag) {
		if command == "" {
			err := viper.BindPFlag(flag.Name, flag)
			if err != nil {
				panic(err)
			}
		} else {
			err := viper.BindPFlag(fmt.Sprintf("%s.%s", command, flag.Name), flag)
			if err != nil {
				panic(err)
			}
		}
	})

	viper.SetEnvPrefix(EnvPrefix)
	viper.SetEnvKeyReplacer(strings.NewReplacer(".", "_", "-", "_"))
	viper.AutomaticEnv()

	if err := viper.Unmarshal(&C); err != nil {
		return err
	}
	return nil
}
