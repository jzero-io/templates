APP: {{ .APP }}
Zrpc:
  ListenOn: 0.0.0.0:8000
  Mode: dev
  Name: {{ .APP }}.rpc
Gateway:
  Name: {{ .APP }}.gw
  Port: 8001
  Upstreams:
    - Grpc:
        Endpoints:
          - 0.0.0.0:8000
      Name: {{ .APP }}.gw
      ProtoSets:
        - desc/proto/v1/hello.pb

Log:
  encoding: plain

DatabaseType: mysql
Mysql:
    Addr: "127.0.0.1"
    Port: 3306
    Database: "test"
    Password: "123456"
    Username: "root"