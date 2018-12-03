import getResponseFromRequest from './get-response-from-request';
import calculateHashFromStream from './calculate-hash-from-stream';

export default function testBinaryDownload(transport) {
  const { protocol } = transport.globalAgent;
  const url = `${protocol}//via.placeholder.com/150/92c952`;

  it('should be able to download binary content', async function() {
    const { server } = this.polly;

    server.get(url).passthrough(true);

    const nativeResponseStream = await getResponseFromRequest(
      transport.request(url)
    );

    server.get(url).passthrough(false);

    const recordedResponseStream = await getResponseFromRequest(
      transport.request(url)
    );

    const [nativeHash, recordedHash] = await Promise.all([
      calculateHashFromStream(nativeResponseStream),
      calculateHashFromStream(recordedResponseStream)
    ]);

    expect(nativeHash).to.equal(recordedHash);
  });
}
