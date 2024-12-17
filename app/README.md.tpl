# CLI Template Project

## How to use?

```shell
jzero new YOUR_APP_NAME --branch cli
```

## Cookbook

### How to set environment variables

- Create any variable in `$HOME/.{{ APP_NAME }}/.env.yaml` and use it in `$HOME/.{{ APP_NAME }}/etc.yaml` with `${}`.

- Create the following variable `{ENV_PREFIX}_A_B` in `$HOME/.{{ APP_NAME }}/.env.yaml`. This value will be applied in `config.C.a.b`.

