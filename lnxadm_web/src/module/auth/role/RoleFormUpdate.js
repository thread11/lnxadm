import React from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Form } from 'antd';
import { Input } from 'antd';
import { Modal } from 'antd';
import { message } from 'antd';
import api from './api.js';
import store from './store.js';

function RoleFormUpdate() {
  const dispatch = useDispatch();
  const role = useSelector(store.getRole);
  const roleFormUpdateVisible = useSelector(store.getRoleFormUpdateVisible);

  const [form] = Form.useForm();

  async function updateRole() {
    let role = form.getFieldsValue();

    let { name } = role;
    if (name === undefined || name.trim() === '') {
      message.info('Name is required');
      return
    }

    try {
      await api.updateRole(role);
      message.success('Request succeeded', 1);
      dispatch(store.setRoleFormUpdateVisible(false));

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
        title="Edit Role"
        centered={true}
        destroyOnClose="true"
        maskStyle={{ opacity: '0.1', animation: 'none' }}
        visible={roleFormUpdateVisible}
        okText="Submit"
        onCancel={() => dispatch(store.setRoleFormUpdateVisible(false))}
        onOk={() => updateRole()}
      >
        <Form
          form={form}
          layout="horizontal"
          labelCol={{ span: 9 }}
          wrapperCol={{ span: 9 }}
          initialValues={{
            id: role.id,
            name: role.name,
            remark: role.remark,
          }}
        >
          <Form.Item name="id" label="ID" style={{ display: 'none' }}>
            <Input />
          </Form.Item>

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

export default RoleFormUpdate;
