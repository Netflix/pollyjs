import React from 'react';
import {
  List,
  Edit,
  Create,
  Datagrid,
  ReferenceField,
  TextField,
  EditButton,
  ShowButton,
  DisabledInput,
  LongTextInput,
  ReferenceInput,
  SelectInput,
  SimpleForm,
  TextInput,
  Filter,
  Show,
  SimpleShowLayout
} from 'react-admin';

const PostFilter = props => (
  <Filter {...props}>
    <TextInput label="Search" source="q" alwaysOn />
    <ReferenceInput label="User" source="userId" reference="users" allowEmpty>
      <SelectInput optionText="name" />
    </ReferenceInput>
  </Filter>
);

// eslint-disable-next-line react/prop-types
const PostTitle = ({ record }) => {
  return <span>Posts - {record ? `${record.title}` : ''}</span>;
};

export const PostList = props => (
  <List
    title="Posts"
    {...props}
    filters={<PostFilter />}
    sort={{ field: 'title', order: 'ASC' }}
  >
    <Datagrid>
      <ReferenceField
        label="User"
        source="userId"
        reference="users"
        linkType="show"
      >
        <TextField source="name" />
      </ReferenceField>
      <TextField source="title" />
      <TextField source="body" />
      <ShowButton />
      <EditButton />
    </Datagrid>
  </List>
);

export const PostShow = props => (
  <Show title={<PostTitle />} {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <ReferenceField
        label="User"
        source="userId"
        reference="users"
        linkType="show"
      >
        <TextField source="name" />
      </ReferenceField>
      <TextField source="title" />
      <TextField source="body" />
    </SimpleShowLayout>
  </Show>
);

export const PostEdit = props => (
  <Edit title={<PostTitle />} {...props}>
    <SimpleForm>
      <DisabledInput source="id" />
      <ReferenceInput
        label="User"
        source="userId"
        reference="users"
        linkType="show"
      >
        <SelectInput optionText="name" />
      </ReferenceInput>
      <TextInput source="title" />
      <LongTextInput source="body" />
    </SimpleForm>
  </Edit>
);

export const PostCreate = props => (
  <Create {...props}>
    <SimpleForm>
      <ReferenceInput
        label="User"
        source="userId"
        reference="users"
        linkType="show"
      >
        <SelectInput optionText="name" />
      </ReferenceInput>
      <TextInput source="title" />
      <LongTextInput source="body" />
    </SimpleForm>
  </Create>
);
