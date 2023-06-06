
// fetch playlist track
export const getPlaylistTrack = async (playlistId) => {
  try {
    const data = await spotifyApi.getPlaylistTracks(playlistId, { limit: 1 });
    const TrackId = data.body?.items[0]?.track.id;
    setCurrentTrackId(TrackId);
    setFirstTrackId(TrackId);
  } catch (err) {
    console.error('Error retrieving playlist track:');
  }
};

// fetch album track
export const getAlbumTrack = async (AlbumId) => {
  try {
    const data = await spotifyApi.getAlbumTracks(AlbumId, { limit: 1 });
    const TrackId = data.body?.items[0]?.id;
    setCurrentTrackId(TrackId);
    setFirstTrackId(TrackId);
  } catch (err) {
    console.error('Error retrieving Album track:');
  }
};

// fetch artists tracks
export const getArtistTopTracks = (artistId, market) => {
  spotifyApi
    .getArtistTopTracks(artistId, market)
    .then((data) => {
      // Access the top track of the artist
      const TrackId = data.body?.tracks[0]?.id;
      const topTracks = data.body.tracks;
      const trackUris = topTracks.map((track) => track.uri);
      // set uris for playback
      setUris(trackUris);
      setCurrentTrackId(TrackId);
      setFirstTrackId(TrackId);
    })
    .catch((err) => {
      console.error('Error retrieving artist top tracks:');
    });
};

/* either play or pause current track */
export const HandleDetails = async (type, item) => {
  let address;
  if (type === 'playlist') {
    address = `spotify:playlist:${item.id}`;
    getPlaylistTrack(item.id);
  } else if (type === 'album') {
    address = `spotify:album:${item.id}`;
    getAlbumTrack(item.id);
  } else if (type === 'artist') {
    // address = `spotify:artist:${item.id}`;
    getArtistTopTracks(item.id, ['US', 'FR']);
  }

  spotifyApi.getMyCurrentPlaybackState().then((data) => {
    if (
      (data.body?.is_playing &&
        firstTrackId === currentTrackId &&
        item?.uri === data.body?.context?.uri) ||
      (data.body?.is_playing &&
        firstTrackId === currentTrackId &&
        item?.id !== data.body?.id)
    ) {
      spotifyApi
        .pause()
        .then(() => {
          setIsPlaying(false);
        })
        .catch((err) => console.error('Pause failed: '));
    } else {
      if (spotifyApi.getAccessToken()) {
        spotifyApi
          .play({
            ...(type !== 'artist'
              ? { context_uri: address }
              : { uris: uris }),
            offset: { position: 0 },
            // ...(type !== 'artist' ? { offset: { position: 0 } } : {}),
          })
          .then(() => {
            console.log('Playback Success');
            setIsPlaying(true);
            setCurrentTrackId(firstTrackId);
            setActivePlaylist(item.id);
          })
          .catch((err) => console.error('Playback failed: ', err));
      }
    }
  });
};