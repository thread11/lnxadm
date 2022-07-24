import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Breadcrumb } from 'antd';
import { Layout } from 'antd';
import PermDetail from './PermDetail.js';
import PermFormAdd from './PermFormAdd.js';
import PermFormCopy from './PermFormCopy.js';
import PermFormUpdate from './PermFormUpdate.js';
import PermList from './PermList.js';
import store from './store.js';

function Index() {
  const permDetailVisible = useSelector(store.getPermDetailVisible);
  const permFormAddVisible = useSelector(store.getPermFormAddVisible);
  const permFormCopyVisible = useSelector(store.getPermFormCopyVisible);
  const permFormUpdateVisible = useSelector(store.getPermFormUpdateVisible);

  return (
    <>
      <Breadcrumb className="MyBreadcrumb">
        <Breadcrumb.Item><Link to="/">Home</Link></Breadcrumb.Item>
        <Breadcrumb.Item><Link to="/auth">Auth</Link></Breadcrumb.Item>
        <Breadcrumb.Item>Permission List</Breadcrumb.Item>
      </Breadcrumb>

      <Layout.Content className="MyContent2">
        <PermList />
      </Layout.Content>

      { permDetailVisible === true && <PermDetail /> }
      { permFormAddVisible === true && <PermFormAdd /> }
      { permFormCopyVisible === true && <PermFormCopy /> }
      { permFormUpdateVisible === true && <PermFormUpdate /> }
    </>
  );
}

export default Index;
