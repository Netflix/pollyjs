import { URL } from '@pollyjs/utils';

export default function commonTests() {
  it('should support URL instances', async function() {
    const { server } = this.polly;

    server.any(this.recordUrl()).intercept((_, res) => res.sendStatus(200));

    const res = await this.fetch(new URL(this.recordUrl()));

    expect(res.status).to.equal(200);
  });
}
