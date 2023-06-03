/**
 * Picks randomly either an 'album', 'artist', 'track' or 'playlist
 * to be displayed in the top results window
 * @function getRandomTopResult
 * @param {object} queryResults from user query
 * @returns {object} one of 'album', 'artist', 'track' or 'playlist'
 */
export const getRandomTopResult = (queryResults) => {
  const structures = ['albums', 'artists', 'tracks', 'playlists'];
  const randomStructure =
    structures[Math.floor(Math.random() * structures?.length)];
  const items = queryResults[randomStructure]?.items;

  if (items?.length > 0) {
    const firstItem = items[0];
    return { [randomStructure]: { items: [firstItem] } };
  } else {
    return { [randomStructure]: { items: [] } };
  }
};
