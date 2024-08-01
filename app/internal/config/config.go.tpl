package config

import (
    "github.com/zeromicro/go-zero/rest"
)

type Config struct {
    rest.RestConf

	Banner BannerConf
}

type BannerConf struct {
	Text     string `json:",default=JZERO"`
	Color    string `json:",default=green"`
	FontName string `json:",default=starwars,options=big|larry3d|starwars|standard"`
}