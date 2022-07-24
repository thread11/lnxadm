import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Breadcrumb } from 'antd';
import { Layout } from 'antd';
import LogDetail from './LogDetail.js';
import LogList from './LogList.js';
import store from './store.js';

function Index() {
  const logDetailVisible = useSelector(store.getLogDetailVisible);

  return (
    <>
      <Breadcrumb className="MyBreadcrumb">
        <Breadcrumb.Item><Link to="/">Home</Link></Breadcrumb.Item>
        <Breadcrumb.Item><Link to="/system">System</Link></Breadcrumb.Item>
        <Breadcrumb.Item>Log List</Breadcrumb.Item>
      </Breadcrumb>

      <Layout.Content className="MyContent">
        <LogList />
      </Layout.Content>

      { logDetailVisible === true && <LogDetail /> }
    </>
  );
}

export default Index;
