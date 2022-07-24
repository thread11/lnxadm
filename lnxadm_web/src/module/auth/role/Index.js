import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Breadcrumb } from 'antd';
import { Layout } from 'antd';
import PermList from './PermList.js';
import RoleDetail from './RoleDetail.js';
import RoleFormAdd from './RoleFormAdd.js';
import RoleFormUpdate from './RoleFormUpdate.js';
import RoleList from './RoleList.js';
import store from './store.js';

function Index() {
  const roleDetailVisible = useSelector(store.getRoleDetailVisible);
  const roleFormAddVisible = useSelector(store.getRoleFormAddVisible);
  const roleFormUpdateVisible = useSelector(store.getRoleFormUpdateVisible);
  const permListVisible = useSelector(store.getPermListVisible);

  return (
    <>
      <Breadcrumb className="MyBreadcrumb">
        <Breadcrumb.Item><Link to="/">Home</Link></Breadcrumb.Item>
        <Breadcrumb.Item><Link to="/auth">Auth</Link></Breadcrumb.Item>
        <Breadcrumb.Item>Role List</Breadcrumb.Item>
      </Breadcrumb>

      <Layout.Content className="MyContent">
        <RoleList />
      </Layout.Content>

      { roleDetailVisible === true && <RoleDetail /> }
      { roleFormAddVisible === true && <RoleFormAdd /> }
      { roleFormUpdateVisible === true && <RoleFormUpdate /> }
      { permListVisible === true && <PermList /> }
    </>
  );
}

export default Index;
