{
  "version": 2,
  "builds": [
    {
      "use": "@vercel/go",
      "src": "vercel/client.go",
      "config": {
        "zeroConfig": true
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/vercel/client"
    }
  ]
}