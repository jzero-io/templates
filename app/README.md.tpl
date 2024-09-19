# go-serverless-vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/jaronnie/go-serverless-vercel&project-name=go-serverless-vercel&repository-name=go-serverless-vercel&env=CONFIG)

## 测试验证接口

[https://vercel.jaronnie.com/api/v1/version](https://vercel.jaronnie.com/api/v1/version)

## 开发必看

### vercel 线上配置环境变量

访问: https://vercel.com/username-projects/project_name/settings/environment-variables

注意替换 `username` 为你的用户名以及 `project_name` 为你的项目名

增加环境变量配置如: CONFIG={"log":{"encoding":"plain"},"rest":{"host":"0.0.0.0","name":"go-serverless-vercel","port":8001}}

### 本地开发

1. 配置开发环境

```shell
go install github.com/jzero-io/jzero@latest
jzero check
go install github.com/jzero-io/gorename@latest
```

2. 生成代码

```shell
jzero gen
```


