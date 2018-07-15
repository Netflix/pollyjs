import { Response } from 'node-fetch';

export default function() {
  beforeEach(function() {
    this.fetch = async (...args) => {
      const res = await this.page.evaluate((...args) => {
        // This is run within the browser's context meaning it's using the
        // browser's native window.fetch method.
        return fetch(...args).then(res => {
          const { url, status, headers } = res;

          return res.text().then(body => {
            return { url, status, body, headers };
          });
        });
      }, ...args);

      return new Response(res.body, res);
    };
  });
}
