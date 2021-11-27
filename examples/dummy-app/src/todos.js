import React from 'react';
import PropTypes from 'prop-types';
import {
  List,
  Edit,
  Create,
  Show,
  Datagrid,
  BooleanField,
  ReferenceField,
  TextField,
  DisabledInput,
  SelectInput,
  ShowButton,
  EditButton,
  SimpleForm,
  SimpleShowLayout,
  TextInput,
  BooleanInput,
  ReferenceInput,
  Filter
} from 'react-admin';

const TodoFilter = (props) => (
  <Filter {...props}>
    <TextInput label="Search" source="q" alwaysOn />
    <ReferenceInput label="User" source="userId" reference="users" allowEmpty>
      <SelectInput optionText="name" />
    </ReferenceInput>
  </Filter>
);

const TodoTitle = ({ record }) => {
  return <span>Todos - {record ? `${record.title}` : ''}</span>;
};

TodoTitle.propTypes = {
  record: PropTypes.PropTypes.shape({
    title: PropTypes.string
  })
};

export const TodoList = (props) => (
  <List
    title="Todos"
    {...props}
    filters={<TodoFilter />}
    sort={{ field: 'title', order: 'ASC' }}
  >
    <Datagrid>
      <BooleanField source="completed" />
      <TextField source="title" />
      <ReferenceField
        label="User"
        source="userId"
        reference="users"
        linkType="show"
      >
        <TextField source="name" />
      </ReferenceField>
      <ShowButton />
      <EditButton />
    </Datagrid>
  </List>
);

export const TodoShow = (props) => (
  <Show title={<TodoTitle />} {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="title" />
      <BooleanField source="completed" />
      <ReferenceField
        label="User"
        source="userId"
        reference="users"
        linkType="show"
      >
        <TextField source="name" />
      </ReferenceField>
    </SimpleShowLayout>
  </Show>
);

export const TodoEdit = (props) => (
  <Edit title={<TodoTitle />} {...props}>
    <SimpleForm>
      <DisabledInput source="id" />
      <TextInput source="title" />
      <BooleanInput source="completed" />
      <ReferenceInput
        label="User"
        source="userId"
        reference="users"
        linkType="show"
      >
        <SelectInput optionText="name" />
      </ReferenceInput>
    </SimpleForm>
  </Edit>
);

export const TodoCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="title" />
      <BooleanInput source="completed" />
      <ReferenceInput
        label="User"
        source="userId"
        reference="users"
        linkType="show"
      >
        <SelectInput optionText="name" />
      </ReferenceInput>
    </SimpleForm>
  </Create>
);
