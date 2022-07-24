package role

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"strings"

	"lnxadm/global"
	auth_common_service "lnxadm/module/auth/common/service"
	"lnxadm/util"
)

func AddRole(response http.ResponseWriter, request *http.Request) {
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
	update_time = util.TimeNow()

	{
		var query string
		query = "INSERT INTO auth_role (name, remark, create_time, update_time) VALUES (?,?,?,?)"
		_, err = global.DB.Exec(
			query,
			name, remark2, create_time, update_time,
		)
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

func DeleteRole(response http.ResponseWriter, request *http.Request) {
	var err error

	var id string
	id = util.FormValueOf(request, "id")

	if util.IsNotSet(id) || util.IsNotInt(id) {
		util.Api(response, 400)
		return
	}

	var tx *sql.Tx
	tx, err = global.DB.Begin()
	defer tx.Rollback()
	util.Throw(err)

	{
		var query string
		query = "DELETE FROM auth_role WHERE id=?"
		_, err = tx.Exec(query, id)
		util.Throw(err)
	}

	{
		var query string
		query = "DELETE FROM auth_role_perm WHERE role_id=?"
		_, err = tx.Exec(query, id)
		util.Throw(err)
	}

	{
		var query string
		query = "DELETE FROM auth_user_role WHERE role_id=?"
		_, err = tx.Exec(query, id)
		util.Throw(err)
	}

	tx.Commit()

	util.Api(response, 200)
}

func GetRole(response http.ResponseWriter, request *http.Request) {
	var err error

	var id string
	id = util.FormValueOf(request, "id")

	if util.IsNotSet(id) || util.IsNotInt(id) {
		util.Api(response, 400)
		return
	}

	var role map[string]interface{}
	role = make(map[string]interface{})

	{
		var query string
		query = "SELECT id, name, remark, create_time, update_time FROM auth_role WHERE id=?"

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

		role = map[string]interface{}{
			"id":          id2,
			"name":        name,
			"remark":      remark2,
			"create_time": util.TimeOf(create_time.String),
			"update_time": util.TimeOf(update_time.String),
		}
	}

	util.Api(response, 200, role)
}

func GetRoles(response http.ResponseWriter, request *http.Request) {
	var err error

	var roles []map[string]interface{}
	roles = make([]map[string]interface{}, 0)

	{
		var query string
		query = "SELECT id, name, remark FROM auth_role ORDER BY name"

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

			roles = append(
				roles,
				map[string]interface{}{
					"id":     id,
					"name":   name,
					"remark": remark2,
				},
			)
		}
	}

	util.Api(response, 200, roles)
}

func GrantPerm(response http.ResponseWriter, request *http.Request) {
	var err error

	var role_id string
	var perm_ids string

	role_id = util.FormValueOf(request, "role_id")
	perm_ids = util.FormValueOf(request, "perm_ids")

	if util.IsNotSet(role_id) || util.IsNotInt(role_id) {
		util.Api(response, 400)
		return
	}

	var perm_ids2 []string
	perm_ids2 = strings.Split(perm_ids, ",")

	var create_time string
	var update_time string

	create_time = util.TimeNow()
	update_time = create_time

	var tx *sql.Tx
	tx, err = global.DB.Begin()
	defer tx.Rollback()
	util.Throw(err)

	{
		var query string
		query = "DELETE FROM auth_role_perm WHERE role_id=?"
		_, err = tx.Exec(query, role_id)
		util.Throw(err)
	}

	{
		var query string
		query = `
			INSERT INTO auth_role_perm (role_id, perm_id, create_time, update_time)
			VALUES (?,?,?,?)
		`

		var perm_id string
		for _, perm_id = range perm_ids2 {
			if util.IsNotSet(perm_id) || util.IsNotInt(perm_id) {
				continue
			}

			_, err = tx.Exec(query, role_id, perm_id, create_time, update_time)
			util.Throw(err)
		}
	}

	tx.Commit()

	util.Api(response, 200)
}

func UpdateRole(response http.ResponseWriter, request *http.Request) {
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
		query = "UPDATE auth_role SET name=?, remark=?, update_time=? WHERE id=?"
		_, err = global.DB.Exec(query, name, remark2, update_time, id)
		util.Throw(err)
	}

	util.Api(response, 200)
}

func GetPerms(response http.ResponseWriter, request *http.Request) {
	var err error

	var role_id string
	role_id = util.FormValueOf(request, "role_id")

	if util.IsNotSet(role_id) || util.IsNotInt(role_id) {
		util.Api(response, 400)
		return
	}

	var perm_ids []int64
	perm_ids = make([]int64, 0)

	var checked_keys []string
	checked_keys = make([]string, 0)

	{
		var query string
		query = "SELECT perm_id FROM auth_role_perm WHERE role_id=?"

		var rows *sql.Rows
		rows, err = global.DB.Query(query, role_id)
		defer rows.Close()
		util.Throw(err)

		for rows.Next() {
			var perm_id int64
			err = rows.Scan(&perm_id)
			util.Throw(err)

			perm_ids = append(perm_ids, perm_id)

			checked_keys = append(checked_keys, fmt.Sprintf("%d", perm_id))
		}
	}

	var perm_tree map[string]interface{}
	perm_tree = auth_common_service.GetPermTree()

	var perms []map[string]interface{}
	perms = perm_tree["perms"].([]map[string]interface{})

	var extras map[string]interface{}
	extras = map[string]interface{}{
		"perm_ids":      perm_ids,
		"checked_keys":  checked_keys,
		"expanded_keys": perm_tree["expanded_keys"],
	}

	util.Api(response, 200, perms, extras)
}
