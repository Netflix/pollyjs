import Event from '../../../src/-private/event';

const EVENT_TYPE = 'foo';

describe('Unit | Event', function() {
  it('should exist', function() {
    expect(Event).to.be.a('function');
  });

  it('should throw if no type is specified', function() {
    expect(() => new Event()).to.throw(Error, /Invalid type provided/);
  });

  it('should have the correct defaults', function() {
    const event = new Event(EVENT_TYPE);

    expect(event.type).to.equal(EVENT_TYPE);
    expect(event.shouldStopPropagating).to.be.false;
  });

  it('should not be able to edit the type', function() {
    const event = new Event(EVENT_TYPE);

    expect(event.type).to.equal(EVENT_TYPE);
    expect(() => (event.type = 'bar')).to.throw(Error);
  });

  it('should be able to attach any other properties', function() {
    const event = new Event(EVENT_TYPE, { foo: 1, bar: 2 });

    expect(event.foo).to.equal(1);
    expect(event.bar).to.equal(2);
  });

  it('.stopPropagation()', function() {
    const event = new Event(EVENT_TYPE);

    expect(event.shouldStopPropagating).to.be.false;
    event.stopPropagation();
    expect(event.shouldStopPropagating).to.be.true;
  });
});
