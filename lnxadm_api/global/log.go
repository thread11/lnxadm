package global

import (
	"lnxadm/util"
	"log"
	"net/http"
)

func RecordRequest(request *http.Request, user_id interface{}) {
	var err error

	var path string
	var user_agent string
	var referer string

	path = request.URL.Path
	user_agent = request.Header.Get("User-Agent")
	referer = request.Header.Get("Referer")

	var ip string
	ip = util.GetIP(request)

	var access_time string
	var create_time string
	var update_time string

	access_time = util.TimeNow()
	create_time = access_time
	update_time = access_time

	log.Println(user_id)
	log.Println(path)
	log.Println(ip)
	log.Println(user_agent)
	log.Println(referer)
	log.Println(access_time)

	if path == "/favicon.ico" {
		return
	}

	{
		var query string
		query = `
			INSERT INTO sys_log (
				path, ip, user_agent, referer, access_time, create_time, update_time,
				user_id
			)
			VALUES (?,?,?,?,?,?,?,?)
		`
		_, err = DB.Exec(
			query,
			path, ip, user_agent, referer, access_time, create_time, update_time,
			user_id,
		)
		util.Skip(err)
	}
}
