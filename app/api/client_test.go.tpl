package api

import (
	"encoding/json"
	"gopkg.in/yaml.v3"
	"os"
	"testing"
)

func TestClient(t *testing.T) {
	file, err := os.ReadFile("../etc/etc.yaml")
	if err != nil {
		panic(err)
	}
	var config map[string]any
	err = yaml.Unmarshal(file, &config)
	if err != nil {
		panic(err)
	}
	marshal, err := json.Marshal(config)
	if err != nil {
		panic(err)
	}
	t.Log(string(marshal))
}
