import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Breadcrumb } from 'antd';
import { Layout } from 'antd';
import PermList from './PermList.js';
import RoleList from './RoleList.js';
import UserDetail from './UserDetail.js';
import UserFormAdd from './UserFormAdd.js';
import UserFormPassword from './UserFormPassword.js';
import UserFormUpdate from './UserFormUpdate.js';
import UserList from './UserList.js';
import store from './store.js';

function Index() {
  const userDetailVisible = useSelector(store.getUserDetailVisible);
  const userFormAddVisible = useSelector(store.getUserFormAddVisible);
  const userFormUpdateVisible = useSelector(store.getUserFormUpdateVisible);
  const userFormPasswordVisible = useSelector(store.getUserFormPasswordVisible);
  const roleListVisible = useSelector(store.getRoleListVisible);
  const permListVisible = useSelector(store.getPermListVisible);

  return (
    <>
      <Breadcrumb className="MyBreadcrumb">
        <Breadcrumb.Item><Link to="/">Home</Link></Breadcrumb.Item>
        <Breadcrumb.Item><Link to="/auth">Auth</Link></Breadcrumb.Item>
        <Breadcrumb.Item>User List</Breadcrumb.Item>
      </Breadcrumb>

      <Layout.Content className="MyContent">
        <UserList />
      </Layout.Content>

      { userDetailVisible === true && <UserDetail /> }
      { userFormAddVisible === true && <UserFormAdd /> }
      { userFormUpdateVisible === true && <UserFormUpdate /> }
      { userFormPasswordVisible === true && <UserFormPassword /> }
      { roleListVisible === true && <RoleList /> }
      { permListVisible === true && <PermList /> }
    </>
  );
}

export default Index;
