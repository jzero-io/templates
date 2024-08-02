package config

import (
    "github.com/zeromicro/go-zero/zrpc"
)

type Config struct {
	zrpc.RpcServerCon

	Banner BannerConf
}

type BannerConf struct {
	Text     string `json:",default=JZERO"`
	Color    string `json:",default=green"`
	FontName string `json:",default=starwars,options=big|larry3d|starwars|standard"`
}
