{
  "version": 2,
  "builds": [
    {
      "use": "@vercel/go",
      "src": "api/client.go",
      "config": {
        "zeroConfig": true
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/api/client"
    }
  ]
}