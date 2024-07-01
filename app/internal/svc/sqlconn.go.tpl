package svc

import (
	"fmt"

	"{{ .Module }}/internal/config"
	"github.com/spf13/cast"
	"github.com/zeromicro/go-zero/core/stores/sqlx"
)

func buildDataSource(c config.Config) string {
	switch c.DataBaseType {
	case "mysql":
		return fmt.Sprintf("%s:%s@tcp(%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
			c.Mysql.Username,
			c.Mysql.Password,
			c.Mysql.Addr+":"+cast.ToString(c.Mysql.Port),
			c.Mysql.Database)
	}
	return ""
}

func MustSqlConn(c config.Config) sqlx.SqlConn {
	sqlConn := sqlx.NewSqlConn(c.DataBaseType, buildDataSource(c))
	// verify sql conn
	_, err := sqlConn.Exec("select 1")
	if err != nil {
		panic(err)
	}
	return sqlConn
}
