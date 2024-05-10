package config

import (
    "github.com/zeromicro/go-zero/core/logx"
    "github.com/zeromicro/go-zero/zrpc"
)

type Config struct {
	Zrpc    ZrpcConf

	{{ .APP | FirstUpper | ToCamel }}Conf
}

type ZrpcConf struct {
	zrpc.RpcServerConf

	MaxConns int `json:",default=10000"`
}

type LogConf struct {
	logx.LogConf
	// only Log.Mode is file or volume take effect
	LogToConsole bool `json:",default=true"`
}

type {{ .APP | FirstUpper | ToCamel }}Conf struct {
	Log   LogConf
}