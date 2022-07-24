package user

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"strings"

	"lnxadm/global"
	auth_common_service "lnxadm/module/auth/common/service"
	auth_user_service "lnxadm/module/auth/user/service"
	"lnxadm/util"
)

func AddUser(response http.ResponseWriter, request *http.Request) {
	var err error

	var username string
	var password string
	var nickname string
	var email string
	var phone string
	var is_admin string
	var remark string
	var dept_id string

	username = util.FormValueOf(request, "username")
	password = util.FormValueOf(request, "password")
	nickname = util.FormValueOf(request, "nickname")
	email = util.FormValueOf(request, "email")
	phone = util.FormValueOf(request, "phone")
	is_admin = util.FormValueOf(request, "is_admin")
	remark = util.FormValueOf(request, "remark")
	dept_id = util.FormValueOf(request, "dept_id")

	if util.IsNotSet(username, password, nickname, is_admin) ||
		util.IsNotInt(is_admin, dept_id) {
		util.Api(response, 400)
		return
	}

	var email2 interface{}
	var phone2 interface{}
	var remark2 interface{}
	var dept_id2 interface{}

	email2 = util.ParseNil(email)
	phone2 = util.ParseNil(phone)
	remark2 = util.ParseNil(remark)
	dept_id2 = util.ParseNil(dept_id)

	var salt string
	salt = auth_user_service.GenerateSalt(8)

	var password2 string
	password2 = auth_user_service.EncryptPassword(password, salt)

	var is_staff int64
	var is_active int64
	var is_deleted int64

	is_staff = 1
	is_active = 1
	is_deleted = 0

	var create_time string
	var update_time string

	create_time = util.TimeNow()
	update_time = create_time

	{
		var query string
		query = `
			INSERT INTO auth_user (
				username, password, nickname, email, phone, is_admin,
				is_staff, is_active, salt,
				is_deleted, remark, create_time, update_time,
				dept_id
			)
			VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)
		`
		_, err = global.DB.Exec(
			query,
			username, password2, nickname, email2, phone2, is_admin,
			is_staff, is_active, salt,
			is_deleted, remark2, create_time, update_time,
			dept_id2,
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

func AssignRole(response http.ResponseWriter, request *http.Request) {
	var err error

	var user_id string
	var role_ids string

	user_id = util.FormValueOf(request, "user_id")
	role_ids = util.FormValueOf(request, "role_ids")

	if util.IsNotSet(user_id) || util.IsNotInt(user_id) {
		util.Api(response, 400)
		return
	}

	var role_ids2 []string
	role_ids2 = strings.Split(role_ids, ",")

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
		query = "DELETE FROM auth_user_role WHERE user_id=?"
		_, err = tx.Exec(query, user_id)
		util.Throw(err)
	}

	{
		var query string
		query = `
			INSERT INTO auth_user_role (user_id, role_id, create_time, update_time)
			VALUES (?,?,?,?)
		`

		var role_id string
		for _, role_id = range role_ids2 {
			if util.IsNotSet(role_id) || util.IsNotInt(role_id) {
				continue
			}

			_, err = tx.Exec(query, user_id, role_id, create_time, update_time)
			util.Throw(err)
		}
	}

	tx.Commit()

	util.Api(response, 200)
}

func DeleteUser(response http.ResponseWriter, request *http.Request) {
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
		query = "UPDATE auth_user SET is_deleted=1 WHERE id=?"
		_, err = tx.Exec(query, id)
		util.Throw(err)
	}

	{
		var query string
		query = "DELETE FROM auth_user_role WHERE user_id=?"
		_, err = tx.Exec(query, id)
		util.Throw(err)
	}

	{
		var query string
		query = "DELETE FROM auth_user_perm WHERE user_id=?"
		_, err = tx.Exec(query, id)
		util.Throw(err)
	}

	tx.Commit()

	util.Api(response, 200)
}

func DisableUser(response http.ResponseWriter, request *http.Request) {
	var err error

	var id string
	id = util.FormValueOf(request, "id")

	if util.IsNotSet(id) || util.IsNotInt(id) {
		util.Api(response, 400)
		return
	}

	var update_time string
	update_time = util.TimeNow()

	var query string
	query = "UPDATE auth_user SET is_active=0, update_time=? WHERE id=?"
	_, err = global.DB.Exec(query, update_time, id)
	util.Throw(err)

	util.Api(response, 200)
}

func EnableUser(response http.ResponseWriter, request *http.Request) {
	var err error

	var id string
	id = util.FormValueOf(request, "id")

	if util.IsNotSet(id) || util.IsNotInt(id) {
		util.Api(response, 400)
		return
	}

	var update_time string
	update_time = util.TimeNow()

	var query string
	query = "UPDATE auth_user SET is_active=1, update_time=? WHERE id=?"
	_, err = global.DB.Exec(query, update_time, id)
	util.Throw(err)

	util.Api(response, 200)
}

func GetDepts(response http.ResponseWriter, request *http.Request) {
	var err error

	var depts []map[string]interface{}
	depts = make([]map[string]interface{}, 0)

	{
		var query string
		query = "SELECT id, name FROM auth_dept ORDER BY name"

		var rows *sql.Rows
		rows, err = global.DB.Query(query)
		defer rows.Close()
		util.Throw(err)

		for rows.Next() {
			var id int
			var name string

			err = rows.Scan(&id, &name)
			util.Throw(err)

			depts = append(
				depts,
				map[string]interface{}{
					"id":   id,
					"name": name,
				},
			)
		}
	}

	util.Api(response, 200, depts)
}

func GetRoles(response http.ResponseWriter, request *http.Request) {
	var err error

	var id string
	id = util.FormValueOf(request, "id")

	if util.IsNotSet(id) || util.IsNotInt(id) {
		util.Api(response, 400)
		return
	}

	var role_ids []int64
	role_ids = make([]int64, 0)

	{
		var query string
		query = "SELECT role_id FROM auth_user_role WHERE user_id=?"

		var rows *sql.Rows
		rows, err = global.DB.Query(query, id)
		defer rows.Close()
		util.Throw(err)

		for rows.Next() {
			var role_id int64
			err = rows.Scan(&role_id)
			util.Throw(err)

			role_ids = append(role_ids, role_id)
		}
	}

	var roles []map[string]interface{}
	roles = make([]map[string]interface{}, 0)

	{
		var query string
		query = "SELECT id, name FROM auth_role ORDER BY name"

		var rows *sql.Rows
		rows, err = global.DB.Query(query)
		defer rows.Close()
		util.Throw(err)

		for rows.Next() {
			var id int
			var name string

			err = rows.Scan(&id, &name)
			util.Throw(err)

			roles = append(
				roles,
				map[string]interface{}{
					"id":   id,
					"name": name,
				},
			)
		}
	}

	var extras map[string]interface{}
	extras = map[string]interface{}{
		"role_ids":     role_ids,
		"checked_keys": role_ids,
	}

	util.Api(response, 200, roles, extras)
}

func GetUser(response http.ResponseWriter, request *http.Request) {
	var err error

	var id string
	id = util.FormValueOf(request, "id")

	if util.IsNotSet(id) || util.IsNotInt(id) {
		util.Api(response, 400)
		return
	}

	var user map[string]interface{}
	user = make(map[string]interface{})

	{
		var query string
		query = `
			SELECT
				id, username, nickname, email, phone, is_admin,
				remark, create_time, update_time, dept_id
			FROM auth_user
			WHERE id=?
		`

		var row *sql.Row
		row = global.DB.QueryRow(query, id)

		var id2 int64
		var username string
		var nickname string
		var email sql.NullString
		var phone sql.NullString
		var is_admin int
		var remark sql.NullString
		var create_time sql.NullString
		var update_time sql.NullString
		var dept_id sql.NullInt64

		err = row.Scan(
			&id2, &username, &nickname, &email, &phone, &is_admin,
			&remark, &create_time, &update_time, &dept_id,
		)
		util.Throw(err)

		var email2 interface{}
		if remark.Valid {
			email2 = email.String
		}

		var phone2 interface{}
		if phone.Valid {
			phone2 = phone.String
		}

		var remark2 interface{}
		if remark.Valid {
			remark2 = remark.String
		}

		var dept_id2 interface{}
		if dept_id.Valid {
			dept_id2 = dept_id.Int64
		}

		user = map[string]interface{}{
			"id":          id2,
			"username":    username,
			"nickname":    nickname,
			"email":       email2,
			"phone":       phone2,
			"is_admin":    is_admin,
			"remark":      remark2,
			"create_time": util.TimeOf(create_time.String),
			"update_time": util.TimeOf(update_time.String),
			"dept_id":     dept_id2,
		}
	}

	util.Api(response, 200, user)
}

func GetUsers(response http.ResponseWriter, request *http.Request) {
	var err error

	var user_id_dept_name map[int]string
	user_id_dept_name = make(map[int]string)

	{
		var query string
		query = `
			SELECT user.id, dept.name
			FROM auth_user user
			JOIN auth_dept dept ON user.dept_id=dept.id
		`

		var rows *sql.Rows
		rows, err = global.DB.Query(query)
		defer rows.Close()
		util.Throw(err)

		for rows.Next() {
			var id int
			var name string

			err = rows.Scan(&id, &name)
			util.Throw(err)

			user_id_dept_name[id] = name
		}
	}

	var user_id_role_names map[int][]string
	user_id_role_names = make(map[int][]string)

	{
		var query string
		query = `
			SELECT user_role.user_id, role.name
			FROM auth_user_role user_role
			JOIN auth_role role ON user_role.role_id=role.id
		`

		var rows *sql.Rows
		rows, err = global.DB.Query(query)
		defer rows.Close()
		util.Throw(err)

		for rows.Next() {
			var user_id int
			var name string

			err = rows.Scan(&user_id, &name)
			util.Throw(err)

			if user_id_role_names[user_id] == nil {
				user_id_role_names[user_id] = []string{}
			}
			user_id_role_names[user_id] = append(user_id_role_names[user_id], name)
		}
	}

	var users []map[string]interface{}
	users = make([]map[string]interface{}, 0)

	{
		var query string
		query = `
			SELECT id, username, nickname, email, phone, is_admin, is_active, remark
			FROM auth_user
			WHERE is_deleted=0
			ORDER BY username
		`

		var rows *sql.Rows
		rows, err = global.DB.Query(query)
		defer rows.Close()
		util.Throw(err)

		for rows.Next() {
			var id int
			var username string
			var nickname string
			var email sql.NullString
			var phone sql.NullString
			var is_admin int
			var is_active int
			var remark sql.NullString

			err = rows.Scan(&id, &username, &nickname, &email, &phone, &is_admin, &is_active, &remark)
			util.Throw(err)

			var email2 interface{}
			if remark.Valid {
				email2 = email.String
			}

			var phone2 interface{}
			if phone.Valid {
				phone2 = phone.String
			}

			var remark2 interface{}
			if remark.Valid {
				remark2 = remark.String
			}

			var dept_name string
			dept_name = user_id_dept_name[id]

			var role_names []string
			if user_id_role_names[id] != nil {
				role_names = user_id_role_names[id]
			} else {
				role_names = []string{}
			}

			users = append(
				users,
				map[string]interface{}{
					"id":         id,
					"username":   username,
					"nickname":   nickname,
					"email":      email2,
					"phone":      phone2,
					"is_admin":   is_admin,
					"is_active":  is_active,
					"remark":     remark2,
					"dept_name":  dept_name,
					"role_names": role_names,
				},
			)
		}
	}

	util.Api(response, 200, users)
}

func ResetPassword(response http.ResponseWriter, request *http.Request) {
	var err error

	var id string
	var password string

	id = util.FormValueOf(request, "id")
	password = util.FormValueOf(request, "password")

	if util.IsNotSet(id, password) || util.IsNotInt(id) {
		util.Api(response, 400)
		return
	}

	var salt string
	salt = auth_user_service.GenerateSalt(8)

	var password2 string
	password2 = auth_user_service.EncryptPassword(password, salt)

	var update_time string
	update_time = util.TimeNow()

	{
		var query string
		query = "UPDATE auth_user SET password=?, salt=?, update_time=? WHERE id=?"
		_, err = global.DB.Exec(query, password2, salt, update_time, id)
		util.Throw(err)
	}

	util.Api(response, 200)
}

func UpdateUser(response http.ResponseWriter, request *http.Request) {
	var err error

	var id string
	var username string
	var nickname string
	var email string
	var phone string
	var is_admin string
	var remark string
	var dept_id string

	id = util.FormValueOf(request, "id")
	username = util.FormValueOf(request, "username")
	nickname = util.FormValueOf(request, "nickname")
	email = util.FormValueOf(request, "email")
	phone = util.FormValueOf(request, "phone")
	is_admin = util.FormValueOf(request, "is_admin")
	remark = util.FormValueOf(request, "remark")
	dept_id = util.FormValueOf(request, "dept_id")

	if util.IsNotSet(id, username, nickname, is_admin) ||
		util.IsNotInt(id, is_admin, dept_id) {
		util.Api(response, 400)
		return
	}

	var email2 interface{}
	var phone2 interface{}
	var remark2 interface{}
	var dept_id2 interface{}

	email2 = util.ParseNil(email)
	phone2 = util.ParseNil(phone)
	remark2 = util.ParseNil(remark)
	dept_id2 = util.ParseNil(dept_id)

	var update_time string
	update_time = util.TimeNow()

	{
		var query string
		query = `
			UPDATE auth_user
			SET
				username=?, nickname=?, email=?, phone=?, is_admin=?,
				remark=?, update_time=?,
				dept_id=?
			WHERE id=?
		`
		_, err = global.DB.Exec(
			query,
			username, nickname, email2, phone2, is_admin,
			remark2, update_time,
			dept_id2,
			id,
		)
		util.Throw(err)
	}

	util.Api(response, 200)
}

func GetPerms(response http.ResponseWriter, request *http.Request) {
	var err error

	var user_id string
	user_id = util.FormValueOf(request, "user_id")

	if util.IsNotSet(user_id) || util.IsNotInt(user_id) {
		util.Api(response, 400)
		return
	}

	var perm_ids []int64
	perm_ids = make([]int64, 0)

	var checked_keys []string
	checked_keys = make([]string, 0)

	{
		var query string
		query = `
			SELECT perm_id FROM auth_user_perm WHERE user_id=?
			UNION
			SELECT perm_id FROM auth_role_perm WHERE role_id IN (
				SELECT role_id FROM auth_user_role WHERE user_id=?
			)
		`

		var rows *sql.Rows
		rows, err = global.DB.Query(query, user_id, user_id)
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

func GrantPerm(response http.ResponseWriter, request *http.Request) {
	var err error

	var user_id string
	var perm_ids string

	user_id = util.FormValueOf(request, "user_id")
	perm_ids = util.FormValueOf(request, "perm_ids")

	if util.IsNotSet(user_id) || util.IsNotInt(user_id) {
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
		query = "DELETE FROM auth_user_perm WHERE user_id=?"
		_, err = tx.Exec(query, user_id)
		util.Throw(err)
	}

	{
		var query string
		query = `
			INSERT INTO auth_user_perm (user_id, perm_id, create_time, update_time)
			VALUES (?,?,?,?)
		`

		var perm_id string
		for _, perm_id = range perm_ids2 {
			if util.IsNotSet(perm_id) || util.IsNotInt(perm_id) {
				continue
			}

			_, err = tx.Exec(query, user_id, perm_id, create_time, update_time)
			util.Throw(err)
		}
	}

	tx.Commit()

	util.Api(response, 200)
}
