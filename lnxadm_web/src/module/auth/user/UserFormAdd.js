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

function UserFormAdd() {
  const dispatch = useDispatch();
  const userFormAddVisible = useSelector(store.getUserFormAddVisible);
  const depts = useSelector(store.getDepts);

  const [form] = Form.useForm();

  async function addUser() {
    let user = form.getFieldsValue();

    let { username, password, nickname } = user;
    if (username === undefined || username.trim() === '') {
      message.info('Username is required');
      return
    }
    if (password === undefined || password.trim() === '') {
      message.info('Password is required');
      return
    }
    if (nickname === undefined || nickname.trim() === '') {
      message.info('Nickname is required');
      return
    }

    try {
      await api.addUser(user);
      message.success('Request succeeded', 1);
      dispatch(store.setUserFormAddVisible(false));

      dispatch(store.setUserTableLoading(true));
      const response = await api.getUsers();
      dispatch(store.setUsers(response.data.data));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      dispatch(store.setUserTableLoading(false));
    }
  };

  return (
    <>
      <Modal
        title="New User"
        centered={true}
        destroyOnClose="true"
        maskStyle={{ opacity: '0.1', animation: 'none' }}
        visible={userFormAddVisible}
        okText="Submit"
        onCancel={() => dispatch(store.setUserFormAddVisible(false))}
        onOk={() => addUser()}
      >
        <Form
          form={form}
          layout="horizontal"
          labelCol={{ span: 9 }}
          wrapperCol={{ span: 9 }}
          initialValues={{
            is_admin: 0,
          }}
        >
          <Form.Item name="username" label={<span className="Required">Username</span>}>
            <Input />
          </Form.Item>

          <Form.Item name="password" label={<span className="Required">Password</span>}>
            <Input type='password' />
          </Form.Item>

          <Form.Item name="nickname" label={<span className="Required">Nickname</span>}>
            <Input />
          </Form.Item>

          <Form.Item name="email" label="Email">
            <Input />
          </Form.Item>

          <Form.Item name="phone" label="Phone">
            <Input />
          </Form.Item>

          <Form.Item name="is_admin" label={<span className="Required">Is Admin</span>}>
            <Radio.Group>
              <Radio value={1}>Yes</Radio>
              <Radio value={0}>No</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item name="dept_id" label="Department">
            <Select allowClear>
              {depts.map((dept, index) => <Select.Option key={index} value={dept.id}>{dept.name}</Select.Option>)}
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

export default UserFormAdd;
