import serializeResponseHeaders from '../../src/adapters/xhr/utils/serialize-response-headers';

export default function request(url, obj = {}) {
  return new Promise(resolve => {
    const xhr = new XMLHttpRequest();

    xhr.open(obj.method || 'GET', url);

    if (obj.headers) {
      for (const h in obj.headers) {
        xhr.setRequestHeader(h, obj.headers[h]);
      }
    }

    xhr.onreadystatechange = () =>
      xhr.readyState === XMLHttpRequest.DONE && resolve(xhr);
    xhr.onerror = () => resolve(xhr);

    xhr.send(obj.body);
  }).then(xhr => {
    return new Response(xhr.responseText, {
      status: xhr.status,
      statusText: xhr.statusText,
      headers: serializeResponseHeaders(xhr.getAllResponseHeaders())
    });
  });
}
