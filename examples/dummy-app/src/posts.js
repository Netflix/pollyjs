import React from 'react';
import PropTypes from 'prop-types';
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

const PostTitle = ({ record }) => {
  return <span>Posts - {record ? `${record.title}` : ''}</span>;
};

PostTitle.propTypes = {
  record: PropTypes.PropTypes.shape({
    title: PropTypes.string
  })
};

export const PostList = props => (
  <List
    title="Posts"
    {...props}
    filters={<PostFilter />}
    sort={{ field: 'title', order: 'ASC' }}
  >
    <Datagrid>
      <TextField source="title" />
      <TextField source="body" />
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

export const PostShow = props => (
  <Show title={<PostTitle />} {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="title" />
      <TextField source="body" />
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

export const PostEdit = props => (
  <Edit title={<PostTitle />} {...props}>
    <SimpleForm>
      <DisabledInput source="id" />
      <TextInput source="title" />
      <LongTextInput source="body" />
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

export const PostCreate = props => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="title" />
      <LongTextInput source="body" />
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
