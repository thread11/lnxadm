import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Form } from 'antd';
import { Input } from 'antd';
import { Modal } from 'antd';
import { message } from 'antd';
import api from './api.js';
import store from './store.js';

function UserFormPassword() {
  const dispatch = useDispatch();
  const user = useSelector(store.getUser);
  const userFormPasswordVisible = useSelector(store.getUserFormPasswordVisible);

  const [form] = Form.useForm();

  async function resetPassword() {
    let user = form.getFieldsValue();

    let { password } = user;
    if (password === undefined || password.trim() === '') {
      message.info('Password is required');
      return
    }

    try {
      await api.resetPassword(user);
      message.success('Request succeeded', 1);
      dispatch(store.setUserFormPasswordVisible(false));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
    }
  };

  return (
    <>
      <Modal
        title="Reset Password"
        centered={true}
        destroyOnClose="true"
        maskStyle={{ opacity: '0.1', animation: 'none' }}
        visible={userFormPasswordVisible}
        okText="Submit"
        onCancel={() => dispatch(store.setUserFormPasswordVisible(false))}
        onOk={() => resetPassword()}
      >
        <Form
          form={form}
          layout="horizontal"
          labelCol={{ span: 9 }}
          wrapperCol={{ span: 9 }}
          initialValues={{
            id: user.id,
            username: user.username,
            nickname: user.nickname,
          }}
        >
          <Form.Item name="id" label="ID" style={{ display: 'none' }}>
            <Input />
          </Form.Item>

          <Form.Item name="username" label="Username">
            <Input disabled={true} />
          </Form.Item>

          <Form.Item name="nickname" label="Password">
            <Input disabled={true} />
          </Form.Item>

          <Form.Item name="password" label={<span className="Required">Password</span>}>
            <Input type='password' />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default UserFormPassword;
