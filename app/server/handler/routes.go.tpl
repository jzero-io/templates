package handler

import (
	"net/http"
	count "{{ .Module }}/server/handler/count"
	"{{ .Module }}/server/svc"

	"github.com/zeromicro/go-zero/rest"
)

func RegisterHandlers(server *rest.Server, serverCtx *svc.ServiceContext) {
	server.AddRoutes(
		[]rest.Route{
			{
				Method:  http.MethodGet,
				Path:    "/count",
				Handler: count.GetCount(serverCtx),
			},
		},
		rest.WithPrefix("/api/v1"),
	)
}
