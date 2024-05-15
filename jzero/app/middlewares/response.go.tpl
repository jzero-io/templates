package middlewares

import (
	"context"
	"net/http"
)

type Body struct {
	Data    interface{} `json:"data"`
	Code    int         `json:"statusCode"`
	Message string      `json:"comments"`
}

func OkHandler(_ context.Context, data any) any {
	return Body{
		Data:    data,
		Code:    http.StatusOK,
		Message: "success",
	}
}
