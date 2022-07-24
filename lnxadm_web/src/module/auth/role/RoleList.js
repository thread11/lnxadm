import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Button } from 'antd';
import { Divider } from 'antd';
import { Popconfirm } from 'antd';
import { Space } from 'antd';
import { Table } from 'antd';
import { Tooltip } from 'antd';
import { message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { SyncOutlined } from '@ant-design/icons';
import api from './api.js';
import store from './store.js';

function RoleList() {
  const dispatch = useDispatch();
  const roles = useSelector(store.getRoles);
  const roleTableLoading = useSelector(store.getRoleTableLoading);

  useEffect(() => {
    getRoles();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function addRole() {
    dispatch(store.setRole({}));
    dispatch(store.setRoleFormAddVisible(true));
  };

  async function deleteRole(id) {
    try {
      await api.deleteRole(id);
      message.success('Request succeeded', 1);

      dispatch(store.setRoleTableLoading(true));
      const response = await api.getRoles();
      dispatch(store.setRoles(response.data.data));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      dispatch(store.setRoleTableLoading(false));
    }
  };

  async function getRole(id) {
    try {
      dispatch(store.setRole({}));

      const response = await api.getRole(id);
      dispatch(store.setRole(response.data.data));

      dispatch(store.setRoleDetailVisible(true));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    }
  };

  async function getRoles() {
    try {
      dispatch(store.setRoleTableLoading(true));
      const response = await api.getRoles();
      dispatch(store.setRoles(response.data.data));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      dispatch(store.setRoleTableLoading(false));
    }
  };

  async function grantPerm(role_id) {
    try {
      dispatch(store.setRole({ id: role_id }));

      const response = await api.getPerms(role_id);

      let perms = response.data.data;
      let checked_keys = response.data.checked_keys;
      let expanded_keys = response.data.expanded_keys;
      let permsExtra = { checked_keys, expanded_keys };

      dispatch(store.setPerms(perms));
      dispatch(store.setPermsExtra(permsExtra));

      dispatch(store.setPermListVisible(true));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    }
  };

  async function updateRole(id) {
    try {
      dispatch(store.setRole({}));

      const response = await api.getRole(id);
      dispatch(store.setRole(response.data.data));

      dispatch(store.setRoleFormUpdateVisible(true));
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
        <a href="#/auth/roles" onClick={(event) => { event.preventDefault(); getRole(record.id); }}>{text}</a>
      ),
    },
    {
      key: 'actions',
      title: () => (
        <span>
          Actions
          &nbsp;
          <Tooltip title={<>Grant: Grant Permissions</>}>
            <QuestionCircleOutlined />
          </Tooltip>
        </span>
      ),
      render: (record) => (
        <span>
          <Button type="link" className="ButtonAsLink" onClick={() => updateRole(record.id)}>Edit</Button>
          <Divider type="vertical" />
          <Popconfirm
            title="Are you sure?"
            onConfirm={() => deleteRole(record.id)}
            okText="Yes"
            cancelText="No"
            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
          >
            <Button type="link" className="ButtonAsLink">Delete</Button>
          </Popconfirm>
          <Divider type="vertical" />
          <Button type="link" className="ButtonAsLink" onClick={() => grantPerm(record.id)}>Grant</Button>
        </span>
      ),
    },
  ];

  return (
    <>
      <div className="MyContentHeader">
        <span className="MyContentHeaderTitle">Role List</span>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => addRole()}>New Role</Button>
          <Button type="primary" icon={<SyncOutlined />} onClick={() => getRoles()}>Refresh</Button>
        </Space>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={roles}
        loading={roleTableLoading}
        pagination={false}
        showSorterTooltip={false}
        size="small"
      />
    </>
  );
}

export default RoleList;
