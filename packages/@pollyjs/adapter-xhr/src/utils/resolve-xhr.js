export default function resolveXhr(xhr, body) {
  return new Promise(resolve => {
    xhr.send(body);

    if (xhr.async) {
      const { onreadystatechange } = xhr;

      xhr.onreadystatechange = (...args) => {
        onreadystatechange && onreadystatechange.apply(xhr, ...args);
        xhr.readyState === XMLHttpRequest.DONE && resolve();
      };
    } else {
      resolve();
    }
  });
}
