import dehumanizeTime from '../../../src/utils/dehumanize-time';

describe('Unit | Utils | dehumanizeTime', function() {
  it('should exist', function() {
    expect(dehumanizeTime).to.be.a('function');
  });

  it('should work', function() {
    expect(dehumanizeTime(null)).to.be.NaN;
    expect(dehumanizeTime(undefined)).to.be.NaN;
    expect(dehumanizeTime(true)).to.be.NaN;
    expect(dehumanizeTime(false)).to.be.NaN;

    [
      [['1ms', '1millisecond', '1 milliseconds'], 1],
      [['10ms', '10millisecond', '10 milliseconds'], 10],
      [['100ms', '100millisecond', '100 milliseconds'], 100],
      [['1s', '1sec', '1secs', '1 second', '1 seconds'], 1000],
      [['1.5s', '1.5sec', '1.5secs', '1.5 second', '1.5 seconds'], 1500],
      [['1m', '1min', '1mins', '1 minute', '1 minutes'], 1000 * 60],
      [['1h', '1hr', '1hrs', '1 hour', '1 hours'], 1000 * 60 * 60],
      [['1d', '1day', '1 days'], 1000 * 60 * 60 * 24],
      [['1w', '1wk', '1wks', '1 week', '1 weeks'], 1000 * 60 * 60 * 24 * 7],
      [['1y', '1yr', '1 yrs', '1 year', '1 years'], 1000 * 60 * 60 * 24 * 365],
      [
        [
          '1y 2 wks 3day 4 minutes 5secs 6 ms',
          '6 millisecond 5s 4 min 3d 2 weeks 1yrs'
        ],
        33005045006
      ]
    ].forEach(([inputs, value]) => {
      inputs.forEach(str => expect(dehumanizeTime(str)).to.equal(value));
    });
  });
});
