package cmd

import (
	"github.com/spf13/cobra"
	"github.com/zeromicro/go-zero/core/conf"
    "github.com/zeromicro/go-zero/core/logx"
	"github.com/zeromicro/go-zero/core/service"
	"github.com/zeromicro/go-zero/core/proc"
	"github.com/jzero-io/jzero-contrib/logtoconsole"
	"golang.org/x/sync/errgroup"
	"github.com/common-nighthawk/go-figure"

	"{{ .Module }}/internal/config"
	"{{ .Module }}/internal/middlewares"
	"{{ .Module }}/internal/server"
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
	config.C = c

    // set up logger
    if err := logx.SetUp(c.Log.LogConf); err != nil {
        logx.Must(err)
    }
    logtoconsole.Must(c.Log.LogConf)

	ctx := svc.NewServiceContext(c)
	start(ctx)
}

func start(svcCtx *svc.ServiceContext) {
	s := server.RegisterZrpc(ctx.Config, svcCtx)
    s.AddUnaryInterceptors(middlewares.ServerValidationUnaryInterceptor)

	group := service.NewServiceGroup()
	group.Add(s)

    // shutdown listener
	waitExit := proc.AddShutdownListener(svcCtx.Custom.Stop)

	eg := errgroup.Group{}
	eg.Go(func() error {
		printBanner(svcCtx.Config)
		logx.Infof("Starting rpc server at %s:%d...", svcCtx.Config.Zrpc.Host, svcCtx.Config.Zrpc.Port)
		group.Start()
		return nil
	})

	// add custom start logic
	eg.Go(func() error {
		svcCtx.Custom.Start()
		return nil
	})

	if err := eg.Wait(); err != nil {
		panic(err)
	}

	waitExit()
}

func printBanner(c config.Config) {
	figure.NewColorFigure(c.Banner.Text, c.Banner.FontName, c.Banner.Color, true).Print()
}


func init() {
	rootCmd.AddCommand(serverCmd)
}
