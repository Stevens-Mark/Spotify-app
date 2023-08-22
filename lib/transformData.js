export function transformData(originalData) {
  const transformedData = originalData.map(item => {
    const newItem = {
      album_type: item.album.album_type,
      artists: item.album.artists,
      available_markets: item.album.available_markets,
      copyrights: item.album.copyrights,
      external_ids: item.album.external_ids,
      external_urls: item.album.external_urls,
      genres: item.album.genres,
      href: item.album.href,
      id: item.album.id,
      images: item.album.images,
      label: item.album.label,
      name: item.album.name,
      popularity: item.album.popularity,
      release_date: item.album.release_date,
      release_date_precision: item.album.release_date_precision,
      total_tracks: item.album.total_tracks,
      tracks: item.album.tracks,
      type: item.album.type,
      uri: item.album.uri,
    };
    return newItem;
  });

  return transformedData;
}