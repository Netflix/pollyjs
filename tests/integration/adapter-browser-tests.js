import 'formdata-polyfill';
import File from '../helpers/file';

export default function adapterBrowserTests() {
  it('should handle recording requests posting FormData + Blob/File', async function() {
    const { server } = this.polly;
    const form = new FormData();
    const content = 'static content';

    form.append('string', content);
    form.append('array', [content, content]);
    form.append('blob', new Blob([content], { type: 'text/plain' }));
    form.append(
      'file',
      new File([content], 'test.txt', { type: 'text/plain' })
    );

    server.post('/submit').intercept((req, res) => {
      const body = req.identifiers.body;

      // Make sure the form data exists in the identifiers
      expect(body).to.include(content);
      expect(body).to.include(`string=${content}`);
      expect(body).to.include(`array=${[content, content].toString()}`);
      expect(body).to.include(`blob=data:text/plain;base64,${btoa(content)}`);
      expect(body).to.include(`file=data:text/plain;base64,${btoa(content)}`);

      // Note: if the ID ever changes, it means a bug or a breaking change
      expect(req.id).to.equal('a7bc24c95697d26a0a24df53bf70d9dc');

      res.sendStatus(200);
    });

    const res = await this.fetch('/submit', { method: 'POST', body: form });

    expect(res.status).to.equal(200);
  });

  it('should handle recording requests posting a Blob', async function() {
    const { server } = this.polly;
    const content = 'static content';
    const contentType = 'text/plain;charset=utf-8';

    server.post('/submit').intercept((req, res) => {
      const dataUrl = `data:text/plain;base64,${btoa(content)}`;

      // Make sure the form data exists in the identifiers
      expect(req.identifiers.body).to.equal(dataUrl);

      // Make sure content-type header exists as an identifier
      expect(req.identifiers.headers).to.have.own.property('content-type');
      expect(req.identifiers.headers['content-type']).to.equal(contentType);

      // Note: if the ID ever changes, it means a bug or a breaking change
      expect(req.id).to.equal('bcd8a476d0c948c543a6f50660b6037b');

      res.sendStatus(200);
    });

    const res = await this.fetch('/submit', {
      method: 'POST',
      body: new Blob([content], { type: 'text/plain' }),
      headers: {
        'content-type': contentType
      }
    });

    expect(res.status).to.equal(200);
  });
}
