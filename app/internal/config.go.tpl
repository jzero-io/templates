package config

import (
    "github.com/zeromicro/go-zero/core/logx"
    "github.com/zeromicro/go-zero/rest"
)

type Config struct {
	Rest RestConf
	Log  LogConf
}

type RestConf struct {
	rest.RestConf
}

type LogConf struct {
	logx.LogConf
}