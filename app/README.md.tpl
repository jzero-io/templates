# CLI Template Project

## How to use?

```shell
jzero new YOUR_APP_NAME --branch cli
```

## Cookbook

### How to set environment variables

- Create any variable in `etc/.env.yaml` and use it in `etc/etc.yaml` with `${}`.

- Create the following variable `{ENV_PREFIX}_A_B` in `etc/.env.yaml`. This value will be applied in `config.C.a.b`.

