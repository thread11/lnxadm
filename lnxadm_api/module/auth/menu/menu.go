package menu

import (
	"database/sql"
	"log"
	"net/http"
	"strings"

	"lnxadm/global"
	"lnxadm/util"
)

func AddMenu(response http.ResponseWriter, request *http.Request) {
	var err error

	var code string
	var name string
	var is_virtual string
	var remark string
	var parent_menu_id string

	code = util.FormValueOf(request, "code")
	name = util.FormValueOf(request, "name")
	is_virtual = util.FormValueOf(request, "is_virtual")
	remark = util.FormValueOf(request, "remark")
	parent_menu_id = util.FormValueOf(request, "parent_menu_id")

	if util.IsNotSet(code, name, is_virtual) || util.IsNotInt(is_virtual, parent_menu_id) {
		util.Api(response, 400)
		return
	}

	var sort int64
	var remark2 interface{}
	var create_time string
	var update_time string

	sort = 0
	remark2 = util.ParseNil(remark)
	create_time = util.TimeNow()
	update_time = create_time

	var parent_menu_id2 interface{}
	parent_menu_id2 = util.ParseNil(parent_menu_id)

	{
		var query string
		query = `
			INSERT INTO auth_menu (
				code, name, is_virtual, sort, remark, create_time, update_time,
				parent_menu_id
			)
			VALUES (?,?,?,?,?,?,?,?)
		`
		_, err = global.DB.Exec(
			query,
			code, name, is_virtual, sort, remark2, create_time, update_time,
			parent_menu_id2,
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

func DeleteMenu(response http.ResponseWriter, request *http.Request) {
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
		query = "DELETE FROM auth_menu WHERE id=?"
		_, err = tx.Exec(query, id)
		util.Throw(err)
	}

	{
		var query string
		query = "UPDATE auth_perm SET menu_id=NULL, update_time=? WHERE menu_id=?"
		_, err = tx.Exec(query, update_time, id)
		util.Throw(err)
	}

	{
		var query string
		query = "UPDATE auth_menu SET parent_menu_id=NULL, update_time=? WHERE parent_menu_id=?"
		_, err = tx.Exec(query, update_time, id)
		util.Throw(err)
	}

	tx.Commit()

	util.Api(response, 200)
}

func GetMenu(response http.ResponseWriter, request *http.Request) {
	var err error

	var id string
	id = util.FormValueOf(request, "id")

	if util.IsNotSet(id) || util.IsNotInt(id) {
		util.Api(response, 400)
		return
	}

	var parent_menu_ids map[int64]bool
	parent_menu_ids = make(map[int64]bool)

	{
		var query string
		query = `
			SELECT parent_menu_id, COUNT(1) count
			FROM auth_menu
			WHERE parent_menu_id IS NOT NULL
			GROUP BY parent_menu_id
		`

		var rows *sql.Rows
		rows, err = global.DB.Query(query)
		defer rows.Close()
		util.Throw(err)

		var parent_menu_id sql.NullInt64
		var count int64

		for rows.Next() {
			err = rows.Scan(&parent_menu_id, &count)
			util.Throw(err)

			if parent_menu_id.Valid {
				parent_menu_ids[parent_menu_id.Int64] = true
			} else {
				// there is dirty data
			}
		}
	}

	var menu map[string]interface{}
	menu = make(map[string]interface{})

	{
		var query string
		query = `
			SELECT
				id, code, name, is_virtual, sort, remark, create_time, update_time,
				parent_menu_id
			FROM auth_menu WHERE id=?
		`

		var row *sql.Row
		row = global.DB.QueryRow(query, id)

		var id2 int64
		var code string
		var name string
		var is_virtual int64
		var sort sql.NullInt64
		var remark sql.NullString
		var create_time sql.NullString
		var update_time sql.NullString
		var parent_menu_id sql.NullInt64

		err = row.Scan(
			&id2, &code, &name, &is_virtual, &sort, &remark, &create_time, &update_time,
			&parent_menu_id,
		)
		util.Throw(err)

		var remark2 interface{}
		if remark.Valid {
			remark2 = remark.String
		}

		var parent_menu_id2 interface{}
		if parent_menu_id.Valid {
			parent_menu_id2 = parent_menu_id.Int64
		}

		var has_children bool
		if parent_menu_ids[id2] {
			has_children = true
		} else {
			has_children = false
		}

		menu = map[string]interface{}{
			"id":             id2,
			"code":           code,
			"name":           name,
			"is_virtual":     is_virtual,
			"sort":           sort,
			"remark":         remark2,
			"create_time":    util.TimeOf(create_time.String),
			"update_time":    util.TimeOf(update_time.String),
			"parent_menu_id": parent_menu_id2,
			"has_children":   has_children,
		}
	}

	util.Api(response, 200, menu)
}

func GetMenus(response http.ResponseWriter, request *http.Request) {
	var err error
	var ok bool

	var tree_view string
	tree_view = util.FormValueOf(request, "tree_view")

	var menus []map[string]interface{}
	menus = make([]map[string]interface{}, 0)

	{
		var query string
		query = `
			SELECT id, code, name, is_virtual, sort, remark, parent_menu_id
			FROM auth_menu
			ORDER BY sort, code
		`

		var rows *sql.Rows
		rows, err = global.DB.Query(query)
		defer rows.Close()
		util.Throw(err)

		for rows.Next() {
			var id int64
			var code string
			var name string
			var sort sql.NullInt64
			var is_virtual int64
			var remark sql.NullString
			var parent_menu_id sql.NullInt64

			err = rows.Scan(&id, &code, &name, &is_virtual, &sort, &remark, &parent_menu_id)
			util.Throw(err)

			var remark2 interface{}
			if remark.Valid {
				remark2 = remark.String
			}

			menus = append(
				menus,
				map[string]interface{}{
					"id":             id,
					"code":           code,
					"name":           name,
					"sort":           sort.Int64,
					"is_virtual":     is_virtual,
					"remark":         remark2,
					"parent_menu_id": parent_menu_id.Int64,
				},
			)
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
			if parent_menu_id != 0 {
				menus2[parent_menu_id] = append(menus2[parent_menu_id], menu)
			}
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
				if tree_view == "1" {
					if len(menus2[id]) == 0 {
						menu["children"] = []map[string]interface{}{}
					} else {
						menu["children"] = menus2[id]
					}
					menus3 = append(menus3, menu)
				} else {
					menus3 = append(menus3, menu)
					menus3 = append(menus3, menus2[id]...)
				}
			}
		}
	}

	util.Api(response, 200, menus3)
}

func GetParentMenus(response http.ResponseWriter, request *http.Request) {
	var err error

	var parent_menus []map[string]interface{}
	parent_menus = make([]map[string]interface{}, 0)

	{
		var query string
		query = "SELECT id, code, name FROM auth_menu WHERE parent_menu_id IS NULL ORDER BY code"

		var rows *sql.Rows
		rows, err = global.DB.Query(query)
		util.Throw(err)
		defer rows.Close()

		var id int64
		var code string
		var name string

		for rows.Next() {
			err = rows.Scan(&id, &code, &name)
			if err != nil {
				log.Println(err)
				break
			}

			parent_menus = append(
				parent_menus,
				map[string]interface{}{
					"id":   id,
					"code": code,
					"name": name,
				},
			)
		}
	}

	util.Api(response, 200, parent_menus)
}

func SortMenu(response http.ResponseWriter, request *http.Request) {
	var err error

	var id_sorts string
	id_sorts = util.FormValueOf(request, "id_sorts")

	if util.IsNotSet(id_sorts) {
		util.Api(response, 400)
		return
	}

	var update_time string
	update_time = util.TimeNow()

	var id_sorts2 []string
	id_sorts2 = strings.Split(id_sorts, ",")

	var tx *sql.Tx
	tx, err = global.DB.Begin()
	defer tx.Rollback()
	util.Throw(err)

	{

		var id_sort string
		for _, id_sort = range id_sorts2 {
			var fields []string
			fields = strings.Split(id_sort, "_")

			var id string
			var sort string

			id = fields[0]
			sort = fields[1]

			var query string
			query = "UPDATE auth_menu SET sort=?, update_time=? WHERE id=?"
			_, err = tx.Exec(query, sort, update_time, id)
			util.Throw(err)
		}
	}

	tx.Commit()

	util.Api(response, 200)
}

func UpdateMenu(response http.ResponseWriter, request *http.Request) {
	var err error

	var id string
	var code string
	var name string
	var is_virtual string
	var remark string
	var parent_menu_id string

	id = util.FormValueOf(request, "id")
	code = util.FormValueOf(request, "code")
	name = util.FormValueOf(request, "name")
	is_virtual = util.FormValueOf(request, "is_virtual")
	remark = util.FormValueOf(request, "remark")
	parent_menu_id = util.FormValueOf(request, "parent_menu_id")

	if util.IsNotSet(id, code, name, is_virtual) ||
		util.IsNotInt(id, is_virtual, parent_menu_id) {
		util.Api(response, 400)
		return
	}

	var remark2 interface{}
	var parent_menu_id2 interface{}
	var update_time string

	remark2 = util.ParseNil(remark)
	parent_menu_id2 = util.ParseNil(parent_menu_id)
	update_time = util.TimeNow()

	var has_children bool

	{
		var query string
		query = "SELECT COUNT(1) count FROM auth_menu WHERE parent_menu_id=?"

		var row *sql.Row
		row = global.DB.QueryRow(query, id)

		var count int64
		err = row.Scan(&count)
		util.Throw(err)

		if count > 0 {
			has_children = true
		}
	}

	var query string
	if id == parent_menu_id || has_children {
		query = `
			UPDATE auth_menu
			SET code=?, name=?, is_virtual=?, remark=?, update_time=?
			WHERE id=?
		`
		_, err = global.DB.Exec(
			query,
			code, name, is_virtual, remark2, update_time,
			id,
		)
		util.Throw(err)
	} else {
		query = `
			UPDATE auth_menu
			SET code=?, name=?, is_virtual=?, remark=?, update_time=?, parent_menu_id=?
			WHERE id=?
		`
		_, err = global.DB.Exec(
			query,
			code, name, is_virtual, remark2, update_time, parent_menu_id2,
			id,
		)
		util.Throw(err)
	}

	util.Api(response, 200)
}
