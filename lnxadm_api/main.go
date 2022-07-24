package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"

	"lnxadm/global"
	auth_dept "lnxadm/module/auth/dept"
	auth_menu "lnxadm/module/auth/menu"
	auth_perm "lnxadm/module/auth/perm"
	auth_role "lnxadm/module/auth/role"
	auth_user "lnxadm/module/auth/user"
	common "lnxadm/module/common"
	system_log "lnxadm/module/system/log"
	"lnxadm/util"
)

type Route struct {
	Path    string
	Handler func(http.ResponseWriter, *http.Request)
}

var Routes = []Route{
	Route{"/api/common/change_password", common.ChangePassword},
	Route{"/api/common/get_current_user", common.GetCurrentUser},
	Route{"/api/common/get_menus", common.GetMenus},
	Route{"/api/common/get_perm_codes", common.GetPermCodes},
	Route{"/api/common/get_perms", common.GetPerms},
	Route{"/api/common/login", common.Login},
	Route{"/api/common/logout", common.Logout},
	Route{"/api/common/update_profile", common.UpdateProfile},

	Route{"/api/auth/dept/add_dept", auth_dept.AddDept},
	Route{"/api/auth/dept/delete_dept", auth_dept.DeleteDept},
	Route{"/api/auth/dept/get_dept", auth_dept.GetDept},
	Route{"/api/auth/dept/get_depts", auth_dept.GetDepts},
	Route{"/api/auth/dept/update_dept", auth_dept.UpdateDept},

	Route{"/api/auth/user/add_user", auth_user.AddUser},
	Route{"/api/auth/user/assign_role", auth_user.AssignRole},
	Route{"/api/auth/user/delete_user", auth_user.DeleteUser},
	Route{"/api/auth/user/disable_user", auth_user.DisableUser},
	Route{"/api/auth/user/enable_user", auth_user.EnableUser},
	Route{"/api/auth/user/get_depts", auth_user.GetDepts},
	Route{"/api/auth/user/get_perms", auth_user.GetPerms},
	Route{"/api/auth/user/get_roles", auth_user.GetRoles},
	Route{"/api/auth/user/get_user", auth_user.GetUser},
	Route{"/api/auth/user/get_users", auth_user.GetUsers},
	Route{"/api/auth/user/grant_perm", auth_user.GrantPerm},
	Route{"/api/auth/user/reset_password", auth_user.ResetPassword},
	Route{"/api/auth/user/update_user", auth_user.UpdateUser},

	Route{"/api/auth/role/add_role", auth_role.AddRole},
	Route{"/api/auth/role/delete_role", auth_role.DeleteRole},
	Route{"/api/auth/role/get_perms", auth_role.GetPerms},
	Route{"/api/auth/role/get_role", auth_role.GetRole},
	Route{"/api/auth/role/get_roles", auth_role.GetRoles},
	Route{"/api/auth/role/grant_perm", auth_role.GrantPerm},
	Route{"/api/auth/role/update_role", auth_role.UpdateRole},

	Route{"/api/auth/perm/add_perm", auth_perm.AddPerm},
	Route{"/api/auth/perm/delete_perm", auth_perm.DeletePerm},
	Route{"/api/auth/perm/get_menus", auth_perm.GetMenus},
	Route{"/api/auth/perm/get_perm", auth_perm.GetPerm},
	Route{"/api/auth/perm/get_perms", auth_perm.GetPerms},
	Route{"/api/auth/perm/update_perm", auth_perm.UpdatePerm},

	Route{"/api/auth/menu/add_menu", auth_menu.AddMenu},
	Route{"/api/auth/menu/delete_menu", auth_menu.DeleteMenu},
	Route{"/api/auth/menu/get_menu", auth_menu.GetMenu},
	Route{"/api/auth/menu/get_menus", auth_menu.GetMenus},
	Route{"/api/auth/menu/get_parent_menus", auth_menu.GetParentMenus},
	Route{"/api/auth/menu/sort_menu", auth_menu.SortMenu},
	Route{"/api/auth/menu/update_menu", auth_menu.UpdateMenu},

	Route{"/api/system/log/get_log", system_log.GetLog},
	Route{"/api/system/log/get_logs", system_log.GetLogs},
}

func main() {
	defer global.DB.Close()

	var err error

	var logfile *os.File
	logfile, err = os.OpenFile("./log/lnxadm.log", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	defer logfile.Close()
	util.Throw(err)

	log.SetFlags(log.LstdFlags | log.Lshortfile)
	log.SetOutput(logfile)
	log.SetOutput(os.Stdout)

	var host string
	var port int
	var sqlite string
	var mysql string

	flag.StringVar(&host, "host", "0.0.0.0", "Host")
	flag.IntVar(&port, "port", 1234, "Port")
	flag.StringVar(&sqlite, "sqlite", "./data/lnxadm.db", "SQLite")
	flag.StringVar(&mysql, "mysql", "", "MySQL")

	flag.Parse()

	log.Printf("host: %v\n", host)
	log.Printf("port: %v\n", port)
	log.Printf("sqlite: %v\n", sqlite)
	log.Printf("mysql: %v\n", mysql)

	var address string
	// :1234, 0.0.0.0:1234, 127.0.0.1:1234
	address = fmt.Sprintf("%s:%d", host, port)
	log.Printf("address: %v\n", address)

	if mysql != "" {
		log.Println(mysql)
		global.InitDbWithMysql(mysql)
	} else {
		log.Println(sqlite)
		global.InitDbWithSqlite(sqlite)
	}

	global.Init()

	http.HandleFunc("/favicon.ico", global.MakeHandler(util.NotFound))

	var route Route
	for _, route = range Routes {
		http.HandleFunc(route.Path, global.MakeHandler(route.Handler))
	}

	var fileServerHandler http.Handler
	// fileServerHandler = http.FileServer(http.Dir("./"))
	// fileServerHandler = http.FileServer(http.Dir("./build/"))
	// fileServerHandler = http.FileServer(http.Dir("../frontend/build/"))
	fileServerHandler = http.FileServer(http.Dir("./html/"))
	// http.Handle("/", fileServerHandler)
	http.Handle("/", util.WrapHandler(fileServerHandler))
	// http.Handle("/", http.NotFoundHandler())
	// http.Handle("/build/", http.StripPrefix("/build/", fileServerHandler))

	fmt.Println(fmt.Sprintf("http://%s/", address))
	log.Println(fmt.Sprintf("http://%s/", address))
	// err = http.ListenAndServe(":1234", nil)
	err = http.ListenAndServe(address, nil)

	log.Fatal(err)
}
