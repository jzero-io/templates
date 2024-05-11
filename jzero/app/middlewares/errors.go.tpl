package middlewares

import (
	"net/http"
)

func ErrorHandler(err error) (int, any) {
	if err != nil {
		return http.StatusInternalServerError, err
	}
	return 0, nil
}
