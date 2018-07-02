const { keys } = Object;
const REQUEST_ASYNC =
  !('navigator' in global) || !/PhantomJS/.test(global.navigator.userAgent);
const NativeXMLHttpRequest = global.XMLHttpRequest;

export default function ajax(url, options = {}) {
  return new Promise((resolve, reject) => {
    const xhr = new NativeXMLHttpRequest();

    xhr.open(options.method || 'GET', url, REQUEST_ASYNC);

    keys(options.headers || {}).forEach(k =>
      xhr.setRequestHeader(k, options.headers[k])
    );

    xhr.send(options.body);

    if (REQUEST_ASYNC) {
      xhr.onreadystatechange = () => {
        if (xhr.readyState === NativeXMLHttpRequest.DONE) {
          handleResponse(xhr, resolve, reject);
        }
      };

      xhr.onerror = () => reject(xhr);
    } else {
      handleResponse(xhr, resolve, reject);
    }
  });
}

function handleResponse(xhr, resolve, reject) {
  let body = xhr.response || xhr.responseText;

  if (body && typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (e) {
      if (!(e instanceof SyntaxError)) {
        console.error(e);
      }
    }
  }

  return xhr.status >= 200 && xhr.status < 300
    ? resolve({ body, xhr })
    : reject(xhr);
}
