package config

import (
    "github.com/zeromicro/go-zero/core/logx"
    "github.com/zeromicro/go-zero/rest"
)

type Config struct {
	Rest RestConf

	{{ .APP | FirstUpper | ToCamel }}Conf
}

type RestConf struct {
	rest.RestConf
}

type LogConf struct {
	logx.LogConf
	// only Log.Mode is file or volume take effect
	LogToConsole bool `json:",default=true"`
}

type {{ .APP | FirstUpper | ToCamel }}Conf struct {
	Log   LogConf
}