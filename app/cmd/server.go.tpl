package cmd

import (
	"fmt"

	"github.com/spf13/cobra"
	"github.com/zeromicro/go-zero/core/conf"
    "github.com/zeromicro/go-zero/core/logx"
	"github.com/zeromicro/go-zero/core/service"
	"github.com/jzero-io/jzero-contrib/logtoconsole"
	"github.com/jzero-io/jzero-contrib/swaggerv2"
	"github.com/zeromicro/go-zero/rest"

	"{{ .Module }}/internal/config"
	"{{ .Module }}/internal/handler"
	"{{ .Module }}/internal/svc"
)

// serverCmd represents the server command
var serverCmd = &cobra.Command{
	Use:   "server",
	Short: "{{ .APP }} server",
	Long:  "{{ .APP }} server",
	Run: func(cmd *cobra.Command, args []string) {
		Start(cfgFile)
	},
}

func Start(cfgFile string) {
	var c config.Config
	conf.MustLoad(cfgFile, &c)
    // set up logger
    if err := logx.SetUp(c.Log.LogConf); err != nil {
        logx.Must(err)
    }
    logtoconsole.Must(c.Log.LogConf)

	ctx := svc.NewServiceContext(c)
	start(ctx)
}

func start(ctx *svc.ServiceContext) {
	server := rest.MustNewServer(ctx.Config.Rest.RestConf)

	// server add api handlers
	handler.RegisterHandlers(server, ctx)

	// server add swagger routes. If you do not want it, you can delete this line
    swaggerv2.RegisterRoutes(server)

	// server add routes
    // You can use server.AddRoutes() to add your own handler
    // for example: add a func handler.RegisterMyHandlers() in this line on handler dir

	group := service.NewServiceGroup()
	group.Add(server)

	fmt.Printf("Starting rest server at %s:%d...\n", ctx.Config.Rest.Host, ctx.Config.Rest.Port)
	group.Start()
}

func init() {
	rootCmd.AddCommand(serverCmd)
}
