import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Button } from 'antd';
import { Divider } from 'antd';
import { Popconfirm } from 'antd';
import { Space } from 'antd';
import { Table } from 'antd';
import { message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { SyncOutlined } from '@ant-design/icons';
import api from './api.js';
import store from './store.js';

function DeptList() {
  const dispatch = useDispatch();
  const depts = useSelector(store.getDepts);
  const deptTableLoading = useSelector(store.getDeptTableLoading);

  useEffect(() => {
    getDepts();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function addDept() {
    dispatch(store.setDept({}));
    dispatch(store.setDeptFormAddVisible(true));
  };

  async function deleteDept(id) {
    try {
      await api.deleteDept(id);
      message.success('Request succeeded', 1);

      dispatch(store.setDeptTableLoading(true));
      const response = await api.getDepts();
      dispatch(store.setDepts(response.data.data));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      dispatch(store.setDeptTableLoading(false));
    }
  };

  async function getDept(id) {
    try {
      dispatch(store.setDept({}));

      const response = await api.getDept(id);
      dispatch(store.setDept(response.data.data));

      dispatch(store.setDeptDetailVisible(true));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    }
  };

  async function getDepts() {
    try {
      dispatch(store.setDeptTableLoading(true));
      const response = await api.getDepts();
      dispatch(store.setDepts(response.data.data));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      dispatch(store.setDeptTableLoading(false));
    }
  };

  async function updateDept(id) {
    try {
      dispatch(store.setDept({}));

      const response = await api.getDept(id);
      dispatch(store.setDept(response.data.data));

      dispatch(store.setDeptFormUpdateVisible(true));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    }
  };

  const columns = [
    {
      key: 'name',
      title: 'Name',
      dataIndex: 'name',
      sorter: (x, y) => x.name.localeCompare(y.name),
      sortDirections: ['ascend', 'descend'],
      render: (text, record) => (
        <a href="#/auth/depts" onClick={(event) => { event.preventDefault(); getDept(record.id); }}>{text}</a>
      ),
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (record) => (
        <span>
          <Button type="link" className="ButtonAsLink" onClick={() => updateDept(record.id)}>Edit</Button>
          <Divider type="vertical" />
          <Popconfirm
            title="Are you sure?"
            onConfirm={() => deleteDept(record.id)}
            okText="Yes"
            cancelText="No"
            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
          >
            <Button type="link" className="ButtonAsLink">Delete</Button>
          </Popconfirm>
        </span>
      ),
    },
  ];

  return (
    <>
      <div className="MyContentHeader">
        <span className="MyContentHeaderTitle">Department List</span>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => addDept()}>New Department</Button>
          <Button type="primary" icon={<SyncOutlined />} onClick={() => getDepts()}>Refresh</Button>
        </Space>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={depts}
        loading={deptTableLoading}
        pagination={false}
        showSorterTooltip={false}
        size="small"
      />
    </>
  );
}

export default DeptList;
