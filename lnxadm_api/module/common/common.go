package common

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"strings"

	"github.com/gorilla/sessions"

	"lnxadm/global"
	auth_user_service "lnxadm/module/auth/user/service"
	"lnxadm/util"
)

func ChangePassword(response http.ResponseWriter, request *http.Request) {
	var err error

	var old_password string
	var new_password string

	old_password = util.FormValueOf(request, "old_password")
	new_password = util.FormValueOf(request, "new_password")

	if util.IsNotSet(old_password, new_password) {
		util.Api(response, 400)
		return
	}

	var session *sessions.Session
	session, err = global.STORE.Get(request, "whatever")
	util.Throw(err)

	var username interface{}
	username = session.Values["username"]

	var password string
	var salt string

	{
		var query string
		query = "SELECT password, salt FROM auth_user WHERE username=?"

		var row *sql.Row
		row = global.DB.QueryRow(query, username)
		err = row.Scan(&password, &salt)
		util.Throw(err)
	}

	var old_password2 string
	old_password2 = auth_user_service.EncryptPassword(old_password, salt)
	if old_password2 != password {
		util.Api(response, 422)
		return
	}

	var salt2 string
	salt2 = auth_user_service.GenerateSalt(8)

	var new_password2 string
	new_password2 = auth_user_service.EncryptPassword(new_password, salt2)

	var update_time string
	update_time = util.TimeNow()

	{
		var query string
		query = `
			UPDATE auth_user
			SET password=?, salt=?, update_time=?
			WHERE username=? AND password=?
		`

		var result sql.Result
		result, err = global.DB.Exec(
			query,
			new_password2, salt2, update_time,
			username, old_password2,
		)
		util.Throw(err)

		var rows_affected int64
		rows_affected, err = result.RowsAffected()
		util.Throw(err)

		if rows_affected != 1 {
			log.Println(rows_affected)
			panic("Changed failed")
		}
	}

	util.Api(response, 200)
}

func GetCurrentUser(response http.ResponseWriter, request *http.Request) {
	var err error

	var session *sessions.Session
	session, err = global.STORE.Get(request, "whatever")
	util.Throw(err)

	var username interface{}
	username = session.Values["username"]

	var user map[string]interface{}
	user = make(map[string]interface{})

	{
		var query string
		query = `
			SELECT
				id, username, nickname, email, is_admin,
				remark, create_time, update_time, dept_id
			FROM auth_user
			WHERE username=?
		`

		var row *sql.Row
		row = global.DB.QueryRow(query, username)

		var id int64
		var username2 string
		var nickname string
		var email sql.NullString
		var is_admin int
		var remark sql.NullString
		var create_time sql.NullString
		var update_time sql.NullString
		var dept_id sql.NullInt64

		err = row.Scan(
			&id, &username2, &nickname, &email, &is_admin,
			&remark, &create_time, &update_time, &dept_id,
		)
		util.Throw(err)

		var remark2 interface{}
		if remark.Valid {
			remark2 = remark.String
		} else {
			remark2 = nil
		}

		user = map[string]interface{}{
			"id":          id,
			"username":    username2,
			"nickname":    nickname,
			"email":       email.String,
			"is_admin":    is_admin,
			"remark":      remark2,
			"create_time": util.TimeOf(create_time.String),
			"update_time": util.TimeOf(update_time.String),
		}
	}

	util.Api(response, 200, user)
}

func GetMenus(response http.ResponseWriter, request *http.Request) {
	var err error
	var ok bool

	var session *sessions.Session
	session, err = global.STORE.Get(request, "whatever")
	util.Throw(err)

	var user_id interface{}
	user_id = session.Values["id"]
	if user_id == nil {
		panic("Invalid session or token")
	}

	var menus []map[string]interface{}
	menus = make([]map[string]interface{}, 0)

	var parent_menu_ids []interface{}
	parent_menu_ids = make([]interface{}, 0)

	{
		var query string
		query = `
			SELECT id, code, name, parent_menu_id FROM auth_menu
			WHERE id IN (
				SELECT menu_id FROM auth_perm WHERE id IN (
					SELECT perm_id FROM auth_user_perm WHERE user_id=?
					UNION
					SELECT perm_id FROM auth_role_perm WHERE role_id IN (
						SELECT role_id FROM auth_user_role WHERE user_id=?
					)
				)
			)
			ORDER BY sort, code
		`

		var rows *sql.Rows
		rows, err = global.DB.Query(query, user_id, user_id)
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

			parent_menu_ids = append(parent_menu_ids, parent_menu_id.Int64)
		}
	}

	var menus2 []map[string]interface{}
	menus2 = make([]map[string]interface{}, 0)

	{
		var question_marks string
		if len(parent_menu_ids) > 0 {
			question_marks = strings.Repeat("?,", len(parent_menu_ids))
			question_marks = strings.TrimSuffix(question_marks, ",")
		}

		var query string
		query = `
			SELECT id, code, name, parent_menu_id
			FROM auth_menu
			WHERE id IN (%s)
			ORDER BY sort, code
		`
		query = fmt.Sprintf(query, question_marks)
		log.Println(query)

		var rows *sql.Rows
		rows, err = global.DB.Query(query, parent_menu_ids...)
		defer rows.Close()
		util.Throw(err)

		for rows.Next() {
			var id int64
			var code string
			var name string
			var parent_menu_id sql.NullInt64

			err = rows.Scan(&id, &code, &name, &parent_menu_id)
			util.Throw(err)

			menus2 = append(
				menus2,
				map[string]interface{}{
					"id":             id,
					"code":           code,
					"name":           name,
					"parent_menu_id": parent_menu_id.Int64,
				},
			)
		}
	}

	var menus3 map[int64][]map[string]interface{}
	menus3 = make(map[int64][]map[string]interface{})

	{
		var menu map[string]interface{}
		for _, menu = range menus {
			var parent_menu_id int64
			parent_menu_id, ok = menu["parent_menu_id"].(int64)
			util.Ensure(ok)
			menus3[parent_menu_id] = append(menus3[parent_menu_id], menu)
		}
	}

	var menus4 []map[string]interface{}
	menus4 = make([]map[string]interface{}, 0)

	{
		var menu map[string]interface{}
		for _, menu = range menus2 {
			var id int64
			id, ok = menu["id"].(int64)
			util.Ensure(ok)
			menu["children"] = menus3[id]
			menus4 = append(menus4, menu)
		}
	}

	util.Api(response, 200, menus4)
}

func GetPermCodes(response http.ResponseWriter, request *http.Request) {
	var err error

	var session *sessions.Session
	session, err = global.STORE.Get(request, "whatever")
	util.Throw(err)

	var user_id interface{}
	user_id = session.Values["id"]
	if user_id == nil {
		panic("Invalid session or token")
	}

	var perm_codes []string
	perm_codes = auth_user_service.GetPermCodes(int64(user_id.(int)))

	util.Api(response, 200, perm_codes)
}

func GetPerms(response http.ResponseWriter, request *http.Request) {
	var err error

	var session *sessions.Session
	session, err = global.STORE.Get(request, "whatever")
	util.Throw(err)

	var user_id interface{}
	user_id = session.Values["id"]
	if user_id == nil {
		panic("Invalid session or token")
	}

	var perms []map[string]interface{}
	perms = make([]map[string]interface{}, 0)

	{
		var query string
		query = `
			SELECT id, code, name FROM auth_perm WHERE id IN (
				SELECT perm_id FROM auth_user_perm WHERE user_id=?
				UNION
				SELECT perm_id FROM auth_role_perm WHERE role_id IN (
					SELECT role_id FROM auth_user_role WHERE user_id=?
				)
			)
		`

		var rows *sql.Rows
		rows, err = global.DB.Query(query, user_id, user_id)
		defer rows.Close()
		util.Throw(err)

		for rows.Next() {
			var id string
			var code string
			var name string

			err = rows.Scan(&id, &code, &name)
			util.Throw(err)

			perms = append(
				perms,
				map[string]interface{}{
					"id":   id,
					"code": code,
					"name": name,
				},
			)
		}
	}

	util.Api(response, 200, perms)
}

func Login(response http.ResponseWriter, request *http.Request) {
	var err error

	var username string
	var password string

	username = util.FormValueOf(request, "username")
	password = util.FormValueOf(request, "password")

	if util.IsNotSet(username, password) {
		util.Api(response, 400)
		return
	}

	var id int64
	var password2 string
	var nickname string
	var email sql.NullString
	var is_admin int64
	var salt string
	var remark sql.NullString

	{
		var query string
		query = `
			SELECT id, password, nickname, email, is_admin, salt, remark
			FROM auth_user
			WHERE username=? AND is_active=1 AND is_deleted=0
		`

		var row *sql.Row
		row = global.DB.QueryRow(query, username)
		err = row.Scan(&id, &password2, &nickname, &email, &is_admin, &salt, &remark)

		if err != nil {
			log.Println(err)
			if err == sql.ErrNoRows {
				util.Api(response, 422)
				return
			} else {
				util.Throw(err)
			}
		}
	}

	var password3 string
	password3 = auth_user_service.EncryptPassword(password, salt)
	if password3 != password2 {
		util.Api(response, 422)
		return
	}

	go func() {
		var login_time string
		login_time = util.TimeNow()

		var query string
		query = "UPDATE auth_user SET login_time=? WHERE id=?"

		_, err = global.DB.Exec(query, login_time, id)
		util.Skip(err)
	}()

	var perms []string
	perms = auth_user_service.GetPermCodes(id)

	var session *sessions.Session
	session, err = global.STORE.Get(request, "whatever")
	util.Throw(err)
	session.Values["id"] = id
	session.Values["username"] = username
	session.Values["is_admin"] = is_admin
	session.Values["perms"] = perms
	err = session.Save(request, response)
	if err != nil {
		log.Fatal(err)
		panic("Can not set a session")
	}

	var user map[string]interface{}
	user = make(map[string]interface{})
	user["id"] = id
	user["username"] = username
	user["nickname"] = nickname
	user["email"] = email.String
	user["is_admin"] = is_admin
	user["remark"] = remark.String

	util.Api(response, 200, user)
}

func Logout(response http.ResponseWriter, request *http.Request) {
	var err error

	var session *sessions.Session
	session, err = global.STORE.Get(request, "whatever")
	util.Throw(err)
	session.Options.MaxAge = -1
	err = session.Save(request, response)
	if err != nil {
		log.Println(err)
		log.Println("Can not delete a session")
	}

	util.Api(response, 200)
}

func UpdateProfile(response http.ResponseWriter, request *http.Request) {
	var err error

	var nickname string
	var email string
	nickname = util.FormValueOf(request, "nickname")
	email = util.FormValueOf(request, "email")

	if util.IsNotSet(nickname, email) {
		util.Api(response, 400)
		return
	}

	var session *sessions.Session
	session, err = global.STORE.Get(request, "whatever")
	util.Throw(err)

	var username interface{}
	username = session.Values["username"]

	var update_time string
	update_time = util.TimeNow()

	{
		var query string
		query = `
			UPDATE auth_user
			SET nickname=?, email=?, update_time=?
			WHERE username=?
		`
		_, err = global.DB.Exec(
			query,
			nickname, email, update_time,
			username,
		)
		util.Throw(err)
	}

	util.Api(response, 200)
}
