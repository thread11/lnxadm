import React from 'react';
import { useSelector } from 'react-redux';
import { Route } from 'react-router-dom';
import { Routes } from 'react-router-dom';
import { Layout } from 'antd';
import MyFooter from './MyFooter.js';
import MyHeader from './MyHeader.js';
import MySider from './MySider.js';
import routes from '../../global/routes.js';
import store from './store.js';
import styles from './MyLayout.module.css';

function MyLayout() {
  const siderCollapsed = useSelector(store.getSiderCollapsed);

  return (
    <>
      <Layout className={styles.MyLayout}>
        <MySider />

        <Layout style={{ marginLeft: siderCollapsed === false ? '208px' : '48px' }}>
          <MyHeader />

          <Routes>
            {routes.map((route, key) => (
              <Route key={key} path={route.path} element={<route.component />} exact />
            ))}
          </Routes>

          <MyFooter />
        </Layout>
      </Layout>
    </>
  );
}

export default MyLayout;
