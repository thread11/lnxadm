import React from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Button } from 'antd';
import { Form } from 'antd';
import { Modal } from 'antd';
import store from './store.js';

function RoleDetail() {
  const dispatch = useDispatch();
  const role = useSelector(store.getRole);
  const roleDetailVisible = useSelector(store.getRoleDetailVisible);

  return (
    <>
      <Modal
        title="Role Detail"
        centered={true}
        destroyOnClose="true"
        maskStyle={{ opacity: '0.1', animation: 'none' }}
        visible={roleDetailVisible}
        onCancel={() => dispatch(store.setRoleDetailVisible(false))}
        footer={[
          <Button key="close" onClick={() => dispatch(store.setRoleDetailVisible(false))}>Close</Button>,
        ]}
      >
        <Form layout="horizontal" labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} className="MyForm">
          <Form.Item label="ID">{role.id}</Form.Item>
          <Form.Item label="Name">{role.name}</Form.Item>
          <Form.Item label="Remark">{role.remark}</Form.Item>
          <Form.Item label="Created At">{role.create_time}</Form.Item>
          <Form.Item label="Updated At">{role.update_time}</Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default RoleDetail;
