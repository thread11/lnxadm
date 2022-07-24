package perm

import (
	"database/sql"
	"net/http"

	"lnxadm/global"
	"lnxadm/util"
)

/*
DEPRECATED
*/
func GetMenuTree(response http.ResponseWriter, request *http.Request) {
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

		for rows.Next() {
			err = rows.Scan(&id, &code, &name, &parent_menu_id)
			util.Throw(err)

			menus = append(
				menus,
				map[string]interface{}{
					"id":             id,
					"code":           code,
					"name":           name,
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
				if menus2[id] == nil {
					menus2[id] = make([]map[string]interface{}, 0)
				}
				menu["children"] = menus2[id]
				menus3 = append(menus3, menu)
			}
		}
	}

	util.Api(response, 200, menus3)
}
