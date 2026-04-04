package vercel

import (
	"net/http"
	"os"
	"{{ .Module }}/internal/config"
	"{{ .Module }}/internal/custom"
	"{{ .Module }}/internal/handler"
	"{{ .Module }}/internal/middleware"
	"{{ .Module }}/internal/svc"

	"github.com/zeromicro/go-zero/core/conf"
	"github.com/zeromicro/go-zero/core/logx"
	"github.com/zeromicro/go-zero/core/service"
	"github.com/zeromicro/go-zero/rest"
	"github.com/zeromicro/go-zero/rest/httpx"
)

var (
	Serverless *rest.Serverless
)

type EnvConfigurator struct {
	Key string
}

func (e *EnvConfigurator) MustGetConfig() config.Config {
	c, err := e.GetConfig()
	logx.Must(err)
	return c
}

func (e *EnvConfigurator) GetConfig() (config.Config, error) {
	var c config.Config
	err := conf.LoadFromJsonBytes([]byte(os.Getenv(e.Key)), &c)
	if err == nil {
		return c, nil
	}
	return config.Config{}, err
}

func (e *EnvConfigurator) AddListener(listener func()) {
	listener()
}

func init() {
	key := "CONFIG"
	if os.Getenv(key) == "" {
		_ = os.Setenv(key, `{
    "rest": {
        "name": "{{ .APP }}-api",
        "port": 8001
    }
}`)
	}

	cc := &EnvConfigurator{Key: key}
	c, err := cc.GetConfig()
	logx.Must(err)

	logx.Must(logx.SetUp(c.Log.LogConf))

	restServer := rest.MustNewServer(c.Rest.RestConf,
		rest.WithUnauthorizedCallback(func(w http.ResponseWriter, r *http.Request, err error) {
			httpx.ErrorCtx(r.Context(), w, err)
		}),
		rest.WithCustomCors(func(header http.Header) {
			header.Set("Access-Control-Allow-Origin", "*")
			header.Add("Access-Control-Allow-Headers", "Content-Type, X-Request-Id")
			header.Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE, UPDATE")
		}, nil, "*"))

	svcCtx := svc.NewServiceContext(cc)
	middleware.Register(restServer)
	handler.RegisterHandlers(restServer, svcCtx)

	Serverless, err = rest.NewServerless(restServer)
	logx.Must(err)

	customServer := custom.New()

	group := service.NewServiceGroup()
	group.Add(customServer)
	group.Start()
}

func Index(w http.ResponseWriter, r *http.Request) {
	Serverless.Serve(w, r)
}
