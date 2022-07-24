// import { useEffect } from 'react';
import { Route } from 'react-router-dom';
import { Routes } from 'react-router-dom';
// import { useLocation } from 'react-router-dom';
import { Modal } from 'antd';
import { message } from 'antd';
import MyLayout from './module/common/MyLayout.js';
import Login from './module/common/Login.js';
import Test from './module/test/Test.js';
import history from './global/history.js';
import './App.css';
import './App.less';

history.listen(() => {
  // https://ant.design/components/modal/#Modal.method()
  Modal.destroyAll();
});

message.config({ duration: 2, maxCount: 5 });

function App() {
  /*
  let location = useLocation();

  useEffect(() => {
    // https://ant.design/components/modal/#Modal.method()
    Modal.destroyAll();
  }, [location.pathname]);
  */

  return (
    <>
      <Routes>
        <Route path="/*" element={<MyLayout />} />
        <Route path="/login" element={<Login />} exact />
        <Route path="/test" element={<Test />} exact />
      </Routes>
    </>
  );
}

export default App;
