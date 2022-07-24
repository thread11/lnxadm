package dept

import (
	"database/sql"
	"log"
	"net/http"
	"strings"

	"lnxadm/global"
	"lnxadm/util"
)

func AddDept(response http.ResponseWriter, request *http.Request) {
	var err error

	var name string
	var remark string

	name = util.FormValueOf(request, "name")
	remark = util.FormValueOf(request, "remark")

	if util.IsNotSet(name) {
		util.Api(response, 400)
		return
	}

	var remark2 interface{}
	remark2 = util.ParseNil(remark)

	var create_time string
	var update_time string

	create_time = util.TimeNow()
	update_time = create_time

	{
		var query string
		query = "INSERT INTO auth_dept (name, remark, create_time, update_time) VALUES (?,?,?,?)"
		_, err = global.DB.Exec(query, name, remark2, create_time, update_time)
		if err != nil {
			log.Println(err)
			if strings.Contains(err.Error(), "UNIQUE constraint failed") {
				util.Api(response, 409)
				return
			}
		}
		util.Throw(err)
	}

	util.Api(response, 200)
}

func DeleteDept(response http.ResponseWriter, request *http.Request) {
	var err error

	var id string
	id = util.FormValueOf(request, "id")

	if util.IsNotSet(id) || util.IsNotInt(id) {
		util.Api(response, 400)
		return
	}

	var update_time string
	update_time = util.TimeNow()

	var tx *sql.Tx
	tx, err = global.DB.Begin()
	defer tx.Rollback()
	util.Throw(err)

	{
		var query string
		query = "DELETE FROM auth_dept WHERE id=?"
		_, err = tx.Exec(query, id)
		util.Throw(err)
	}

	{
		var query string
		query = "UPDATE auth_user SET dept_id=NULL, update_time=? WHERE dept_id=?"
		_, err = tx.Exec(query, update_time, id)
		util.Throw(err)
	}

	tx.Commit()

	util.Api(response, 200)
}

func GetDept(response http.ResponseWriter, request *http.Request) {
	var err error

	var id string
	id = util.FormValueOf(request, "id")

	if util.IsNotSet(id) || util.IsNotInt(id) {
		util.Api(response, 400)
		return
	}

	var dept map[string]interface{}
	dept = make(map[string]interface{})

	{
		var query string
		query = "SELECT id, name, remark, create_time, update_time FROM auth_dept WHERE id=?"

		var row *sql.Row
		row = global.DB.QueryRow(query, id)

		var id2 int64
		var name string
		var remark sql.NullString
		var create_time sql.NullString
		var update_time sql.NullString

		err = row.Scan(&id2, &name, &remark, &create_time, &update_time)
		util.Throw(err)

		var remark2 interface{}
		if remark.Valid {
			remark2 = remark.String
		}

		dept = map[string]interface{}{
			"id":          id2,
			"name":        name,
			"remark":      remark2,
			"create_time": util.TimeOf(create_time.String),
			"update_time": util.TimeOf(update_time.String),
		}
	}

	util.Api(response, 200, dept)
}

func GetDepts(response http.ResponseWriter, request *http.Request) {
	var err error

	var query string
	query = "SELECT id, name, remark FROM auth_dept ORDER BY name"

	var depts []map[string]interface{}
	depts = make([]map[string]interface{}, 0)

	{
		var rows *sql.Rows
		rows, err = global.DB.Query(query)
		defer rows.Close()
		util.Throw(err)

		for rows.Next() {
			var id int
			var name string
			var remark sql.NullString

			err = rows.Scan(&id, &name, &remark)
			util.Throw(err)

			var remark2 interface{}
			if remark.Valid {
				remark2 = remark.String
			}

			depts = append(
				depts,
				map[string]interface{}{
					"id":     id,
					"name":   name,
					"remark": remark2,
				},
			)
		}
	}

	util.Api(response, 200, depts)
}

func UpdateDept(response http.ResponseWriter, request *http.Request) {
	var err error

	var id string
	var name string
	var remark string

	id = util.FormValueOf(request, "id")
	name = util.FormValueOf(request, "name")
	remark = util.FormValueOf(request, "remark")

	if util.IsNotSet(id, name) || util.IsNotInt(id) {
		util.Api(response, 400)
		return
	}

	var remark2 interface{}
	remark2 = util.ParseNil(remark)

	var update_time string
	update_time = util.TimeNow()

	{
		var query string
		query = "UPDATE auth_dept SET name=?, remark=?, update_time=? WHERE id=?"
		_, err = global.DB.Exec(query, name, remark2, update_time, id)
		util.Throw(err)
	}

	util.Api(response, 200)
}
