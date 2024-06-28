package config

import (
    "github.com/zeromicro/go-zero/core/logx"
    "github.com/zeromicro/go-zero/zrpc"
)

type Config struct {
	Zrpc    ZrpcConf
	Log     LogConf
}

type ZrpcConf struct {
	zrpc.RpcServerConf
}

type LogConf struct {
	logx.LogConf
}