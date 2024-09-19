package count

import (
	"net/http"
	"{{ .Module }}/server/logic/count"
	"{{ .Module }}/server/svc"
	"{{ .Module }}/server/types"

	"github.com/zeromicro/go-zero/rest/httpx"
)

func GetCount(svcCtx *svc.ServiceContext) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req types.Empty
		if err := httpx.Parse(r, &req); err != nil {
			httpx.ErrorCtx(r.Context(), w, err)
			return
		}

		l := count.NewGetCount(r.Context(), svcCtx)
		resp, err := l.GetCount(&req)
		if err != nil {
			httpx.ErrorCtx(r.Context(), w, err)
		} else {
			httpx.OkJsonCtx(r.Context(), w, resp)
		}
	}
}
