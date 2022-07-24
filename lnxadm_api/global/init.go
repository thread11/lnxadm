package global

import (
	"database/sql"
	"time"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/sessions"
	_ "github.com/mattn/go-sqlite3"

	"lnxadm/util"
)

var DB *sql.DB = nil
var STORE *sessions.CookieStore = nil
var WHITELIST []string = nil

func Init() {
	// InitDb()
	InitStore()
	InitWhitelist()
}

/*
sqlite = "./data/cms.db"
https://golang.org/pkg/database/sql/#Open
*/
func InitDbWithSqlite(sqlite string) {
	var err error

	if DB == nil {
		DB, err = sql.Open("sqlite3", sqlite)
		util.Throw(err)
		//
		// defer db.Close()
		// err = db.Ping()
		// util.Throw(err)
		//
	}
}

/*
mysql = "test:123@tcp(127.0.0.1:3306)/cms"
https://golang.org/pkg/database/sql/#Open
*/
func InitDbWithMysql(mysql string) {
	var err error

	if DB == nil {
		DB, err = sql.Open("mysql", mysql)
		util.Throw(err)
		DB.SetConnMaxLifetime(time.Minute * 3)
		DB.SetMaxOpenConns(10)
		DB.SetMaxIdleConns(10)
	}
}

func InitStore() {
	if STORE == nil {
		var key = "ABCDEFGHIJKLMNOPQRSTUVWXYZ01234567"
		STORE = sessions.NewCookieStore([]byte(key))
	}
}

func InitWhitelist() {
	if WHITELIST == nil {
		WHITELIST = []string{
			"/api/common/change_password",
			"/api/common/login",
			"/api/common/logout",
			"/api/common/update_profile",
			"/favicon.ico",
		}
	}
}
