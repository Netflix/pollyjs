export default function getLastHeader({ headers }, name) {
  name = name.toLowerCase();

  for (let i = headers.length - 1; i >= 0; i--) {
    if (headers[i].name === name) {
      return headers[i].value;
    }
  }
}
