package middleware

import (
	"github.com/zeromicro/go-zero/rest"
	"github.com/zeromicro/go-zero/rest/httpx"
)

func RegisterMiddlewares(server *rest.Server) {
	httpx.SetOkHandler(OKHandler)
	httpx.SetErrorHandler(ErrorHandler)
}
