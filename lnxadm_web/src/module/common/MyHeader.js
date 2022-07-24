import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Button } from 'antd';
import { Dropdown } from 'antd';
import { Layout } from 'antd';
import { Menu } from 'antd';
import { Space } from 'antd';
import { message } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { LockOutlined } from '@ant-design/icons';
import { LogoutOutlined } from '@ant-design/icons';
import { MenuFoldOutlined } from '@ant-design/icons';
import { MenuUnfoldOutlined } from '@ant-design/icons';
import { UserOutlined } from '@ant-design/icons';
import UserFormPassword from './UserFormPassword.js';
import UserFormProfile from './UserFormProfile.js';
import api from './api.js';
import store from './store.js';
import styles from './MyHeader.module.less';

function MyHeader() {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const siderCollapsed = useSelector(store.getSiderCollapsed);
  const currentUser = useSelector(store.getCurrentUser);
  const userFormProfileVisible = useSelector(store.getUserFormProfileVisible);
  const userFormPasswordVisible = useSelector(store.getUserFormPasswordVisible);

  useEffect(() => {
    getCurrentUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function changePassword() {
    try {
      dispatch(store.setUserFormPasswordVisible(true));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
    }
  }

  async function getCurrentUser() {
    try {
      const response = await api.getCurrentUser();
      dispatch(store.setCurrentUser(response.data.data));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
    }
  }

  async function logout() {
    try {
      await api.logout();
      dispatch(store.setCurrentUser({}));
      navigate('/login');
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
    }
  }

  function toggleSider() {
    dispatch(store.setSiderCollapsed(!siderCollapsed));
    localStorage.setItem('siderCollapsed', !siderCollapsed);
  }

  async function updateProfile() {
    try {
      const response = await api.getCurrentUser();
      dispatch(store.setCurrentUser(response.data.data));
      dispatch(store.setUserFormProfileVisible(true));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
    }
  }

  return (
    <>
      <Layout.Header className={styles.MyHeader}>
        <div className={styles.MyTrigger}>
          <Button
            type="link"
            onClick={() => toggleSider()}
            style={{ color: 'inherit', height: '48px', fontSize: '18px' }}
          >
            {siderCollapsed === false ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
          </Button>
        </div>

        <div className={styles.MyRight}>
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item key="edit_profile" icon={<EditOutlined />} onClick={() => updateProfile() }>
                  Edit Profile
                </Menu.Item>

                <Menu.Item key="change_password" icon={<LockOutlined />} onClick={() => changePassword() }>
                  Change Password
                </Menu.Item>

                <Menu.Divider />

                <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={() => logout()}>
                  Login Out
                </Menu.Item>
              </Menu>
            }
            placement="bottomRight"
            className={styles.MyAction}
          >
            <Space>
              <UserOutlined />
              {currentUser.nickname}
            </Space>
          </Dropdown>
        </div>
      </Layout.Header>

      {userFormProfileVisible === true && <UserFormProfile />}
      {userFormPasswordVisible === true && <UserFormPassword />}
    </>
  );
}

export default MyHeader;
