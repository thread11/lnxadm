import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Layout } from 'antd';
import { Menu } from 'antd';
import { Space } from 'antd';
import { SafetyOutlined } from '@ant-design/icons';
import { SettingOutlined } from '@ant-design/icons';
import store from './store.js';
import styles from './MySider.module.css';

function MySider() {
  const siderCollapsed = useSelector(store.getSiderCollapsed);

  return (
    <>
      <Layout.Sider
        trigger={null}
        collapsible
        collapsed={siderCollapsed}
        collapsedWidth="48px"
        width="208px"
        className={styles.MySider}
      >
        <div className={styles.SiteInfo}>
          <Link to="/">
            <Space>
              <img src="logo192.png" alt="" className={styles.SiteLogo} />
              {siderCollapsed === false && <span className={styles.SiteTitle}>Linux Admin</span>}
            </Space>
          </Link>
        </div>

        <Menu
          mode="inline"
          theme="dark"
          defaultOpenKeys={siderCollapsed === false ? ['auth', 'system'] : []}
          defaultSelectedKeys={['1']}
        >
          <Menu.SubMenu key="auth" title="Auth" icon={<SafetyOutlined />}>
            <Menu.Item key="dept"><Link to="/auth/depts">Departments</Link></Menu.Item>
            <Menu.Item key="user"><Link to="/auth/users">Users</Link></Menu.Item>
            <Menu.Item key="role"><Link to="/auth/roles">Roles</Link></Menu.Item>
            <Menu.Item key="perm"><Link to="/auth/perms">Permissions</Link></Menu.Item>
            <Menu.Item key="menu"><Link to="/auth/menus">Menus</Link></Menu.Item>
          </Menu.SubMenu>

          <Menu.SubMenu key="system" title="System" icon={<SettingOutlined />}>
            <Menu.Item key="log"><Link to="/system/logs">Logs</Link></Menu.Item>
          </Menu.SubMenu>
        </Menu>
      </Layout.Sider>
    </>
  );
}

export default MySider;
