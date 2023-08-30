/**
 * filter artists discography by type of records
 * @function filterDiscography
 * @param {array} array of albums/singles
 * @param {string} type albms/singles
 * @returns filtered array
 */
export const filterDiscography = (array, type) => {
  return array?.filter((item) => item?.album_type === type);
};
