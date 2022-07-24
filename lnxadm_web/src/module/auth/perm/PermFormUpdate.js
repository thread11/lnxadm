import React from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Form } from 'antd';
import { Input } from 'antd';
import { Modal } from 'antd';
import { Select } from 'antd';
import { message } from 'antd';
import api from './api.js';
import store from './store.js';

function PermFormUpdate() {
  const dispatch = useDispatch();
  const perm = useSelector(store.getPerm);
  const permFormUpdateVisible = useSelector(store.getPermFormUpdateVisible);
  const menus = useSelector(store.getMenus);

  const [form] = Form.useForm();

  async function updatePerm() {
    let perm = form.getFieldsValue();

    let { code, name } = perm;
    if (code === undefined || code.trim() === '') {
      message.info('Code is required');
      return
    }
    if (name === undefined || name.trim() === '') {
      message.info('Name is required');
      return
    }

    try {
      await api.updatePerm(perm);
      message.success('Request succeeded', 1);
      dispatch(store.setPermFormUpdateVisible(false));

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

  return (
    <>
      <Modal
        title="Edit Permission"
        centered={true}
        destroyOnClose="true"
        maskStyle={{ opacity: '0.1', animation: 'none' }}
        visible={permFormUpdateVisible}
        okText="Submit"
        onCancel={() => dispatch(store.setPermFormUpdateVisible(false))}
        onOk={() => updatePerm()}
      >
        <Form
          form={form}
          layout="horizontal"
          labelCol={{ span: 9 }}
          wrapperCol={{ span: 9 }}
          initialValues={{
            id: perm.id,
            code: perm.code,
            name: perm.name,
            remark: perm.remark,
            menu_id: perm.menu_id,
          }}
        >
          <Form.Item name="id" label="ID" style={{ display: 'none' }}>
            <Input />
          </Form.Item>

          <Form.Item name="code" label={<span className="Required">Code</span>}>
            <Input />
          </Form.Item>

          <Form.Item name="name" label={<span className="Required">Name</span>}>
            <Input />
          </Form.Item>

          <Form.Item name="menu_id" label="Menu">
            <Select allowClear>
              {menus.map((menu, index) => (
                <Select.Option key={index} value={menu.id} disabled={menu.is_parent}>
                  {menu.alias}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="remark" label="Remark">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default PermFormUpdate;
