const path = require('path');

const { Polly } = require('@pollyjs/core');
const { setupPolly } = require('setup-polly-jest');
const NodeHttpAdapter = require('@pollyjs/adapter-node-http');
const FSPersister = require('@pollyjs/persister-fs');

Polly.register(NodeHttpAdapter);
Polly.register(FSPersister);

const { posts, users } = require('../src');

describe('jest-node-fetch', () => {
  setupPolly({
    adapters: ['node-http'],
    persister: 'fs',
    persisterOptions: {
      fs: {
        recordingsDir: path.resolve(__dirname, '../__recordings__')
      }
    }
  });

  describe('posts', () => {
    it('should return post', async () => {
      const post = await posts('1');

      expect(post.id).toBe(1);
      expect(post.title).toBe(
        'sunt aut facere repellat provident occaecati excepturi optio reprehenderit'
      );
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
