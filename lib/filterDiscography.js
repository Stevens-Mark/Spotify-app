/**
 * filter artists discography by type of records (used on artist page)
 * @function filterDiscography
 * @param {array} array of albums/singles
 * @param {string} type albms/singles
 * @returns filtered array
 */
export const filterDiscography = (array, type) => {
  return array?.filter((item) => item?.album_group === type);
};

/**
 * filter artists discography by type of records (used on discography page)
 * @function filterIdDiscography
 * @param {string} id of artist
 * @param {array} array of albums/singles
 * @param {string} type albms/singles
 * @returns filtered array
 */
export const filterIdDiscography = (id, array, type) => {
  return array?.filter(
    (item) =>
      item?.album_group === type &&
      item.artists.some((artist) => artist.id === id)
  );
};

// export const filterByIdDiscography = (id, array) => {
//   return array?.filter((item) =>
//     item.artists.some((artist) => artist.id === id)
//   );
// };

/**
 * retreive artists name based on id
 * @function getArtistNameById
 * @param {string} id of artist
 * @param {array} artistsArray array of artists who contributed to the track
 * @returns artists name
 */
export const getArtistNameById = (artistsArray, id) => {
  const artist = artistsArray?.find((artist) => artist.id === id);
  return artist ? artist.name : null;
};
