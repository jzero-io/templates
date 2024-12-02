package main

import (
	"{{ .Module }}/cmd"
	"{{ .Module }}/config"
)

const (
	APP        = "{{ .APP }}"
	VERSION    = "1.0.0"
	ENV_PREFIX = "CLI"
)

func main() {
	config.SetEndPrefix(ENV_PREFIX)
	config.SetAPP(APP)
	cmd.SetVersion(VERSION)
	cmd.Execute()
}
