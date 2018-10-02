const path = require('path');

const { Polly } = require('@pollyjs/core');
const FetchAdapter = require('@pollyjs/adapter-fetch');
const FSPersister = require('@pollyjs/persister-fs');

Polly.register(FetchAdapter);
Polly.register(FSPersister);

const { posts, users } = require('../src');

describe('src', () => {
  const polly = new Polly('jsonplaceholder', {
    adapters: ['fetch'],
    persister: 'fs',
    persisterOptions: {
      fs: {
        recordingsDir: path.resolve(__dirname, '../__recordings__')
      }
    }
  });

  afterAll(async () => {
    await polly.stop();
  });

  describe('posts', () => {
    it('should return post', async () => {
      const post = await posts('1');

      expect(post.id).toBe(1);
      expect(post.title).toBe('sunt aut facere repellat provident occaecati excepturi optio reprehenderit');
    });
  });

  describe('users', () => {
    it('should return user', async () => {
      const user = await users('1');

      expect(user.id).toBe(1);
      expect(user.name).toBe('Leanne Graham');
      expect(user.email).toBe('Sincere@april.biz');
    });
  });
});
