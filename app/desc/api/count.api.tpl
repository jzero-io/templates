syntax = "v1"

type Empty {}

type GetCountResponse {
	count int `json:"count"`
}

@server (
	prefix: /api/v1
	group:  count
)
service goServerlessVercel {
	@handler GetCountHandler
	get /count (Empty) returns (GetCountResponse)
}

