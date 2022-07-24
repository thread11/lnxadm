import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Form } from 'antd';
import { Input } from 'antd';
import { Modal } from 'antd';
import { message } from 'antd';
import api from './api.js';
import store from './store.js';

function UserFormProfile() {
  const dispatch = useDispatch();
  const currentUser = useSelector(store.getCurrentUser);
  const userFormProfileVisible = useSelector(store.getUserFormProfileVisible);

  const [form] = Form.useForm();

  async function updateProfile() {
    let profile = form.getFieldsValue();

    let { nickname, email } = profile;
    if (nickname === undefined || nickname.trim() === '') {
      message.info('Nickname is required');
      return
    }
    if (email === undefined || email.trim() === '') {
      message.info('Email is required');
      return
    }

    try {
      await api.updateProfile(profile);
      message.success('Request succeeded', 1);
      dispatch(store.setUserFormProfileVisible(false));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
    }
  };

  return (
    <>
      <Modal
        title="Edit Profile"
        centered={true}
        destroyOnClose="true"
        maskStyle={{ opacity: '0.1', animation: 'none' }}
        visible={userFormProfileVisible}
        onCancel={() => dispatch(store.setUserFormProfileVisible(false))}
        onOk={() => updateProfile()}
      >
        <Form
          form={form}
          layout="horizontal"
          labelCol={{ span: 9 }}
          wrapperCol={{ span: 9 }}
          initialValues={{
            username: currentUser.username,
            nickname: currentUser.nickname,
            email: currentUser.email,
          }}
        >
          <Form.Item name="id" label="ID" style={{ display: 'none' }}>
            <Input />
          </Form.Item>

          <Form.Item name="username" label="Username">
            <Input disabled />
          </Form.Item>

          <Form.Item name="nickname" label={<span className="Required">Nickname</span>}>
            <Input />
          </Form.Item>

          <Form.Item name="email" label={<span className="Required">Email</span>}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default UserFormProfile;
