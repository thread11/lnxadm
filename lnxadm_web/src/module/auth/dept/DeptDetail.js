import React from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Button } from 'antd';
import { Form } from 'antd';
import { Modal } from 'antd';
import store from './store.js';

function DeptDetail() {
  const dispatch = useDispatch();
  const dept = useSelector(store.getDept);
  const deptDetailVisible = useSelector(store.getDeptDetailVisible);

  return (
    <>
      <Modal
        title="Department Detail"
        centered={true}
        destroyOnClose="true"
        maskStyle={{ opacity: '0.1', animation: 'none' }}
        visible={deptDetailVisible}
        onCancel={() => dispatch(store.setDeptDetailVisible(false))}
        footer={[
          <Button key="close" onClick={() => dispatch(store.setDeptDetailVisible(false))}>Close</Button>,
        ]}
      >
        <Form layout="horizontal" labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} className="MyForm">
          <Form.Item label="ID">{dept.id}</Form.Item>
          <Form.Item label="Name">{dept.name}</Form.Item>
          <Form.Item label="Remark">{dept.remark}</Form.Item>
          <Form.Item label="Created At">{dept.create_time}</Form.Item>
          <Form.Item label="Updated At">{dept.update_time}</Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default DeptDetail;
