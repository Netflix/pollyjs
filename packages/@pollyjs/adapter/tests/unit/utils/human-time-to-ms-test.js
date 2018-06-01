import humanTimeToMilliseconds from '../../../src/utils/human-time-to-ms';

describe('Unit | Utils | humanTimeToMilliseconds', function() {
  it('should exist', function() {
    expect(humanTimeToMilliseconds).to.be.a('function');
  });

  it('should work', function() {
    [
      [[undefined, null, ''], 0],
      [['1ms', '1millisecond', '1 milliseconds'], 1],
      [['1s', '1sec', '1secs', '1 second', '1 seconds'], 1000],
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
      inputs.forEach(str =>
        expect(humanTimeToMilliseconds(str)).to.equal(value)
      );
    });
  });
});
