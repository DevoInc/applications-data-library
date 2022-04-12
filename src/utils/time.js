/**
 * @module utils/time
 */

import user from '@devoinc/applications-data-library/utils/user';

const ms = 1000;
const units = { s: ms, m: 60 * ms, h: 60 * 60 * ms, d: 24 * 60 * 60 * ms };
const parseUnits = {
  s: 'second',
  m: 'minute',
  h: 'hour',
  d: 'day',
  second: 'second',
  minute: 'minute',
  hour: 'hour',
  day: 'day',
  seconds: 'second',
  minutes: 'minute',
  hours: 'hour',
  days: 'day',
};
const parseUnitsCode = {
  s: 's',
  m: 'm',
  h: 'h',
  d: 'd',
  second: 's',
  minute: 'm',
  hour: 'h',
  day: 'd',
  seconds: 's',
  minutes: 'm',
  hours: 'h',
  days: 'd',
};

/**
 * Generate the time periods array
 * @param {Number} start The start timestamp
 * @param {Number} end The end timestamp
 * @param {String} period The period as: '1d', '1days', ...
 * @param {String} midnight The start timestamp as midnight
 * @return {Array} Array of the periods
 */
function genTimePeriods(start, end, period = '1d', midnight = null) {
  if (midnight === null) midnight = start;
  period = parsePeriod(period);

  // Change: here we work with moment.js objects instead of with
  // unix epochs because moment js correctly takes into account the daylight
  // saving time stuff when we do time arithmetic below.
  let current = moment(start).tz(user.getTimezone());
  let momentEnd = moment(end).tz(user.getTimezone());
  if (period.code === 'd') {
    current = current.startOf('day');
    momentEnd = momentEnd.startOf('day');
  }
  let result = [];

  while (current <= momentEnd) {
    result.push(current.valueOf());
    current.add(period.step, 'milliseconds');
  }

  return result;
}

/**
 * Parse period to object with the period decomposed
 * @param {String} period Period as string
 * @return {Object} Object of decomposed period
 */
function parsePeriod(period = '1d') {
  let parts = period.split(/(\d+)?([smhd])/);
  let num = parseInt(parts[1]) || 1;
  return {
    source: period, // '1d'
    num,
    code: parseUnitsCode[parts[2]], // 'd'
    unit: parseUnits[parts[2]], // 'day'
    step: units[parseUnitsCode[parts[2]]] * num, // 24 * 60 * 60 * 1000 * num
  };
}

export default {
  ms,
  units,
  parseUnits,
  genTimePeriods,
  parsePeriod,
};
