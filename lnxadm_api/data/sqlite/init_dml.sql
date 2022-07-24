INSERT INTO auth_dept
(id, name)
VALUES
(1, "Development"),
(2, "Operations" );


INSERT INTO auth_user
(id, username, password, nickname, email, is_admin, is_staff, is_active, salt, is_deleted, dept_id)
VALUES
(1, "admin", "eda88570dad35bc024dfd5ab8ac23e56", "Admin", "admin@example.com", 1, 1, 1, "12345678", 0, 1),
(2, "guest", "b4258ca8ea34375760bd99375e75128e", "Guest", "guest@example"    , 0, 1, 1, "12345678", 0, 2);


INSERT INTO auth_role
(id, name)
VALUES
(1, "Administrator"),
(2, "Guest"        );


INSERT INTO auth_perm
(id, code, name, type, menu_id)
VALUES
(1 , "/api/auth/dept/add_dept"        , "Department - Add Department"   , 0, 2),
(2 , "/api/auth/dept/delete_dept"     , "Department - Delete Department", 0, 2),
(3 , "/api/auth/dept/get_dept"        , "Department - Get Department"   , 0, 2),
(4 , "/api/auth/dept/get_depts"       , "Department - Get Departments"  , 0, 2),
(5 , "/api/auth/dept/update_dept"     , "Department - Update Department", 0, 2),
(6 , "/api/auth/user/add_user"        , "User - Add User"               , 0, 3),
(7 , "/api/auth/user/assign_role"     , "User - Assign Role"            , 0, 3),
(8 , "/api/auth/user/delete_user"     , "User - Delete User"            , 0, 3),
(9 , "/api/auth/user/disable_user"    , "User - Disable User"           , 0, 3),
(10, "/api/auth/user/enable_user"     , "User - Enable User"            , 0, 3),
(11, "/api/auth/user/get_depts"       , "User - Get Departments"        , 0, 3),
(12, "/api/auth/user/get_perms"       , "User - Get Permissions"        , 0, 3),
(13, "/api/auth/user/get_roles"       , "User - Get Roles"              , 0, 3),
(14, "/api/auth/user/get_user"        , "User - Get User"               , 0, 3),
(15, "/api/auth/user/get_users"       , "User - Get Users"              , 0, 3),
(16, "/api/auth/user/grant_perm"      , "User - Grant Permission"       , 0, 3),
(17, "/api/auth/user/reset_password"  , "User - Reset Password"         , 0, 3),
(18, "/api/auth/user/update_user"     , "User - Update User"            , 0, 3),
(19, "/api/auth/role/add_role"        , "Role - Add Role"               , 0, 4),
(20, "/api/auth/role/delete_role"     , "Role - Delete Role"            , 0, 4),
(21, "/api/auth/role/get_perms"       , "Role - Get Permissions"        , 0, 4),
(22, "/api/auth/role/get_role"        , "Role - Get Role"               , 0, 4),
(23, "/api/auth/role/get_roles"       , "Role - Get Roles"              , 0, 4),
(24, "/api/auth/role/grant_perm"      , "Role - Grant Permission"       , 0, 4),
(25, "/api/auth/role/update_role"     , "Role - Update Role"            , 0, 4),
(26, "/api/auth/perm/add_perm"        , "Permission - Add Permission"   , 0, 5),
(27, "/api/auth/perm/delete_perm"     , "Permission - Delete Permission", 0, 5),
(28, "/api/auth/perm/get_menus"       , "Permission - Get Menus"        , 0, 5),
(29, "/api/auth/perm/get_perm"        , "Permission - Get Permission"   , 0, 5),
(30, "/api/auth/perm/get_perms"       , "Permission - Get Permissions"  , 0, 5),
(31, "/api/auth/perm/update_perm"     , "Permission - Update Permission", 0, 5),
(32, "/api/auth/menu/add_menu"        , "Menu - Add Menu"               , 0, 6),
(33, "/api/auth/menu/delete_menu"     , "Menu - Delete Menu"            , 0, 6),
(34, "/api/auth/menu/get_menu"        , "Menu - Get Menu"               , 0, 6),
(35, "/api/auth/menu/get_menus"       , "Menu - Get Menus"              , 0, 6),
(36, "/api/auth/menu/get_parent_menus", "Menu - Get Parent Menus"       , 0, 6),
(37, "/api/auth/menu/sort_menu"       , "Menu - Sort Menu"              , 0, 6),
(38, "/api/auth/menu/update_menu"     , "Menu - Update Menu"            , 0, 6),
(39, "/api/system/log/get_log"        , "Log - Get Log"                 , 0, 8),
(40, "/api/system/log/get_logs"       , "Log - Get Logs"                , 0, 8);


INSERT INTO auth_menu
(id, code, name, sort, is_virtual, parent_menu_id)
VALUES
(1, "auth"       , "Auth"       , 0, 0, NULL),
(2, "departments", "Departments", 1, 0, 1   ),
(3, "users"      , "Users"      , 2, 0, 1   ),
(4, "roles"      , "Roles"      , 3, 0, 1   ),
(5, "permissions", "Permissions", 4, 0, 1   ),
(6, "menus"      , "Menus"      , 5, 0, 1   ),
(7, "system"     , "System"     , 6, 0, NULL),
(8, "log"        , "Logs"       , 7, 0, 7   );


INSERT INTO auth_user_role
(user_id, role_id)
VALUES
(1, 1),
(2, 2);
