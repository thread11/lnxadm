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
  const userFormPasswordVisible = useSelector(store.getUserFormPasswordVisible);

  const [form] = Form.useForm();

  async function changePassword() {
    let passwords = form.getFieldsValue();

    let { old_password, new_password, confirm_password } = passwords;
    if (old_password === undefined || old_password.trim() === '') {
      message.info('Old password is required');
      return
    }
    if (new_password === undefined || new_password.trim() === '') {
      message.info('New password is required');
      return
    }
    if (confirm_password === undefined || confirm_password.trim() === '') {
      message.info('Confirm password is required');
      return
    }
    if (confirm_password !== new_password) {
      message.info('Passwords do not match');
      return
    }

    try {
      await api.changePassword(passwords);
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
        title="Change Password"
        centered={true}
        destroyOnClose="true"
        maskStyle={{ opacity: '0.1', animation: 'none' }}
        visible={userFormPasswordVisible}
        okText="Submit"
        onCancel={() => dispatch(store.setUserFormPasswordVisible(false))}
        onOk={() => changePassword()}
      >
        <Form
          form={form}
          layout="horizontal"
          labelCol={{ span: 9 }}
          wrapperCol={{ span: 9 }}
        >
          <Form.Item name="old_password" label={<span className="Required">Old Password</span>}>
            <Input type="password" />
          </Form.Item>

          <Form.Item name="new_password" label={<span className="Required">New Password</span>}>
            <Input type="password" />
          </Form.Item>

          <Form.Item name="confirm_password" label={<span className="Required">Confirm Password</span>}>
            <Input type="password" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default UserFormPassword;
