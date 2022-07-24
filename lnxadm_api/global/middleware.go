package global

import (
	"log"
	"net/http"
	"time"

	"github.com/gorilla/sessions"

	"lnxadm/util"
)

func MakeHandler(next func(http.ResponseWriter, *http.Request)) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		defer util.TimeTaken(time.Now(), r.URL.Path)

		var err error

		// time.Sleep(3 * time.Second)

		var user_id interface{}
		var is_admin interface{}
		var perms interface{}

		var session *sessions.Session
		session, err = STORE.Get(r, "whatever")
		util.Throw(err)
		user_id = session.Values["id"]
		is_admin = session.Values["is_admin"]
		perms = session.Values["perms"]

		go RecordRequest(r, user_id)

		var path string
		path = r.URL.Path

		// if util.Contains(WHITELIST, path) || true {
		if util.Contains(WHITELIST, path) {
			next(w, r)
		} else {
			if user_id == nil {
				util.Api(w, 401)
				return
			}

			if is_admin == 0 {
				if !util.Contains(perms.([]string), path) {
					util.Api(w, 403)
					return
				} else {
					next(w, r)
				}
			} else {
				next(w, r)
			}
		}
		log.Println(w)
	}
}
