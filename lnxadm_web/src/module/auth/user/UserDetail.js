import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Button } from 'antd';
import { Form } from 'antd';
import { Modal } from 'antd';
import store from './store.js';

function UserDetail() {
  const dispatch = useDispatch();
  const user = useSelector(store.getUser);
  const userDetailVisible = useSelector(store.getUserDetailVisible);

  return (
    <>
      <Modal
        title="User Detail"
        centered={true}
        destroyOnClose="true"
        maskStyle={{ opacity: '0.1', animation: 'none' }}
        visible={userDetailVisible}
        onCancel={() => dispatch(store.setUserDetailVisible(false))}
        footer={[
          <Button key="close" onClick={() => dispatch(store.setUserDetailVisible(false))}>Close</Button>,
        ]}
      >
        <Form layout="horizontal" labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} className="MyForm">
          <Form.Item label="ID">{user.id}</Form.Item>
          <Form.Item label="Username">{user.username}</Form.Item>
          <Form.Item label="Nickname">{user.nickname}</Form.Item>
          <Form.Item label="Email">{user.email}</Form.Item>
          <Form.Item label="Phone">{user.phone}</Form.Item>
          <Form.Item label="Is Admin">{user.is_admin === 1 ? 'Yes' : 'No'}</Form.Item>
          <Form.Item label="Is Active">{user.is_active === 1 ? 'Yes' : 'No'}</Form.Item>
          <Form.Item label="Remark">{user.remark}</Form.Item>
          <Form.Item label="Created At">{user.create_time}</Form.Item>
          <Form.Item label="Updated At">{user.update_time}</Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default UserDetail;
