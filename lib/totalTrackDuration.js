/**
 * calculate total duration of tracks
 * @function totalDuration
 * @param {object} media playlist 
 * @returns total duration in milliseconds
 */
export const totalDuration = (media) => {
  const total = media?.tracks?.items.reduce((prev, current) => {
    return prev + current.track.duration_ms;
  }, 0);
  return total;
};

/**
 * calculate total duration of tracks
 * @function totalAlbumDuration
 * @param {object} media album 
 * @returns total duration in milliseconds
 */
export const totalAlbumDuration = (media) => {
  const total = media?.tracks?.items.reduce((prev, current) => {
    return prev + current.duration_ms;
  }, 0);
  return total;
};
