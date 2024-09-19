package count

import (
	"context"
	"{{ .Module }}/server/svc"
	"{{ .Module }}/server/types"
	"sync/atomic"

	"github.com/zeromicro/go-zero/core/logx"
)

var Count int64 = 0

type GetCount struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewGetCount(ctx context.Context, svcCtx *svc.ServiceContext) *GetCount {
	return &GetCount{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *GetCount) GetCount(req *types.Empty) (resp *types.GetCountResponse, err error) {
	atomic.AddInt64(&Count, 1)
	resp = &types.GetCountResponse{
		Count: int(atomic.LoadInt64(&Count)),
	}
	return
}
