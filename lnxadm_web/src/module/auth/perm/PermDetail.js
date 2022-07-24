import React from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Button } from 'antd';
import { Form } from 'antd';
import { Modal } from 'antd';
import store from './store.js';

function PermDetail() {
  const dispatch = useDispatch();
  const perm = useSelector(store.getPerm);
  const permDetailVisible = useSelector(store.getPermDetailVisible);

  return (
    <>
      <Modal
        title="Permission Detail"
        centered={true}
        destroyOnClose="true"
        maskStyle={{ opacity: '0.1', animation: 'none' }}
        visible={permDetailVisible}
        onCancel={() => dispatch(store.setPermDetailVisible(false))}
        footer={[
          <Button key="close" onClick={() => dispatch(store.setPermDetailVisible(false))}>Close</Button>,
        ]}
      >
        <Form layout="horizontal" labelCol={{ span: 9 }} wrapperCol={{ span: 12 }} className="MyForm">
          <Form.Item label="ID">{perm.id}</Form.Item>
          <Form.Item label="Code">{perm.code}</Form.Item>
          <Form.Item label="Name">{perm.name}</Form.Item>
          <Form.Item label="Remark">{perm.remark}</Form.Item>
          <Form.Item label="Created At">{perm.create_time}</Form.Item>
          <Form.Item label="Updated At">{perm.update_time}</Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default PermDetail;
