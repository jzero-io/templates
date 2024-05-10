// Code generated by jzero. DO NOT EDIT.

package app

import (
	"github.com/zeromicro/go-zero/core/service"
	"github.com/zeromicro/go-zero/zrpc"
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"

	"{{ .Module }}/app/internal/config"
	"{{ .Module }}/app/internal/svc"{{ if .ServerImports }}{{ .ServerImports }}{{ end }}{{ if .PbImports }}{{ .PbImports }}{{ end }}
)

func getZrpcServer(c config.Config, ctx *svc.ServiceContext) *zrpc.RpcServer {
	s := zrpc.MustNewServer(c.Zrpc.RpcServerConf, func(grpcServer *grpc.Server) {
	    {{ if .RegisterServers }}{{ .RegisterServers }}{{ end }}

		if c.Zrpc.Mode == service.DevMode || c.Zrpc.Mode == service.TestMode {
			reflection.Register(grpcServer)
		}
	})

	return s
}
