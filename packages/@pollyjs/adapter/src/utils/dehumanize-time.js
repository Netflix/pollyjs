const ALPHA_NUMERIC_DOT = /([0-9.]+)([a-zA-Z]+)/g;
const TIMES = {
  ms: 1,
  millisecond: 1,
  milliseconds: 1,
  s: 1000,
  sec: 1000,
  secs: 1000,
  second: 1000,
  seconds: 1000,
  m: 60000,
  min: 60000,
  mins: 60000,
  minute: 60000,
  minutes: 60000,
  h: 3600000,
  hr: 3600000,
  hrs: 3600000,
  hour: 3600000,
  hours: 3600000,
  d: 86400000,
  day: 86400000,
  days: 86400000,
  w: 604800000,
  wk: 604800000,
  wks: 604800000,
  week: 604800000,
  weeks: 604800000,
  y: 31536000000,
  yr: 31536000000,
  yrs: 31536000000,
  year: 31536000000,
  years: 31536000000
};

export default function dehumanizeTime(input) {
  if (typeof input !== 'string') {
    return NaN;
  }

  const parts = input.replace(/ /g, '').match(ALPHA_NUMERIC_DOT);
  const sets = parts.map(part => part.split(ALPHA_NUMERIC_DOT).filter(o => o));

  return sets.reduce((accum, [number, unit]) => {
    return accum + parseFloat(number) * TIMES[unit];
  }, 0);
}
