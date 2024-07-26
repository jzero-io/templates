package middleware

import (
	"github.com/zeromicro/go-zero/core/logx"
	"net/http"
)

func ErrorHandler(err error) (int, any) {
	return http.StatusOK, Body{
		Data:    nil,
		Code:    http.StatusInternalServerError,
		Message: err.Error(),
	}
}
