package log

import (
	"database/sql"
	"net/http"
	"strconv"

	"lnxadm/global"
	"lnxadm/util"
)

func GetLog(response http.ResponseWriter, request *http.Request) {
	var err error

	var id string
	id = util.FormValueOf(request, "id")

	if util.IsNotSet(id) || util.IsNotInt(id) {
		util.Api(response, 400)
		return
	}

	var log map[string]interface{}
	log = make(map[string]interface{})

	{
		var query string
		query = `
			SELECT
				log.id, log.path, log.ip, log.user_agent, log.referer, log.access_time,
				log.create_time, log.update_time,
				user.username, user.nickname
			FROM sys_log log
			LEFT JOIN auth_user user ON log.user_id=user.id
			WHERE log.id=?
		`

		var row *sql.Row
		row = global.DB.QueryRow(query, id)

		var id2 int64
		var path string
		var ip string
		var user_agent string
		var referer string
		var access_time string
		var create_time string
		var update_time string
		var username string
		var nickname string

		err = row.Scan(
			&id2, &path, &ip, &user_agent, &referer, &access_time,
			&create_time, &update_time,
			&username, &nickname,
		)
		util.Throw(err)

		log = map[string]interface{}{
			"id":          id2,
			"path":        path,
			"ip":          ip,
			"user_agent":  user_agent,
			"referer":     referer,
			"access_time": util.TimeOf(access_time),
			"create_time": util.TimeOf(create_time),
			"update_time": util.TimeOf(update_time),
			"username":    username,
			"nickname":    nickname,
		}
	}

	util.Api(response, 200, log)
}

func GetLogs(response http.ResponseWriter, request *http.Request) {
	var err error

	var page string
	var size string

	page = util.FormValueOf(request, "page")
	size = util.FormValueOf(request, "size")

	if util.IsNotInt(page, size) {
		util.Api(response, 400)
		return
	}

	var page2 interface{}
	var size2 interface{}

	page2 = util.ParseNil(page)
	size2 = util.ParseNil(size)

	var page3 int64
	var size3 int64

	page3 = 1
	size3 = 10

	if page2 != nil {
		page3, err = strconv.ParseInt(page2.(string), 10, 64)
		util.Throw(err)
	}
	if size2 != nil {
		size3, err = strconv.ParseInt(size2.(string), 10, 64)
		util.Throw(err)
	}

	var offset int64
	var limit int64

	offset = (page3 - 1) * size3
	if offset < 0 {
		offset = 0
	}
	limit = size3

	var total int64

	{
		var query string
		query = "SELECT COUNT(1) count FROM sys_log"

		var row *sql.Row
		row = global.DB.QueryRow(query)

		err = row.Scan(&total)
		util.Throw(err)
	}

	var logs []map[string]interface{}
	logs = make([]map[string]interface{}, 0)

	{
		var query string
		query = `
			SELECT
				log.id, log.path, log.ip, log.user_agent, log.referer, log.access_time,
				user.username, user.nickname
			FROM sys_log log
			LEFT JOIN auth_user user ON log.user_id=user.id
			ORDER BY log.id DESC
			LIMIT ? OFFSET ?
		`

		var rows *sql.Rows
		rows, err = global.DB.Query(query, limit, offset)
		defer rows.Close()
		util.Throw(err)

		for rows.Next() {
			var id int64
			var path string
			var ip string
			var user_agent string
			var referer string
			var access_time string
			var username sql.NullString
			var nickname sql.NullString

			err = rows.Scan(
				&id, &path, &ip, &user_agent, &referer, &access_time,
				&username, &nickname,
			)
			util.Throw(err)

			logs = append(
				logs,
				map[string]interface{}{
					"id":          id,
					"path":        path,
					"ip":          ip,
					"user_agent":  user_agent,
					"referer":     referer,
					"access_time": util.TimeOf(access_time),
					"username":    username.String,
					"nickname":    nickname.String,
				},
			)
		}
	}

	var pagination map[string]interface{}
	pagination = util.GetPagination(page3, size3, total)

	var extras map[string]interface{}
	extras = map[string]interface{}{
		"pagination": pagination,
	}

	util.Api(response, 200, logs, extras)
}
