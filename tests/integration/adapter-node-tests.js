/* eslint-env node */

export default function adapterNodeTests() {
  it('should handle recording requests posting a Buffer', async function() {
    const { server, recordingName } = this.polly;
    const buffer = Buffer.from(recordingName);

    server.post('/submit').intercept((req, res) => {
      const body = req.identifiers.body;

      // Make sure the buffer exists in the identifiers
      expect(body).to.include(buffer.toString('hex'));

      res.sendStatus(200);
    });

    const res = await this.fetch('/submit', { method: 'POST', body: buffer });

    expect(res.status).to.equal(200);
  });

  it('should handle recording requests posting an ArrayBuffer', async function() {
    const { server } = this.polly;
    const buffer = new ArrayBuffer(8);

    server.post('/submit').intercept((req, res) => {
      const body = req.identifiers.body;

      // Make sure the buffer exists in the identifiers
      expect(body).to.include(Buffer.from(buffer).toString('hex'));

      res.sendStatus(200);
    });

    const res = await this.fetch('/submit', { method: 'POST', body: buffer });

    expect(res.status).to.equal(200);
  });
}
