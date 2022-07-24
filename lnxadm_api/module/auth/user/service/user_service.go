package service

import (
	"crypto/md5"
	"database/sql"
	"fmt"
	"math/rand"
	"time"

	"lnxadm/global"
	"lnxadm/util"
)

func EncryptPassword(password string, salt string) string {
	password = password + "|" + salt

	var password2 string
	password2 = fmt.Sprintf("%x", md5.Sum([]byte(password)))

	return password2
}

func GenerateSalt(size int64) string {
	const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

	rand.Seed(time.Now().UnixNano())

	var bytes []uint8
	bytes = make([]byte, size)

	var index int
	for index, _ = range bytes {
		bytes[index] = chars[rand.Intn(len(chars))]
	}

	var salt string
	salt = string(bytes)

	return salt
}

func GetPermCodes(user_id int64) []string {
	var err error

	var perm_codes []string

	{
		var query string
		query = `
			SELECT code FROM auth_perm WHERE id IN (
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
			var code string
			err = rows.Scan(&code)
			util.Throw(err)

			perm_codes = append(perm_codes, code)
		}
	}

	return perm_codes
}
