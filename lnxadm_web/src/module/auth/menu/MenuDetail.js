import React from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Button } from 'antd';
import { Form } from 'antd';
import { Modal } from 'antd';
import store from './store.js';

function MenuDetail() {
  const dispatch = useDispatch();
  const menu = useSelector(store.getMenu);
  const menuDetailVisible = useSelector(store.getMenuDetailVisible);

  return (
    <>
      <Modal
        title="Menu Detail"
        centered={true}
        destroyOnClose="true"
        maskStyle={{ opacity: '0.1', animation: 'none' }}
        visible={menuDetailVisible}
        onCancel={() => dispatch(store.setMenuDetailVisible(false))}
        footer={[
          <Button key="close" onClick={() => dispatch(store.setMenuDetailVisible(false))}>Close</Button>,
        ]}
      >
        <Form layout="horizontal" labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} className="MyForm">
          <Form.Item label="ID">{menu.id}</Form.Item>
          <Form.Item label="Code">{menu.code}</Form.Item>
          <Form.Item label="Name">{menu.name}</Form.Item>
          <Form.Item label="Is Virtual">{menu.is_virtual === 1 ? 'Yes' : 'No'}</Form.Item>
          <Form.Item label="Remark">{menu.remark}</Form.Item>
          <Form.Item label="Created At">{menu.create_time}</Form.Item>
          <Form.Item label="Updated At">{menu.update_time}</Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default MenuDetail;
