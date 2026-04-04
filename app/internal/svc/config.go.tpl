package svc

import (
	"github.com/zeromicro/go-zero/core/logx"

	"{{ .Module }}/internal/config"
)

func (svcCtx *ServiceContext) GetConfig() (config.Config, error) {
	return svcCtx.ConfigCenter.GetConfig()
}

func (svcCtx *ServiceContext) MustGetConfig() config.Config {
	return svcCtx.ConfigCenter.MustGetConfig()
}