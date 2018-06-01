const labelsToOffset = [
  ['ms', 'millisecond', 'milliseconds', 1],
  ['s', 'sec', 'secs', 'second', 'seconds', 1000],
  ['m', 'min', 'mins', 'minute', 'minutes', 1000 * 60],
  ['h', 'hr', 'hrs', 'hour', 'hours', 1000 * 60 * 60],
  ['d', 'day', 'days', 1000 * 60 * 60 * 24],
  ['w', 'wk', 'wks', 'week', 'weeks', 1000 * 60 * 60 * 24 * 7],
  ['y', 'yr', 'yrs', 'year', 'years', 1000 * 60 * 60 * 24 * 365]
];

const times = labelsToOffset.reduce((accum, labels) => {
  const labelOffset = labels.pop();

  labels.forEach(label => (accum[label] = labelOffset));

  return accum;
}, {});

export default function humanTimeToMilliseconds(humanTimeString) {
  const fragments = (humanTimeString || '')
    .replace(/[\W_]+/g, '') // remove non-alphanumeric characters
    .split(/(\d+)/g);

  fragments.shift();

  const parsedFragments = fragments.reduce((accum, cur, i) => {
    if (i % 2 === 0) {
      accum.push([parseFloat(cur, 10)]);
    } else {
      accum[accum.length - 1].push(cur);
    }

    return accum;
  }, []);

  return parsedFragments.reduce((accum, [num, label]) => {
    accum += num * times[label];

    return accum;
  }, 0);
}
