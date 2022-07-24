import React from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Form } from 'antd';
import { Modal } from 'antd';
import { Tree } from 'antd';
import { message } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';
import api from './api.js';
import store from './store.js';

function PermList() {
  const dispatch = useDispatch();
  const role = useSelector(store.getRole);
  const perms = useSelector(store.getPerms);
  const permsExtra = useSelector(store.getPermsExtra);
  const permListVisible = useSelector(store.getPermListVisible);

  const [ autoExpandParent, setAutoExpandParent ] = useState(true);
  const [ checkedKeys, setCheckedKeys ] = useState(permsExtra.checked_keys);
  const [ expandedKeys, setExpandedKeys ] = useState(permsExtra.expanded_keys);
  const [ permIds, setPermIds ] = useState(permsExtra.checked_keys);

  async function grantPerm() {
    try {
      await api.grantPerm(role.id, permIds);
      message.success('Request succeeded', 1);
      dispatch(store.setPermListVisible(false));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
    }
  };

  function onCheck(checkedKeys, info) {
    setCheckedKeys(checkedKeys);
    let permIds = info.checkedNodes.filter(node => node.is_leaf === true).map(node => node.key);
    setPermIds(permIds);
  };

  function onExpand(expandedKeys) {
    setExpandedKeys(expandedKeys);
    setAutoExpandParent(false);
  }

  return (
    <>
      <Modal
        title="Grant Permissions"
        centered={true}
        destroyOnClose="true"
        maskStyle={{ opacity: '0.1', animation: 'none' }}
        visible={permListVisible}
        onCancel={() => dispatch(store.setPermListVisible(false))}
        onOk={() => grantPerm()}
      >
        <Form layout="horizontal">
          <Form.Item>
            <Tree
              treeData={perms}
              checkable={true}
              selectable={false}
              checkedKeys={checkedKeys}
              expandedKeys={expandedKeys}
              autoExpandParent={autoExpandParent}
              onCheck={(checkedKeys, info) => onCheck(checkedKeys, info)}
              onExpand={(expandedKeys) => onExpand(expandedKeys)}
              switcherIcon={<CaretDownOutlined className="TreeIcon" />}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default PermList;
