package perm

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"strings"

	"lnxadm/global"
	"lnxadm/util"
)

func AddPerm(response http.ResponseWriter, request *http.Request) {
	var err error

	var code string
	var name string
	var remark string
	var menu_id string

	code = util.FormValueOf(request, "code")
	name = util.FormValueOf(request, "name")
	remark = util.FormValueOf(request, "remark")
	menu_id = util.FormValueOf(request, "menu_id")

	if util.IsNotSet(code, name) || util.IsNotInt(menu_id) {
		util.Api(response, 400)
		return
	}

	var remark2 interface{}
	var menu_id2 interface{}

	remark2 = util.ParseNil(remark)
	menu_id2 = util.ParseNil(menu_id)

	var create_time string
	var update_time string

	create_time = util.TimeNow()
	update_time = create_time

	{
		var query string
		query = `
			INSERT INTO auth_perm (code, name, remark, create_time, update_time, menu_id)
			VALUES (?,?,?,?,?,?)
		`
		_, err = global.DB.Exec(query, code, name, remark2, create_time, update_time, menu_id2)
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

func DeletePerm(response http.ResponseWriter, request *http.Request) {
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
		query = "DELETE FROM auth_perm WHERE id=?"
		_, err = tx.Exec(query, id)
		util.Throw(err)
	}

	{
		var query string
		query = "DELETE FROM auth_role_perm WHERE perm_id=?"
		_, err = tx.Exec(query, id)
		util.Throw(err)
	}

	{
		var query string
		query = "DELETE FROM auth_user_perm WHERE perm_id=?"
		_, err = tx.Exec(query, id)
		util.Throw(err)
	}

	tx.Commit()

	util.Api(response, 200)
}

func GetMenus(response http.ResponseWriter, request *http.Request) {
	var err error
	var ok bool

	var menus []map[string]interface{}
	menus = make([]map[string]interface{}, 0)

	{
		var query string
		query = "SELECT id, code, name, parent_menu_id FROM auth_menu ORDER BY sort, code"

		var rows *sql.Rows
		rows, err = global.DB.Query(query)
		defer rows.Close()
		util.Throw(err)

		var id int64
		var code string
		var name string
		var parent_menu_id sql.NullInt64
		var is_parent bool

		for rows.Next() {
			is_parent = false

			err = rows.Scan(&id, &code, &name, &parent_menu_id)
			util.Throw(err)

			if !parent_menu_id.Valid {
				is_parent = true
			}

			menus = append(
				menus,
				map[string]interface{}{
					"id":             id,
					"code":           code,
					"name":           name,
					"parent_menu_id": parent_menu_id.Int64,
					"is_parent":      is_parent,
				},
			)
		}
	}

	var menu_id_names map[int64]string
	menu_id_names = make(map[int64]string)

	{
		var menu map[string]interface{}
		for _, menu = range menus {
			var id int64
			var name string

			id, ok = menu["id"].(int64)
			util.Ensure(ok)
			name, ok = menu["name"].(string)
			util.Ensure(ok)

			menu_id_names[id] = name
		}
	}

	var menus2 map[int64][]map[string]interface{}
	menus2 = make(map[int64][]map[string]interface{})

	{
		var menu map[string]interface{}
		for _, menu = range menus {
			var parent_menu_id int64
			parent_menu_id, ok = menu["parent_menu_id"].(int64)
			util.Ensure(ok)

			if parent_menu_id == 0 {
				menu["alias"] = menu["name"]
			} else {
				menu["alias"] = fmt.Sprintf("%s - %s", menu_id_names[parent_menu_id], menu["name"])
			}

			menus2[parent_menu_id] = append(menus2[parent_menu_id], menu)
		}
	}

	var menus3 []map[string]interface{}
	menus3 = make([]map[string]interface{}, 0)

	{
		var menu map[string]interface{}
		for _, menu = range menus {
			var id int64
			var parent_menu_id int64

			id, ok = menu["id"].(int64)
			util.Ensure(ok)
			parent_menu_id, ok = menu["parent_menu_id"].(int64)
			util.Ensure(ok)

			if parent_menu_id == 0 {
				menus3 = append(menus3, menu)
				menus3 = append(menus3, menus2[id]...)
			}
		}
	}

	util.Api(response, 200, menus3)
}

func GetPerm(response http.ResponseWriter, request *http.Request) {
	var err error

	var id string
	id = util.FormValueOf(request, "id")

	if util.IsNotSet(id) || util.IsNotInt(id) {
		util.Api(response, 400)
		return
	}

	var perm map[string]interface{}
	perm = make(map[string]interface{})

	{
		var query string
		query = `
			SELECT id, code, name, remark, create_time, update_time, menu_id
			FROM auth_perm
			WHERE id=?
		`

		var row *sql.Row
		row = global.DB.QueryRow(query, id)

		var id2 int64
		var code string
		var name string
		var remark sql.NullString
		var create_time sql.NullString
		var update_time sql.NullString
		var menu_id sql.NullInt64

		err = row.Scan(&id2, &code, &name, &remark, &create_time, &update_time, &menu_id)
		util.Throw(err)

		var remark2 interface{}
		if remark.Valid {
			remark2 = remark.String
		}

		var menu_id2 interface{}
		if menu_id.Valid {
			menu_id2 = menu_id.Int64
		}

		perm = map[string]interface{}{
			"id":          id2,
			"code":        code,
			"name":        name,
			"remark":      remark2,
			"create_time": util.TimeOf(create_time.String),
			"update_time": util.TimeOf(update_time.String),
			"menu_id":     menu_id2,
		}
	}

	util.Api(response, 200, perm)
}

func GetPerms(response http.ResponseWriter, request *http.Request) {
	var err error

	var menu_id string
	menu_id = util.FormValueOf(request, "menu_id")

	var menu_id2 interface{}
	menu_id2 = util.ParseNil(menu_id)

	var perms []map[string]interface{}
	perms = make([]map[string]interface{}, 0)

	{
		var query string
		query = `
			SELECT
				perm.id, perm.code, perm.name, perm.remark,
				menu.name AS menu_name
			FROM auth_perm perm
			LEFT JOIN auth_menu menu ON perm.menu_id=menu.id
			%s
			ORDER BY perm.code
		`

		var args []interface{}
		if menu_id2 == nil {
			query = fmt.Sprintf(query, "")
		} else {
			query = fmt.Sprintf(query, "WHERE perm.menu_id=?")
			args = append(args, menu_id2)
		}

		var rows *sql.Rows
		rows, err = global.DB.Query(query, args...)
		defer rows.Close()
		util.Throw(err)

		for rows.Next() {
			var id int
			var code string
			var name string
			var remark sql.NullString
			var menu_name sql.NullString

			err = rows.Scan(&id, &code, &name, &remark, &menu_name)
			util.Throw(err)

			var remark2 interface{}
			if remark.Valid {
				remark2 = remark.String
			} else {
				remark2 = nil
			}

			perms = append(
				perms,
				map[string]interface{}{
					"id":        id,
					"code":      code,
					"name":      name,
					"remark":    remark2,
					"menu_name": menu_name.String,
				},
			)
		}
	}

	util.Api(response, 200, perms)
}

func UpdatePerm(response http.ResponseWriter, request *http.Request) {
	var err error

	var id string
	var code string
	var name string
	var remark string
	var menu_id string

	id = util.FormValueOf(request, "id")
	code = util.FormValueOf(request, "code")
	name = util.FormValueOf(request, "name")
	remark = util.FormValueOf(request, "remark")
	menu_id = util.FormValueOf(request, "menu_id")

	if util.IsNotSet(id, code, name) || util.IsNotInt(id, menu_id) {
		util.Api(response, 400)
		return
	}

	var remark2 interface{}
	var menu_id2 interface{}

	remark2 = util.ParseNil(remark)
	menu_id2 = util.ParseNil(menu_id)

	var update_time string
	update_time = util.TimeNow()

	{
		var query string
		query = "UPDATE auth_perm SET code=?, name=?, remark=?, update_time=?, menu_id=? WHERE id=?"
		_, err = global.DB.Exec(query, code, name, remark2, update_time, menu_id2, id)
		util.Throw(err)
	}

	util.Api(response, 200)
}
