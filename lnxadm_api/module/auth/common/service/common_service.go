package service

import (
	"database/sql"
	"fmt"

	"lnxadm/global"
	"lnxadm/util"
)

func GetPermTree() map[string]interface{} {
	var err error
	var ok bool

	var perms []map[string]interface{}
	perms = make([]map[string]interface{}, 0)

	{
		var query string
		query = "SELECT id, code, name, menu_id FROM auth_perm ORDER BY code"

		var rows *sql.Rows
		rows, err = global.DB.Query(query)
		defer rows.Close()
		util.Throw(err)

		for rows.Next() {
			var id int
			var code string
			var name string
			var menu_id sql.NullInt64

			err = rows.Scan(&id, &code, &name, &menu_id)
			util.Throw(err)

			perms = append(
				perms,
				map[string]interface{}{
					"id":      id,
					"code":    code,
					"name":    name,
					"menu_id": menu_id.Int64,
					"key":     fmt.Sprintf("%d", id),
					"title":   name,
					"is_leaf": true,
				},
			)
		}
	}

	var menu_id_perms map[int64][]interface{}
	menu_id_perms = make(map[int64][]interface{})

	{
		var perm map[string]interface{}
		for _, perm = range perms {
			var menu_id int64
			menu_id, ok = perm["menu_id"].(int64)
			util.Ensure(ok)

			if menu_id != 0 {
				menu_id_perms[menu_id] = append(menu_id_perms[menu_id], perm)
			}
		}
	}

	var menus []map[string]interface{}
	menus = make([]map[string]interface{}, 0)

	{
		var query string
		query = "SELECT id, code, name, parent_menu_id FROM auth_menu ORDER BY sort, code"

		var rows *sql.Rows
		rows, err = global.DB.Query(query)
		defer rows.Close()
		util.Throw(err)

		for rows.Next() {
			var id int64
			var code string
			var name string
			var parent_menu_id sql.NullInt64

			err = rows.Scan(&id, &code, &name, &parent_menu_id)
			util.Throw(err)

			menus = append(
				menus,
				map[string]interface{}{
					"id":             id,
					"code":           code,
					"name":           name,
					"parent_menu_id": parent_menu_id.Int64,
					"key":            fmt.Sprintf("m%d", id),
					"title":          name,
				},
			)
		}
	}

	var menus2 map[int64][]map[string]interface{}
	menus2 = make(map[int64][]map[string]interface{})

	{
		var menu map[string]interface{}
		for _, menu = range menus {
			var id int64
			var parent_menu_id int64

			id, ok = menu["id"].(int64)
			util.Ensure(ok)
			parent_menu_id, ok = menu["parent_menu_id"].(int64)
			util.Ensure(ok)

			if parent_menu_id != 0 {
				if menu_id_perms[id] == nil {
					menu_id_perms[id] = make([]interface{}, 0)
				}
				menu["children"] = menu_id_perms[id]
				menus2[parent_menu_id] = append(menus2[parent_menu_id], menu)
			}
		}
	}

	var menus3 []map[string]interface{}
	menus3 = make([]map[string]interface{}, 0)

	var expanded_keys []string
	expanded_keys = make([]string, 0)

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
				if menus2[id] == nil {
					menus2[id] = make([]map[string]interface{}, 0)
				}
				menu["children"] = menus2[id]
				menus3 = append(menus3, menu)

				expanded_keys = append(expanded_keys, fmt.Sprintf("m%d", id))
			}
		}
	}

	var perm_tree map[string]interface{}
	perm_tree = map[string]interface{}{
		"perms":         menus3,
		"expanded_keys": expanded_keys,
	}

	return perm_tree
}
