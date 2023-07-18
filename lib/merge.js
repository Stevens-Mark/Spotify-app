/**
 * merges next set of fetched data (either artists, episodes, playlsist etc)
 * into current result list (queryResults)
 * @function mergeObject
 * @param {object} data next set of fetched data (by "add more" button)
 * @param {object} queryResults results from search
 * @param {string} type of data fetched (album, episode,...)
 * @returns {object} updated queryResults
 */
export const mergeObject = (data, queryResults, type) => {
  const objectMerged = {}; // object to hold updated results

  const objectNames = [
    // list of available types
    'artists',
    'episodes',
    'playlists',
    'shows',
    'tracks',
    'albums',
  ];

  // remove the "type" name representing the new fetched data from the list of types
  const filteredObjectNames = objectNames.filter(
    (objectName) => objectName !== type
  );
  // using this list create a new object containing the data that has NO NEW DATA to be added.
  filteredObjectNames.forEach((objectName) => {
    objectMerged[objectName] = {
      ...queryResults[objectName],
      // ...data[objectName],
    };
  });

  // compare new fetched data with existing data of same "type"
  // passed in as parameter, removing any duplicates.
  const existingItems = new Set(
    queryResults[type].items.map((item) => item.id)
  );
  const newItems = data[type].items.filter((newItem) => {
    return !existingItems.has(newItem.id);
  });

  // *** if you want to keep any duplicates then comment out above existingItems & newItems
  // and replace=> items: queryResults[type].items.concat(newItems), with=> items: [...queryResults[type].items, ...data[type].items], ***/

  // merge this result & add to object with other data (see line 28)
  objectMerged[type] = {
    href: queryResults[type].href,
    items: queryResults[type].items.concat(newItems),
    limit: queryResults[type].limit,
    next: queryResults[type].next,
    offset: queryResults[type].offset,
    previous: queryResults[type].previous,
    total: queryResults[type].total,
  };

  return objectMerged;
};
