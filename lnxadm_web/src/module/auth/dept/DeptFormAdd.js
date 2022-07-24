import React from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Form } from 'antd';
import { Input } from 'antd';
import { Modal } from 'antd';
import { message } from 'antd';
import api from './api.js';
import store from './store.js';

function DeptFormAdd() {
  const dispatch = useDispatch();
  const deptFormAddVisible = useSelector(store.getDeptFormAddVisible);

  const [form] = Form.useForm();

  async function addDept() {
    let dept = form.getFieldsValue();

    let { name } = dept;
    if (name === undefined || name.trim() === '') {
      message.info('Name is required');
      return
    }

    try {
      await api.addDept(dept);
      message.success('Request succeeded', 1);
      dispatch(store.setDeptFormAddVisible(false));

      dispatch(store.setDeptTableLoading(true));
      const response = await api.getDepts();
      dispatch(store.setDepts(response.data.data));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      dispatch(store.setDeptTableLoading(false));
    }
  };

  return (
    <>
      <Modal
        title="New Department"
        centered={true}
        destroyOnClose="true"
        maskStyle={{ opacity: '0.1', animation: 'none' }}
        visible={deptFormAddVisible}
        onCancel={() => dispatch(store.setDeptFormAddVisible(false))}
        okText="Submit"
        onOk={() => addDept()}
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

export default DeptFormAdd;
