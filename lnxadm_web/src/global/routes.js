import Dept from '../module/auth/dept/Index.js';
import Index from '../module/index/Index.js';
import Log from '../module/system/log/Index.js';
import Menu from '../module/auth/menu/Index.js';
import NotFound from '../module/common/NotFound.js';
import Perm from '../module/auth/perm/Index.js';
import Role from '../module/auth/role/Index.js';
import User from '../module/auth/user/Index.js';

const routes = [
  { path: '/', component: Index },
  { path: '/index', component: Index },

  { path: '/auth', component: User },
  { path: '/auth/depts', component: Dept },
  { path: '/auth/users', component: User },
  { path: '/auth/roles', component: Role },
  { path: '/auth/perms', component: Perm },
  { path: '/auth/menus', component: Menu },

  { path: '/system/logs', component: Log },

  { path: '*', component: NotFound },
];

export default routes;
