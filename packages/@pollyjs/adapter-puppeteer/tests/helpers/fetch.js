import { Response } from 'node-fetch';

export default async function fetch() {
  const res = await this.page.evaluate((...args) => {
    // This is run within the browser's context meaning it's using the
    // browser's native window.fetch method.
    return fetch(...args).then((res) => {
      const { url, status, headers } = res;

      return res.text().then((body) => {
        return { url, status, body, headers };
      });
    });
  }, ...arguments);

  return new Response(res.body, res);
}
