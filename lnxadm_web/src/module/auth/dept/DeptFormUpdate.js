import React from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Form } from 'antd';
import { Input } from 'antd';
import { Modal } from 'antd';
import { message } from 'antd';
import api from './api.js';
import store from './store.js';

function DeptFormUpdate() {
  const dispatch = useDispatch();
  const dept = useSelector(store.getDept);
  const deptFormUpdateVisible = useSelector(store.getDeptFormUpdateVisible);

  const [form] = Form.useForm();

  async function updateDept() {
    let dept = form.getFieldsValue();

    let { name } = dept;
    if (name === undefined || name.trim() === '') {
      message.info('Name is required');
      return
    }

    try {
      await api.updateDept(dept);
      message.success('Request succeeded', 1);
      dispatch(store.setDeptFormUpdateVisible(false));

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
        title="Edit Department"
        centered={true}
        destroyOnClose="true"
        maskStyle={{ opacity: '0.1', animation: 'none' }}
        visible={deptFormUpdateVisible}
        okText="Submit"
        onCancel={() => dispatch(store.setDeptFormUpdateVisible(false))}
        onOk={() => updateDept()}
      >
        <Form
          form={form}
          layout="horizontal"
          labelCol={{ span: 9 }}
          wrapperCol={{ span: 9 }}
          initialValues={{
            id: dept.id,
            name: dept.name,
            remark: dept.remark,
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

export default DeptFormUpdate;
