import React from 'react';
import { Admin, Resource } from 'react-admin';
import jsonServerProvider from 'ra-data-json-server';
import PostIcon from '@material-ui/icons/Book';
import TodoIcon from '@material-ui/icons/ViewList';
import UserIcon from '@material-ui/icons/Group';
import { createMuiTheme } from '@material-ui/core/styles';

import { UserList, UserShow } from './users';
import { TodoList, TodoShow, TodoEdit, TodoCreate } from './todos';
import { PostList, PostShow, PostEdit, PostCreate } from './posts';

const dataProvider = jsonServerProvider('https://jsonplaceholder.typicode.com');
const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#ff5740',
      main: '#e50914',
      dark: '#aa0000',
      contrastText: '#fff'
    },
    secondary: {
      light: '#ff5740',
      main: '#e50914',
      dark: '#aa0000',
      contrastText: '#fff'
    }
  }
});

const App = () => (
  <Admin theme={theme} dataProvider={dataProvider}>
    <Resource
      name="posts"
      list={PostList}
      show={PostShow}
      edit={PostEdit}
      create={PostCreate}
      icon={PostIcon}
    />
    <Resource
      name="todos"
      list={TodoList}
      show={TodoShow}
      edit={TodoEdit}
      create={TodoCreate}
      icon={TodoIcon}
    />
    <Resource name="users" list={UserList} show={UserShow} icon={UserIcon} />
  </Admin>
);

export default App;
