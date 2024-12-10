package main

import (
	"{{ .Module }}/cmd"
	"{{ .Module }}/config"
)

const (
	APP       = "{{ .APP }}"
	VERSION   = "1.0.0"
	EnvPrefix = "CLI"
)

func main() {
	config.SetEnvPrefix(EnvPrefix)
	config.SetAPP(APP)
	cmd.SetVersion(VERSION)
	cmd.Execute()
}
