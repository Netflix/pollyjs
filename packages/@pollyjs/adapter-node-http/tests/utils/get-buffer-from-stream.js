export default function getBufferFromStream(stream) {
  return new Promise(resolve => {
    const chunks = [];

    stream.on('data', chunk => {
      chunks.push(chunk);
    });

    stream.on('end', () => {
      resolve(Buffer.concat(chunks));
    });
  });
}
