import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Button } from 'antd';
import { Divider } from 'antd';
import { Dropdown } from 'antd';
import { Menu } from 'antd';
import { Popconfirm } from 'antd';
import { Space } from 'antd';
import { Switch } from 'antd';
import { Table } from 'antd';
import { Tag } from 'antd';
import { Tooltip } from 'antd';
import { message } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import { CheckOutlined } from '@ant-design/icons';
import { CloseOutlined } from '@ant-design/icons';
import { PlusOutlined } from '@ant-design/icons';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { SyncOutlined } from '@ant-design/icons';
import api from './api.js';
import store from './store.js';

function UserList() {
  const dispatch = useDispatch();
  const user = useSelector(store.getUser);
  const users = useSelector(store.getUsers);
  const userTableLoading = useSelector(store.getUserTableLoading);

  useEffect(() => {
    getUsers();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function addUser() {
    try {
      const response = await api.getDepts();
      dispatch(store.setDepts(response.data.data));

      dispatch(store.setUser({}));

      dispatch(store.setUserFormAddVisible(true));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    }
  };

  async function assignRole(user_id) {
    try {
      dispatch(store.setUser({ id: user_id }));

      const response = await api.getRoles(user_id);
      let roles = response.data.data;
      let checked_keys = response.data.checked_keys;
      let rolesExtra = { checked_keys };

      dispatch(store.setRoles(roles));
      dispatch(store.setRolesExtra(rolesExtra));

      dispatch(store.setRoleListVisible(true));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    }
  };

  async function deleteUser(id) {
    try {
      await api.deleteUser(id);
      message.success('Request succeeded', 1);

      dispatch(store.setUserTableLoading(true));
      const response = await api.getUsers();
      dispatch(store.setUsers(response.data.data));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      dispatch(store.setUserTableLoading(false));
    }
  };

  async function enableOrDisableUser(id) {
    try {
      if (user.is_active === 0) {
        await api.enableUser(id);
      } else {
        await api.disableUser(id);
      }

      dispatch(store.setUserTableLoading(true));
      const response = await api.getUsers();
      dispatch(store.setUsers(response.data.data));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      dispatch(store.setUserTableLoading(false));
    }
  };

  async function getUser(id) {
    try {
      dispatch(store.setUser({}));

      const response = await api.getUser(id);
      dispatch(store.setUser(response.data.data));

      dispatch(store.setUserDetailVisible(true));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    }
  };

  async function getUsers() {
    try {
      dispatch(store.setUserTableLoading(true));
      const response = await api.getUsers();
      dispatch(store.setUsers(response.data.data));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      dispatch(store.setUserTableLoading(false));
    }
  };

  async function resetPassword(user) {
    try {
      dispatch(store.setUser({ id: user.id, username: user.username, nickname: user.nickname }));
      dispatch(store.setUserFormPasswordVisible(true));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    }
  }

  async function grantPerm(user_id) {
    try {
      dispatch(store.setUser({ id: user_id }));

      const response = await api.getPerms(user_id);

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

  function setUser(user) {
    dispatch(store.setUser({}));
    dispatch(store.setUser(user));
  };

  async function updateUser(id) {
    try {
      const response = await api.getDepts();
      dispatch(store.setDepts(response.data.data));

      dispatch(store.setUser({}));

      const response2 = await api.getUser(id);
      dispatch(store.setUser(response2.data.data));

      dispatch(store.setUserFormUpdateVisible(true));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    }
  };

  const columns = [
    {
      key: 'username',
      title: 'Username',
      dataIndex: 'username',
      sorter: (x, y) => x.username.localeCompare(y.username),
      sortDirections: ['ascend', 'descend'],
      render: (text, record) => (
        <a href="#/auth/users" onClick={(event) => { event.preventDefault(); getUser(record.id); }}>{text}</a>
      ),
    },
    {
      key: 'nickname',
      title: 'Nickname',
      dataIndex: 'nickname',
      sorter: (x, y) => x.nickname.localeCompare(y.nickname),
      sortDirections: ['ascend', 'descend'],
    },
    {
      key: 'email',
      title: 'Email',
      dataIndex: 'email',
    },
    {
      key: 'is_admin',
      title: 'Is Admin',
      dataIndex: 'is_admin',
      sortDirections: ['ascend', 'descend'],
      render: (text) => text === 1 ? <span><CheckOutlined /></span> : <span><CloseOutlined /></span>,
    },
    {
      key: 'department',
      title: 'Department',
      dataIndex: 'dept_name',
    },
    {
      key: 'roles',
      title: 'Roles',
      dataIndex: 'role_names',
      render: (text) => (<>{
        text.map((value, index) => (
          <span key={index}>
            <Tag color="geekblue" style={{ marginTop: '1px', marginBottom: '1px' }}>{value}</Tag>
            {++index%1===0 && <br />}
          </span>
        ))
      }</>),
    },
    {
      key: 'is_active',
      title: 'Is Active',
      dataIndex: 'is_active',
      sortDirections: ['ascend', 'descend'],
      render: (text, record) => (
        <Popconfirm
          title="Are you sure?"
          onConfirm={() => enableOrDisableUser(record.id)}
          okText="Yes"
          cancelText="No"
          icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
        >
          <span>
            <Switch
              size="small"
              checked={text === 1 ? true : false}
              checkedChildren={<CheckOutlined />}
              unCheckedChildren={<CloseOutlined />}
              // onClick={(checked, event) => onClick(checked, event)}
              onClick={() => setUser(record)}
           />
         </span>
        </Popconfirm>
      ),
    },
    {
      key: 'actions',
      title: () => (
        <span>
          Actions
          &nbsp;
          <Tooltip title={<>Assign: Assign Roles<br />Grant: Grant Permissions</>}>
            <QuestionCircleOutlined />
          </Tooltip>
        </span>
      ),
      render: (text, record) => (
        <span>
          <Button type="link" className="ButtonAsLink" onClick={() => updateUser(record.id)}>Edit</Button>
          <Divider type="vertical" />
          <Popconfirm
            title="Are you sure?"
            onConfirm={() => deleteUser(record.id)}
            okText="Yes"
            cancelText="No"
            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
          >
            <Button type="link" className="ButtonAsLink">Delete</Button>
          </Popconfirm>
          <Divider type="vertical" />
          <Button type="link" className="ButtonAsLink" onClick={() => assignRole(record.id)}>Assign</Button>
          <Divider type="vertical" />
          <Button type="link" className="ButtonAsLink" onClick={() => grantPerm(record.id)}>Grant</Button>
          <Divider type="vertical" />
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item key="0" className="MenuItemAsLink">
                  <a href="#/auth/users" onClick={(event) => { event.preventDefault(); resetPassword(record); }}>
                    Reset Password
                  </a>
                </Menu.Item>
              </Menu>
            }
          >
            <a href="#/auth/users" onClick={(event) => { event.preventDefault(); }}><MoreOutlined /></a>
          </Dropdown>
        </span>
      ),
    },
  ];

  return (
    <>
      <div className="MyContentHeader">
        <span className="MyContentHeaderTitle">User List</span>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => addUser()}>New User</Button>
          <Button type="primary" icon={<SyncOutlined />} onClick={() => getUsers()}>Refresh</Button>
        </Space>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={users}
        loading={userTableLoading}
        pagination={false}
        showSorterTooltip={false}
        size="small"
      />
    </>
  );
}

export default UserList;
