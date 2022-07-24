import React from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Button } from 'antd';
import { Form } from 'antd';
import { Modal } from 'antd';
import store from './store.js';

function LogDetail() {
  const dispatch = useDispatch();
  const log = useSelector(store.getLog);
  const logDetailVisible = useSelector(store.getLogDetailVisible);

  return (
    <>
      <Modal
        title="Log Detail"
        centered={true}
        destroyOnClose="true"
        maskStyle={{ opacity: '0.1', animation: 'none' }}
        visible={logDetailVisible}
        onCancel={() => dispatch(store.setLogDetailVisible(false))}
        footer={[
          <Button key="close" onClick={() => dispatch(store.setLogDetailVisible(false))}>Close</Button>,
        ]}
      >
        <Form layout="horizontal" labelCol={{ span: 9 }} wrapperCol={{ span: 9 }}>
          <Form.Item label="ID">{log.id}</Form.Item>
          <Form.Item label="Username">{log.username}</Form.Item>
          <Form.Item label="Nickname">{log.nickname}</Form.Item>
          <Form.Item label="Path">{log.path}</Form.Item>
          <Form.Item label="IP">{log.ip}</Form.Item>
          <Form.Item label="User Agent">{log.user_agent}</Form.Item>
          <Form.Item label="Referer">{log.referer}</Form.Item>
          <Form.Item label="Accessed At">{log.access_time}</Form.Item>
          <Form.Item label="Created At">{log.create_time}</Form.Item>
          <Form.Item label="Updated At">{log.update_time}</Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default LogDetail;
