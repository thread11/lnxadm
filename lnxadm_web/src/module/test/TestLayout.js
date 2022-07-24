import React from 'react';
import { Layout } from 'antd';
import MyContent from '../common/MyContent.js';
import MyHeader from '../common/MyHeader.js';
import MySider from '../common/MySider.js';
import MyFooter from '../common/MyFooter.js';
import '../common/MyLayout.css';

function TestLayout() {
  return (
    <Layout className="MyLayout">
      <MySider />

      <Layout>
        <MyHeader />

        <MyContent />

        <MyFooter />
      </Layout>
    </Layout>
  );
}

export default TestLayout;
