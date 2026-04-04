package main

import (
	"net/http"

	"{{ .Module }}/vercel"
)

func main() {
	err := http.ListenAndServe(":8001", http.HandlerFunc(vercel.Index))
	if err != nil {
		panic(err)
	}
}