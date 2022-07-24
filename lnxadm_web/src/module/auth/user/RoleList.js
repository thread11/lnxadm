import React from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Checkbox } from 'antd';
import { Form } from 'antd';
import { Modal } from 'antd';
import { message } from 'antd';
import api from './api.js';
import store from './store.js';

function RoleList() {
  const dispatch = useDispatch();
  const user = useSelector(store.getUser);
  const roleListVisible = useSelector(store.getRoleListVisible);
  const roles = useSelector(store.getRoles);
  const rolesExtra = useSelector(store.getRolesExtra);

  const [ roleIds, setRoleIds ] = useState(rolesExtra.checked_keys);

  async function assignRole() {
    try {
      let user_id = user.id;
      let role_ids = roleIds;

      await api.assignRole(user_id, role_ids);
      message.success('Request succeeded', 1);
      dispatch(store.setRoleListVisible(false));

      dispatch(store.setUserTableLoading(true));
      const response = await api.getUsers();
      dispatch(store.setUsers(response.data.data));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      dispatch(store.setUserTableLoading(false));
    }
  };

  function onChange(checkedValues) {
    setRoleIds(checkedValues);
  }

  return (
    <>
      <Modal
        title="Assign Roles"
        centered={true}
        destroyOnClose="true"
        maskStyle={{ opacity: '0.1', animation: 'none' }}
        visible={roleListVisible}
        onCancel={() => dispatch(store.setRoleListVisible(false))}
        onOk={() => assignRole()}
      >
        <div className="CenterDiv">
          <div className="LeftDiv">
            <Form layout="horizontal">
              <Form.Item>
                <Checkbox.Group
                  defaultValue={rolesExtra.checked_keys}
                  onChange={(checkedValues) => onChange(checkedValues)}
                >
                  {roles.map((role, index) => (
                    <div key={index} style={{ lineHeight: '250%' }}>
                      <Checkbox value={role.id}>{role.name}</Checkbox>
                    </div>
                  ))}
                </Checkbox.Group>
              </Form.Item>
            </Form>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default RoleList;
