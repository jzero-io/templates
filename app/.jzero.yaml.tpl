syntax: v1

gen:
  hooks:
    before:
      - gorename go-serverless-vercel/server go-serverless-vercel/internal
    after:
      - gorename go-serverless-vercel/internal go-serverless-vercel/server

  regen-api-handler: true