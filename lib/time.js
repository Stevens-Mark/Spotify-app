export function millisToMinutesAndSeconds(millis) {
  const minutes = Math.floor(millis / 60000);
  const seconds = ((millis % 60000) / 1000).toFixed(0);
  return seconds == 60
    ? minutes + 1 + ':00'
    : minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
}

export function msToTime(duration) {
  let seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  return (
    (hours == 0 ? '' : hours + (hours < 1 ? ' hrs ' : ' hr ')) +
    minutes +
    (minutes > 1 ? ' mins ' : ' min ') +
    seconds +
    (seconds > 1 ? ' secs ' : ' sec ')
  );
}
