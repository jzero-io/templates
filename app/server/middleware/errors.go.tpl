package middleware

import (
	"net/http"
)

func ErrorHandler(err error) (int, any) {
	return http.StatusOK, Body{
		Data:    nil,
		Code:    http.StatusInternalServerError,
		Message: err.Error(),
	}
}
