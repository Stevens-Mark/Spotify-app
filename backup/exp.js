import useSpotify from '@/hooks/useSpotify';

spotifyApi
  .getArtistTopTracks(item.id, ['US', 'FR'])
  .then((data) => {
    // Access the top track of the artist
    const TrackId = data.body?.tracks[0]?.id;
    const topTracks = data.body.tracks;
    const trackUris = topTracks.map((track) => track.uri);
    // set uris for playback
    setUris(trackUris);
    setCurrentTrackId(TrackId);
    // setFirstTrackId(TrackId);
  })
  .catch((err) => {
    console.error('Error retrieving artist top tracks:');
  });

if (spotifyApi.getAccessToken()) {
  spotifyApi.getArtistTopTracks(item.id, ['US', 'FR']).then(
    function (data) {
      // Access the top track of the artist
      const TrackId = data.body?.tracks[0]?.id;
      const topTracks = data.body.tracks;
      const trackUris = topTracks.map((track) => track.uri);
      // set uris for playback
      setUris(trackUris);
      setCurrentTrackId(TrackId);
      // setFirstTrackId(TrackId);
    },
    function (err) {
      setIsSearching(false);
      setIsError(true);
      console.log('Get more album items failed:', err);
    }
  );
}

if (spotifyApi.getAccessToken()) {
  spotifyApi
    .getArtistTopTracks(item.id, ['US', 'FR'])
    .then(function (data) {
      setCurrentTrackId(data.body?.tracks[0]?.id);

      return data.body.tracks.map(function (track) {
        return track.uri;
      });
    })
    .then(function (trackUris) {
      spotifyApi.play({
        uris: trackUris,
      });
    })
    .then(function () {
      console.log('Playback Success');
      setIsPlaying(true);
      setCurrentItemIndex(order);
      // setCurrentTrackId(firstTrackId);
      setActivePlaylist(item.id);
    })
    .catch(function (error) {
      console.error(error);
    });
}
