package main

import (
	"flag"
	"fmt"

	"{{ .Module }}/internal/config"
	"{{ .Module }}/internal/server"
	"{{ .Module }}/internal/svc"
	"{{ .Module }}/internal/server"

	"github.com/zeromicro/go-zero/core/conf"
	"github.com/common-nighthawk/go-figure"
)

var configFile = flag.String("f", "etc/etc.yaml", "set config file")

func main() {
	flag.Parse()

	var c config.Config
	conf.MustLoad(*configFile, &c)
	ctx := svc.NewServiceContext(c)

	s := server.RegisterZrpc(c, ctx)
	defer s.Stop()

    printBanner(c)
	fmt.Printf("Starting rpc server at %s...\n", c.Zrpc.ListenOn)
	s.Start()
}

func printBanner(c config.Config) {
	figure.NewColorFigure(c.Banner.Text, c.Banner.FontName, c.Banner.Color, true).Print()
}