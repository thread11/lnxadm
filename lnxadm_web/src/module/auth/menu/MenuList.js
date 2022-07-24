// import { useCallback } from 'react';
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
import { CheckOutlined } from '@ant-design/icons';
import { CloseOutlined } from '@ant-design/icons';
import { LineOutlined } from '@ant-design/icons';
import { MenuOutlined } from '@ant-design/icons';
import { PlusOutlined } from '@ant-design/icons';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { SyncOutlined } from '@ant-design/icons';
import update from 'immutability-helper';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DraggableBodyRow from '../../common/react_dnd/DraggableBodyRow.js';
import api from './api.js';
import store from './store.js';

function MenuList() {
  const dispatch = useDispatch();
  const menus = useSelector(store.getMenus);
  const menuTableLoading = useSelector(store.getMenuTableLoading);

  useEffect(() => {
    getMenus();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function addMenu() {
    try {
      const response = await api.getParentMenus();
      dispatch(store.setParentMenus(response.data.data));

      dispatch(store.setMenu({}));

      dispatch(store.setMenuFormAddVisible(true));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    }
  };

  async function copyMenu(id) {
    try {
      const response = await api.getParentMenus();
      dispatch(store.setParentMenus(response.data.data));

      dispatch(store.setMenu({}));

      const response2 = await api.getMenu(id);
      dispatch(store.setMenu(response2.data.data));

      dispatch(store.setMenuFormCopyVisible(true));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    }
  };

  async function deleteMenu(id) {
    try {
      await api.deleteMenu(id);
      message.success('Request succeeded', 1);

      dispatch(store.setMenuTableLoading(true));
      const response = await api.getMenus();
      dispatch(store.setMenus(response.data.data));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      dispatch(store.setMenuTableLoading(false));
    }
  };

  async function getMenu(id) {
    try {
      dispatch(store.setMenu({}));

      const response = await api.getMenu(id);
      dispatch(store.setMenu(response.data.data));

      dispatch(store.setMenuDetailVisible(true));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    }
  };

  async function getMenus() {
    try {
      dispatch(store.setMenuTableLoading(true));
      const response = await api.getMenus();
      dispatch(store.setMenus(response.data.data));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      dispatch(store.setMenuTableLoading(false));
    }
  };

  // const sortMenu = useCallback((dragIndex, hoverIndex) => {
  function sortMenu(dragIndex, hoverIndex) {
    if (dragIndex !== hoverIndex) {
      const dragRow = menus[dragIndex];
      const newMenus = update(menus, { $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]] });
      dispatch(store.setMenus(newMenus));

      // let id_sorts = newMenus.map((element, index) => element.id + '_' + index);
      // id_sorts = id_sorts.join(',');

      let id_sorts = [];
      newMenus.forEach((element, index) => {
        if (element.id !== menus[index].id) {
          id_sorts.push(element.id + '_' + index);
        }
      });
      id_sorts = id_sorts.join(',');

      (async () => {
        try {
          dispatch(store.setMenuTableLoading(true));

          await api.sortMenu(id_sorts);
          message.success('Request succeeded', 1);

          const response = await api.getMenus();
          dispatch(store.setMenus(response.data.data));
        } catch (error) {
          console.error(error);
          message.error(error.message);
        } finally {
          dispatch(store.setMenuTableLoading(false));
        }
      })();
    }
  }
  // }, [menus, dispatch]);

  async function updateMenu(id) {
    try {
      const response = await api.getParentMenus();
      dispatch(store.setParentMenus(response.data.data));

      dispatch(store.setMenu({}));

      const response2 = await api.getMenu(id);
      dispatch(store.setMenu(response2.data.data));

      dispatch(store.setMenuFormUpdateVisible(true));
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
      render: (text, record) => (
        <a href="#/auth/menus" onClick={(event) => { event.preventDefault(); getMenu(record.id); }}>{text}</a>
      ),
    },
    {
      key: 'name',
      title: 'Name',
      dataIndex: 'name',
      render: (text, record) => (
        record.parent_menu_id === 0 ? text : (
          <span>
            &nbsp;&nbsp;
            <LineOutlined rotate={90} />
            <LineOutlined style={{marginLeft: '-7px'}} />
            &nbsp;&nbsp;
            {text}
          </span>
        )
      ),
    },
    {
      title: () => (
        <span>
          Is Visible
          &nbsp;
          <Tooltip title="Show on the Left Side or Not"><QuestionCircleOutlined /></Tooltip>
        </span>
      ),
      dataIndex: 'is_virtual',
      render: (text) => text === 0 ? <span><CheckOutlined /></span> : <span><CloseOutlined /></span>,
    },
    {
      title: 'Sort',
      dataIndex: 'sort',
      width: 30,
      render: () => <MenuOutlined style={{ colorx: '#999' }} />,
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (record) => (
        <span>
          <Button type="link" className="ButtonAsLink" onClick={() => updateMenu(record.id)}>Edit</Button>
          <Divider type="vertical" />
          <Popconfirm
            title="Are you sure?"
            onConfirm={() => deleteMenu(record.id)}
            okText="Yes"
            cancelText="No"
            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
          >
            <Button type="link" className="ButtonAsLink">Delete</Button>
          </Popconfirm>
          <Divider type="vertical" />
          <Button type="link" className="ButtonAsLink" onClick={() => copyMenu(record.id)}>Copy</Button>
        </span>
      ),
    },
  ];

  return (
    <>
      <div className="MyContentHeader">
        <span className="MyContentHeaderTitle">Menu List</span>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => addMenu()}>New Menu</Button>
          <Button type="primary" icon={<SyncOutlined />} onClick={() => getMenus()}>Refresh</Button>
        </Space>
      </div>

      <DndProvider backend={HTML5Backend}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={menus}
          loading={menuTableLoading}
          pagination={false}
          showSorterTooltip={false}
          size="small"
          components={{ body: { row: DraggableBodyRow } }}
          onRow={(record, index) => ({ index, moveRow: sortMenu })}
        />
      </DndProvider>
    </>
  );
}

export default MenuList;
