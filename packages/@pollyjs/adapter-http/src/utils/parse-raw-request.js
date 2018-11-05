const parseHeader = line => {
  const splits = line.split(':');
  const name = splits[0];
  const value = splits[1].trim();

  return { name, value };
};

export default function parseRawRequest(input) {
  const lines = input.join('\r\n').split('\r\n');

  const result = lines.reduce(
    (acc, line) => {
      const { req, state } = acc;

      if (!state.isMethodReceived) {
        const splits = line.split(' ');

        req.method = splits[0];
        req.path = splits[1];
        state.isMethodReceived = true;
      } else if (!state.isConnectionClosed) {
        const header = parseHeader(line);

        if (header.name === 'Connection' && header.value === 'close') {
          state.isConnectionClosed = true;
        } else {
          req.headers[header.name] = header.value;
        }
      } else {
        req.body += line;
      }

      return acc;
    },
    {
      req: {
        method: 'GET',
        path: '',
        headers: {},
        body: ''
      },
      state: {
        isMethodReceived: false,
        isConnectionClosed: false
      }
    }
  );

  return result.req;
}
