import React from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Form } from 'antd';
import { Input } from 'antd';
import { Modal } from 'antd';
import { Radio } from 'antd';
import { Select } from 'antd';
import { message } from 'antd';
import api from './api.js';
import store from './store.js';

function MenuFormUpdate() {
  const dispatch = useDispatch();
  const menu = useSelector(store.getMenu);
  const menuFormUpdateVisible = useSelector(store.getMenuFormUpdateVisible);
  const parentMenus = useSelector(store.getParentMenus);

  const [form] = Form.useForm();

  async function updateMenu() {
    let menu = form.getFieldsValue();

    let { code, name } = menu;
    if (code === undefined || code.trim() === '') {
      message.info('Code is required');
      return
    }
    if (name === undefined || name.trim() === '') {
      message.info('Name is required');
      return
    }

    try {
      await api.updateMenu(menu);
      message.success('Request succeeded', 1);
      dispatch(store.setMenuFormUpdateVisible(false));

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

  return (
    <>
      <Modal
        title="Edit Menu"
        centered={true}
        destroyOnClose="true"
        maskStyle={{ opacity: '0.1', animation: 'none' }}
        visible={menuFormUpdateVisible}
        okText="Submit"
        onCancel={() => dispatch(store.setMenuFormUpdateVisible(false))}
        onOk={() => updateMenu()}
      >
        <Form
          form={form}
          layout="horizontal"
          labelCol={{ span: 9 }}
          wrapperCol={{ span: 9 }}
          initialValues={{
            id: menu.id,
            code: menu.code,
            name: menu.name,
            is_virtual: menu.is_virtual,
            remark: menu.remark,
            parent_menu_id: menu.parent_menu_id,
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

          <Form.Item name="is_virtual" label={<span className="Required">Is Virtual</span>}>
            <Radio.Group>
              <Radio value={1}>Yes</Radio>
              <Radio value={0}>No</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item name="parent_menu_id" label="Parent Menu">
            <Select allowClear>
              {parentMenus.map((parentMenu, index) => (
                <Select.Option
                  key={index}
                  value={parentMenu.id}
                  disabled={(menu.id === parentMenu.id || menu.has_children === true) ? true : false}
                >
                  {parentMenu.code} ({parentMenu.name})
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

export default MenuFormUpdate;
