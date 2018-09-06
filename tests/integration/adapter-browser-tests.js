import 'formdata-polyfill';
import File from '../helpers/file';

export default function adapterBrowserTests() {
  it('should handle recording requests posting FormData + Blob/File', async function() {
    const { server, recordingName } = this.polly;
    const form = new FormData();

    form.append('string', recordingName);
    form.append('array', [recordingName, recordingName]);
    form.append('blob', new Blob([recordingName], { type: 'text/plain' }));
    form.append(
      'file',
      new File([recordingName], 'test.txt', { type: 'text/plain' })
    );

    server.post('/submit').intercept((req, res) => {
      const body = req.serializedBody;

      // Make sure the form data exists in the identifiers
      expect(req.identifiers.body).to.include(recordingName);

      expect(body).to.include(`string=${recordingName}`);
      expect(body).to.include(
        `array=${[recordingName, recordingName].toString()}`
      );
      expect(body).to.include(
        `blob=data:text/plain;base64,${btoa(recordingName)}`
      );

      expect(body).to.include(
        `file=data:text/plain;base64,${btoa(recordingName)}`
      );

      res.sendStatus(200);
    });

    const res = await this.fetch('/submit', { method: 'POST', body: form });

    expect(res.status).to.equal(200);
  });

  it('should handle recording requests posting a Blob', async function() {
    const { server, recordingName } = this.polly;

    server.post('/submit').intercept((req, res) => {
      const dataUrl = `data:text/plain;base64,${btoa(recordingName)}`;

      // Make sure the form data exists in the identifiers
      expect(req.identifiers.body).to.equal(dataUrl);

      expect(req.serializedBody).to.equal(dataUrl);

      res.sendStatus(200);
    });

    const res = await this.fetch('/submit', {
      method: 'POST',
      body: new Blob([recordingName], { type: 'text/plain' })
    });

    expect(res.status).to.equal(200);
  });
}
