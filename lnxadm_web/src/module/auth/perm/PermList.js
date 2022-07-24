import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Button } from 'antd';
import { Divider } from 'antd';
import { Form } from 'antd';
import { Popconfirm } from 'antd';
import { Select } from 'antd';
import { Space } from 'antd';
import { Table } from 'antd';
import { message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { SearchOutlined } from '@ant-design/icons';
import { SyncOutlined } from '@ant-design/icons';
import { UndoOutlined } from '@ant-design/icons';
import api from './api.js';
import store from './store.js';

function PermList() {
  const dispatch = useDispatch();
  const perms = useSelector(store.getPerms);
  const permTableLoading = useSelector(store.getPermTableLoading);
  const menus = useSelector(store.getMenus);

  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(store.setContext({}));

    getPerms();

    getMenus();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function addPerm() {
    try {
      const response = await api.getMenus();
      dispatch(store.setMenus(response.data.data));

      dispatch(store.setPerm({}));

      dispatch(store.setPermFormAddVisible(true));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    }
  };

  async function changeMenu(value) {
    try {
      // form.getFieldsValue()
      let menuId = value;
      dispatch(store.setContext({ menuId }));

      dispatch(store.setPermTableLoading(true));
      const response = await api.getPerms();
      dispatch(store.setPerms(response.data.data));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      dispatch(store.setPermTableLoading(false));
    }
  }

  async function copyPerm(id) {
    try {
      dispatch(store.setPerm({}));

      const response = await api.getPerm(id);
      dispatch(store.setPerm(response.data.data));

      const response2 = await api.getMenus();
      dispatch(store.setMenus(response2.data.data));

      dispatch(store.setPermFormCopyVisible(true));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    }
  };

  async function deletePerm(id) {
    try {
      await api.deletePerm(id);
      message.success('Request succeeded', 1);

      dispatch(store.setPermTableLoading(true));
      const response = await api.getPerms();
      dispatch(store.setPerms(response.data.data));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      dispatch(store.setPermTableLoading(false));
    }
  };

  async function getMenus() {
    try {
      const response = await api.getMenus();
      dispatch(store.setMenus(response.data.data));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
    }
  }

  async function getPerm(id) {
    try {
      dispatch(store.setPerm({}));

      const response = await api.getPerm(id);
      dispatch(store.setPerm(response.data.data));

      dispatch(store.setPermDetailVisible(true));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    }
  };

  async function getPerms() {
    try {
      dispatch(store.setPermTableLoading(true));
      const response = await api.getPerms();
      dispatch(store.setPerms(response.data.data));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      dispatch(store.setPermTableLoading(false));
    }
  };

  async function resetPerm() {
    try {
      form.resetFields();
      dispatch(store.setContext({}));

      dispatch(store.setPermTableLoading(true));
      const response = await api.getPerms();
      dispatch(store.setPerms(response.data.data));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      dispatch(store.setPermTableLoading(false));
    }
  }

  async function searchPerm() {
    try {
      dispatch(store.setPermTableLoading(true));
      const response = await api.getPerms();
      dispatch(store.setPerms(response.data.data));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      dispatch(store.setPermTableLoading(false));
    }
  }

  async function updatePerm(id) {
    try {
      dispatch(store.setPerm({}));

      const response = await api.getPerm(id);
      dispatch(store.setPerm(response.data.data));

      const response2 = await api.getMenus();
      dispatch(store.setMenus(response2.data.data));

      dispatch(store.setPermFormUpdateVisible(true));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    }
  };

  const columns = [
    {
      key: 'code',
      title: 'Code',
      dataIndex: 'code',
      sorter: (x, y) => x.code.localeCompare(y.code),
      sortDirections: ['ascend', 'descend'],
      render: (text, record) => (
        <a href="#/auth/perms" onClick={(event) => { event.preventDefault(); getPerm(record.id); }}>{text}</a>
      ),
    },
    {
      key: 'name',
      title: 'Name',
      dataIndex: 'name',
      sorter: (x, y) => x.name.localeCompare(y.name),
      sortDirections: ['ascend', 'descend'],
    },
    {
      key: 'menu_name',
      title: 'Menu',
      dataIndex: 'menu_name',
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (record) => (
        <span>
          <Button type="link" className="ButtonAsLink" onClick={() => updatePerm(record.id)}>Edit</Button>
          <Divider type="vertical" />
          <Popconfirm
            title="Are you sure?"
            onConfirm={() => deletePerm(record.id)}
            okText="Yes"
            cancelText="No"
            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
          >
            <Button type="link" className="ButtonAsLink">Delete</Button>
          </Popconfirm>
          <Divider type="vertical" />
          <Button type="link" className="ButtonAsLink" onClick={() => copyPerm(record.id)}>Copy</Button>
        </span>
      ),
    },
  ];

  return (
    <>
      <div className="MyContentBlock">
        <Form form={form} name="horizontal_login" layout="inline">
          <Form.Item name="menu_id" label="Menu">
            <Select allowClear={true} style={{ width: 200 }} onChange={(value) => changeMenu(value)}>
              {menus.map((menu, index) => (
                <Select.Option key={index} value={menu.id} disabled={menu.is_parent}>
                  {menu.alias}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" icon={<SearchOutlined />} onClick={() => searchPerm()}>Search</Button>
              <Button type="primary" icon={<UndoOutlined />} onClick={() => resetPerm()}>Reset</Button>
            </Space>
          </Form.Item>
        </Form>
      </div>

      <div className="MyContentDivider"></div>

      <div className="MyContentBlock">
        <div className="MyContentHeader">
          <span className="MyContentHeaderTitle">Permission List</span>
          <Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => addPerm()}>New Permission</Button>
            <Button type="primary" icon={<SyncOutlined />} onClick={() => getPerms()}>Refresh</Button>
          </Space>
        </div>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={perms}
          loading={permTableLoading}
          pagination={false}
          showSorterTooltip={false}
          size="small"
        />
      </div>
    </>
  );
}

export default PermList;
