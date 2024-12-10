package config

import (
	"encoding/json"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
	"strings"
)

// C global command flags
var C = &Config{}

type Config struct {
	App     string `mapstructure:"app"`
	Syntax  string `mapstructure:"syntax"`
	Version string `mapstructure:"version"`

	// hello command
	Hello HelloConfig `mapstructure:"hello"`
}

type HelloConfig struct {
	HelloField string `mapstructure:"helloField"`

	// world command
	World WorldConfig `mapstructure:"world"`
}

type WorldConfig struct {
	WorldField string `mapstructure:"worldField"`
}

func SetAPP(app string) {
	C.App = app
}

func SetEnvPrefix(envPrefix string) {
	viper.SetEnvPrefix(envPrefix)
}

func SetConfig() {
	viper.SetEnvKeyReplacer(strings.NewReplacer(".", "_"))
	viper.AutomaticEnv()
	err := viper.Unmarshal(C)
	cobra.CheckErr(err)
}

func (c *Config) String() string {
	marshal, err := json.Marshal(c)
	if err != nil {
		return ""
	}
	return string(marshal)
}
