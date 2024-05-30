package cmd

import (
	"github.com/spf13/cobra"

	"github.com/zeromicro/go-zero/core/conf"
    "github.com/zeromicro/go-zero/core/logx"
	"github.com/zeromicro/go-zero/core/service"

	"{{ .Module }}/app/internal/config"
	"{{ .Module }}/app/internal/svc"
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

	ctx := svc.NewServiceContext(c)
	start(ctx)
}

func start(ctx *svc.ServiceContext) {
	s := server.RegisterZrpc(ctx.Config, ctx)

	group := service.NewServiceGroup()
	group.Add(s)

	fmt.Printf("Starting rpc server at %s...\n", ctx.Config.Zrpc.ListenOn)
	group.Start()
}

func init() {
	rootCmd.AddCommand(serverCmd)
}
