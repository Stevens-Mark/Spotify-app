/**
 * Capitalizes the first letter of each word of a given string
 * @function capitalize
 * @param {string} string to capitalize
 * @returns {string} capitalised string
 */
export const capitalize = (string) => {
  // return string && string[0].toUpperCase() + string.slice(1)
  if (string) {
    return string
      .toLowerCase()
      .split(' ')
      .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
      .join(' ');
  }
};
