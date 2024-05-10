APP: {{ .APP }}
Zrpc:
    ListenOn: 0.0.0.0:8000
    Mode: dev
    Name: {{ .APP }}.rpc

Log:
    encoding: plain
