import React from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Form } from 'antd';
import { Input } from 'antd';
import { Modal } from 'antd';
import { message } from 'antd';
import api from './api.js';
import store from './store.js';

function RoleFormAdd() {
  const dispatch = useDispatch();
  const roleFormAddVisible = useSelector(store.getRoleFormAddVisible);

  const [form] = Form.useForm();

  async function addRole() {
    let role = form.getFieldsValue();

    let { name } = role;
    if (name === undefined || name.trim() === '') {
      message.info('Name is required');
      return
    }

    try {
      await api.addRole(role);
      message.success('Request succeeded', 1);
      dispatch(store.setRoleFormAddVisible(false));

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

  return (
    <>
      <Modal
        title="New Role"
        centered={true}
        destroyOnClose="true"
        maskStyle={{ opacity: '0.1', animation: 'none' }}
        visible={roleFormAddVisible}
        okText="Submit"
        onCancel={() => dispatch(store.setRoleFormAddVisible(false))}
        onOk={() => addRole()}
      >
        <Form
          form={form}
          layout="horizontal"
          labelCol={{ span: 9 }}
          wrapperCol={{ span: 9 }}
        >
          <Form.Item name="name" label={<span className="Required">Name</span>}>
            <Input />
          </Form.Item>

          <Form.Item name="remark" label="Remark">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default RoleFormAdd;
