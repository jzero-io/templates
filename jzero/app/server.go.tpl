package app

import (
	"fmt"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/zeromicro/go-zero/core/conf"
    "github.com/zeromicro/go-zero/core/logx"
	"github.com/zeromicro/go-zero/core/service"
	"github.com/jzero-io/jzero-contrib/swaggerv2"
	"github.com/zeromicro/go-zero/rest"
    "github.com/zeromicro/go-zero/rest/httpx"

	"{{ .Module }}/app/internal/config"
	"{{ .Module }}/app/internal/handler"
	"{{ .Module }}/app/internal/svc"
	"{{ .Module }}/app/middlewares"
)



func signalHandler(serviceGroup *service.ServiceGroup) {
	// signal handler
	c := make(chan os.Signal, 1)
	signal.Notify(c, syscall.SIGHUP, syscall.SIGQUIT, syscall.SIGTERM, syscall.SIGINT)
	for {
		s := <-c
		switch s {
		case syscall.SIGQUIT, syscall.SIGTERM, syscall.SIGINT:
			fmt.Println("Waiting 1 second...\nStopping rest server")
			time.Sleep(time.Second)
			serviceGroup.Stop()
			return
		case syscall.SIGHUP:
		default:
			return
		}
	}
}
