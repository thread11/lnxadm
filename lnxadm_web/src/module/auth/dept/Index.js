import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Breadcrumb } from 'antd';
import { Layout } from 'antd';
import DeptDetail from './DeptDetail.js';
import DeptFormAdd from './DeptFormAdd.js';
import DeptFormUpdate from './DeptFormUpdate.js';
import DeptList from './DeptList.js';
import store from './store.js';

function Dept() {
  const deptDetailVisible = useSelector(store.getDeptDetailVisible);
  const deptFormAddVisible = useSelector(store.getDeptFormAddVisible);
  const deptFormUpdateVisible = useSelector(store.getDeptFormUpdateVisible);

  return (
    <>
      <Breadcrumb className="MyBreadcrumb">
        <Breadcrumb.Item><Link to="/">Home</Link></Breadcrumb.Item>
        <Breadcrumb.Item><Link to="/auth">Auth</Link></Breadcrumb.Item>
        <Breadcrumb.Item>Department List</Breadcrumb.Item>
      </Breadcrumb>

      <Layout.Content className="MyContent">
        <DeptList />
      </Layout.Content>

      { deptDetailVisible === true && <DeptDetail /> }
      { deptFormAddVisible === true && <DeptFormAdd /> }
      { deptFormUpdateVisible === true && <DeptFormUpdate /> }
    </>
  );
}

export default Dept;
