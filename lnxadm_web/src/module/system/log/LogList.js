import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Button } from 'antd';
import { Space } from 'antd';
import { Table } from 'antd';
import { Tooltip } from 'antd';
import { message } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import api from './api.js';
import store from './store.js';

function LogList() {
  const dispatch = useDispatch();
  const logs = useSelector(store.getLogs);
  const logsPagination = useSelector(store.getLogsPagination);
  const logTableLoading = useSelector(store.getLogTableLoading);

  useEffect(() => {
    getLogs();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function getLog(id) {
    try {
      dispatch(store.setLog({}));

      const response = await api.getLog(id);
      dispatch(store.setLog(response.data.data));

      dispatch(store.setLogDetailVisible(true));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    }
  };

  async function getLogs() {
    try {
      dispatch(store.setLogTableLoading(true));
      const response = await api.getLogs();
      dispatch(store.setLogs(response.data.data));

      let { page, size, total } = response.data.pagination;
      let pagination = { page, size, total };
      dispatch(store.setLogsPagination(pagination));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      dispatch(store.setLogTableLoading(false));
    }
  }

  function onChange(page, pageSize) {
    let pagination = { ...logsPagination, page, size: pageSize };
    dispatch(store.setLogsPagination(pagination));
    getLogs();
  }

  const columns = [
    {
      key: 'nickname',
      title: 'User',
      dataIndex: 'nickname',
      sorter: (x, y) => x.name.localeCompare(y.name),
      sortDirections: ['ascend', 'descend'],
      render: (text, record) => (
        <a href="#/system/logs" onClick={(event) => { event.preventDefault(); getLog(record.id); }}>{text}</a>
      ),
    },
    {
      key: 'path',
      title: 'Path',
      dataIndex: 'path',
    },
    {
      key: 'ip',
      title: 'IP',
      dataIndex: 'ip',
    },
    {
      key: 'user_agent',
      title: 'User Agent',
      dataIndex: 'user_agent',
      render: text => (
        <span>
          {text.length > 30 ? <Tooltip title={text}>{text.substring(0, 30) + '...'}</Tooltip> : text}
        </span>
      ),
    },
    {
      key: 'referer',
      title: 'Referer',
      dataIndex: 'referer',
      render: text => (
        <span>
          {text.length > 30 ? <Tooltip title={text}>{text.substring(0, 30) + '...'}</Tooltip> : text}
        </span>
      ),
    },
    {
      key: 'access_time',
      title: 'Accessed At',
      dataIndex: 'access_time',
    },
  ];

  return (
    <>
      <div className="MyContentHeader">
        <span className="MyContentHeaderTitle">Log List</span>
        <Space>
          <Button type="primary" icon={<SyncOutlined />} onClick={() => getLogs()}>Refresh</Button>
        </Space>
      </div>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={logs}
        loading={logTableLoading}
        showSorterTooltip={false}
        size="small"
        pagination = {{
          current: logsPagination.page,
          pageSize: logsPagination.size,
          total: logsPagination.total,
          showSizeChanger: true,
          position: ['bottomRight'],
          onChange: (page, pageSize) => onChange(page, pageSize),
        }}
      />
    </>
  );
}

export default LogList;
