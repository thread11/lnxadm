import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Breadcrumb } from 'antd';
import { Layout } from 'antd';
import MenuDetail from './MenuDetail.js';
import MenuFormAdd from './MenuFormAdd.js';
import MenuFormCopy from './MenuFormCopy.js';
import MenuFormUpdate from './MenuFormUpdate.js';
import MenuList from './MenuList.js';
import store from './store.js';

function Index() {
  const menuDetailVisible = useSelector(store.getMenuDetailVisible);
  const menuFormAddVisible = useSelector(store.getMenuFormAddVisible);
  const menuFormCopyVisible = useSelector(store.getMenuFormCopyVisible);
  const menuFormUpdateVisible = useSelector(store.getMenuFormUpdateVisible);

  return (
    <>
      <Breadcrumb className="MyBreadcrumb">
        <Breadcrumb.Item><Link to="/">Home</Link></Breadcrumb.Item>
        <Breadcrumb.Item><Link to="/auth">Auth</Link></Breadcrumb.Item>
        <Breadcrumb.Item>Menu List</Breadcrumb.Item>
      </Breadcrumb>

      <Layout.Content className="MyContent">
        <MenuList />
      </Layout.Content>

      { menuDetailVisible === true && <MenuDetail /> }
      { menuFormAddVisible === true && <MenuFormAdd /> }
      { menuFormCopyVisible === true && <MenuFormCopy /> }
      { menuFormUpdateVisible === true && <MenuFormUpdate /> }
    </>
  );
}

export default Index;
