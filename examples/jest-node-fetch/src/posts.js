const fetch = require('node-fetch');

module.exports = async (id) => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${id}`
  );

  return await response.json();
};
