const fetch = require('node-fetch');

module.exports = async id => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/users/${id}`
  );

  return await response.json();
};
