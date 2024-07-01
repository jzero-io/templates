package config

import (
    "github.com/zeromicro/go-zero/core/logx"
    "github.com/zeromicro/go-zero/gateway"
    "github.com/zeromicro/go-zero/zrpc"
)

type Config struct {
	Zrpc    ZrpcConf
	Gateway GatewayConf
	Log     LogConf

	DatabaseType   string `json:",default=mysql"`
	Mysql MysqlConf
}

type ZrpcConf struct {
	zrpc.RpcServerConf
}

type GatewayConf struct {
	gateway.GatewayConf
}

type LogConf struct {
	logx.LogConf
}

type MysqlConf struct {
	Username   string `json:",default=root"`
	Password   string `json:",default=123456"`
	Addr       string `json:",default=127.0.0.1"`
	Port       int    `json:",default=3306"`
	Database   string `json:",default=ntls"`
}