// needed for function
import {
  differenceInMonths,
  differenceInDays,
  format,
  formatDistanceToNow,
  parseISO,
} from 'date-fns';

/**
 * takes a duration & converts into mins/seconds
 * @function millisToMinutesAndSeconds
 * @param {number} millis in milliseconds
 * @returns {string} example 5:00
 */
export const millisToMinutesAndSeconds = (millis) => {
  const minutes = Math.floor(millis / 60000);
  const seconds = ((millis % 60000) / 1000).toFixed(0);
  return seconds == 60
    ? minutes + 1 + ':00'
    : minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
};

/**
 * takes a duration & converts into hrs/mins/secs or if more than an hour
 * then just hrs/mins
 * @function msToTime
 * @param {number} duration in milliseconds
 * @returns {string} hour/mins/secs or hour/mins (example: 1 hrs 6 mins 20secs)
 */
export const msToTime = (duration) => {
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
};

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
  if (date === undefined) return;
  // Split the date into year, month, and day
  const [year, month, day] = date?.split('-');
  // Format the month and year
  const formattedMonth = new Date(date).toLocaleString('default', {
    month: 'short',
  });
  const monthYear = `${formattedMonth} ${year}`;
  return monthYear;
};

/**
 * function to display the time elapsed in a human-readable format like "1 hour ago", "2 days ago", etc.,
 * @function formatDateToTimeElapsed
 * @param {string} date
 * @returns {string} formatted date
 */
export const formatCustomDistance = (date) => {
  const now = new Date();
  const monthsAgo = differenceInMonths(now, date);

  if (monthsAgo > 0) {
    // If more than 1 month, display the full date
    return format(date, 'MMM d, yyyy');
  }

  const daysAgo = differenceInDays(now, date);

  if (daysAgo >= 7) {
    // If more than 7 days, display the number of weeks ago
    const weeksAgo = Math.floor(daysAgo / 7);
    return weeksAgo === 1 ? '1 week ago' : `${weeksAgo} weeks ago`;
  } else if (daysAgo > 1) {
    // For periods less than 7 days, show relative time like "1 day ago", "2 days ago", etc.
    return `${daysAgo} days ago`;
  }

  // For periods within the last 1 day, show the relative time
  const timeAgoString = formatDistanceToNow(date, {
    addSuffix: true,
    includeSeconds: true,
  });

  // Remove the "about" prefix from the relative time string
  return timeAgoString.replace(/^about\s/, '');
};

export const formatDateToTimeElapsed = (date) => {
  if (!date) return;

  const parsedDate = parseISO(date);
  return formatCustomDistance(parsedDate);
};

/**
 * format a date to month, day & year
 * @function getMonthDayYear
 * @param {string} date
 * @returns {string} formatted: Jan 25, 2023
 */
export const getMonthDayYear = (date) => {
  if (date === undefined) return;
  const [year, month, day] = date?.split('-');
  const formattedMonth = new Date(date).toLocaleString('default', {
    month: 'short',
  });
  const formattedDay = parseInt(day);
  // Concatenate the formatted components
  const monthYear = `${formattedMonth} ${formattedDay}, ${year}`;
  return monthYear;
};
