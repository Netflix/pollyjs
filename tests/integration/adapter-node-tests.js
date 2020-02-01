/* eslint-env node */

export default function adapterNodeTests() {
  it('should handle recording requests posting a Buffer', async function() {
    const { server, recordingName } = this.polly;
    const buffer = Buffer.from(recordingName);
    const url = `http://example.com/upload`;

    server.post(url).intercept((req, res) => {
      const body = req.identifiers.body;

      // Make sure the buffer exists in the identifiers
      expect(body).to.include(buffer.toString());

      res.sendStatus(200);
    });

    const res = await this.fetch(url, { method: 'POST', body: buffer });

    expect(res.status).to.equal(200);
  });

  it('should handle recording requests posting an ArrayBuffer', async function() {
    const { server } = this.polly;
    const buffer = new ArrayBuffer(8);
    const url = `http://example.com/upload`;

    server.post(url).intercept((req, res) => {
      const body = req.identifiers.body;

      // Make sure the buffer exists in the identifiers
      expect(body).to.include(Buffer.from(buffer).toString());

      res.sendStatus(200);
    });

    const res = await this.fetch(url, { method: 'POST', body: buffer });

    expect(res.status).to.equal(200);
  });
}
