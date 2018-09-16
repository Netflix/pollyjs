import React from 'react';
import {
  List,
  Datagrid,
  EmailField,
  TextField,
  Show,
  SimpleShowLayout,
  ShowButton
} from 'react-admin';

// eslint-disable-next-line react/prop-types
const UserTitle = ({ record }) => {
  return <span>Users - {record ? `${record.name}` : ''}</span>;
};

export const UserList = props => (
  <List title="Users" {...props} sort={{ field: 'name', order: 'ASC' }}>
    <Datagrid>
      <TextField source="name" />
      <TextField source="username" />
      <EmailField source="email" />
      <ShowButton />
    </Datagrid>
  </List>
);

export const UserShow = props => (
  <Show title={<UserTitle />} {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="username" />
      <EmailField source="email" />
    </SimpleShowLayout>
  </Show>
);
