/**
 * takes a duration & converts into mins/seconds
 * @function millisToMinutesAndSeconds
 * @param {number} millis in milliseconds
 * @returns {string} example 5:00
 */
export function millisToMinutesAndSeconds(millis) {
  const minutes = Math.floor(millis / 60000);
  const seconds = ((millis % 60000) / 1000).toFixed(0);
  return seconds == 60
    ? minutes + 1 + ':00'
    : minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
}

/**
 * takes a duration & converts into hrs/mins/secs or if more than an hour
 * then just hrs/mins
 * @function msToTime
 * @param {number} duration in milliseconds
 * @returns {string} hour/mins/secs or hour/mins (example: 1 hrs 6 mins 20secs)
 */
export function msToTime(duration) {
  let minutes = Math.floor((duration / (1000 * 60)) % 60);
  let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
  let seconds = Math.floor((duration / 1000) % 60);

  if (hours > 0) {
    return (
      hours +
      (hours > 1 ? ' hrs ' : ' hr ') +
      minutes +
      (minutes > 1 ? ' mins' : ' min')
    );
  } else {
    return (
      minutes +
      (minutes > 1 ? ' mins ' : ' min ') +
      seconds +
      (seconds > 1 ? ' secs' : ' sec')
    );
  }
}

/**
 * takes a duration & converts into minutes only
 * @function millisecondsToMinutes
 * @param {number} milliseconds in milliseconds
 * @returns {string} minutes (example: 6 mins)
 */
export const millisecondsToMinutes = (milliseconds) => {
  const minutes = milliseconds / 60000; // There are 60000 milliseconds in a minute
  const roundedMinutes = Math.round(minutes);
  return roundedMinutes + (roundedMinutes > 1 ? ' mins ' : ' min ');
};

/**
 * format a date to month & year
 * @function getMonthYear
 * @param {string} date 
 * @returns {string} formatted: Apr 2023
 */
export const getMonthYear = (date) => {
  // Split the date into year, month, and day
  const [year, month, day] = date.split('-');
  // Format the month and year
  const formattedMonth = new Date(date).toLocaleString('default', {
    month: 'short',
  });
  const monthYear = `${formattedMonth} ${year}`;
  return monthYear;
};

/**
 * format a date to month, day & year
 * @function getMonthDayYear
 * @param {string} date 
 * @returns {string} formatted: Jan 25, 2023
 */
export const getMonthDayYear = (date) => {
  const [year, month, day] = date.split('-');
  const formattedMonth = new Date(date).toLocaleString('default', {
    month: 'short',
  });
  const formattedDay = parseInt(day);
  // Concatenate the formatted components
  const monthYear = `${formattedMonth} ${formattedDay}, ${year}`;
  return monthYear;
};
