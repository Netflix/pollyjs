export default function pollyTests() {
  it('should not handle any requests when paused', async function() {
    const { server } = this.polly;
    const requests = [];

    server.any().on('request', req => requests.push(req));

    await this.fetchRecord();
    await this.fetchRecord();

    this.polly.pause();
    await this.fetchRecord();
    await this.fetchRecord();

    this.polly.play();
    await this.fetchRecord();

    expect(requests.length).to.equal(3);
    expect(this.polly._requests.length).to.equal(3);
    expect(requests.map(r => r.order)).to.deep.equal([0, 1, 2]);
  });
}
