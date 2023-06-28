/**
 * fetch playlist track & set TrackId state accordingly
 * @function GetPlaylistTrack
 * @param {object} spotifyApi SpotifyWebApi
 * @param {function} setCurrentTrackId set state for TrackId
 * @param {string} playlistId
 */
const GetPlaylistTrack = async (spotifyApi, setCurrentTrackId, playlistId) => {
  try {
    const data = await spotifyApi.getPlaylistTracks(playlistId, { limit: 1 });
    const TrackId = data.body?.items[0]?.track.id;
    setCurrentTrackId(TrackId);
  } catch (err) {
    console.error('Error retrieving playlist track:');
  }
};

/**
 * fetch album track & set states accordingly
 * @function GetAlbumTrack
 * @param {object} spotifyApi SpotifyWebApi
 * @param {function} setCurrentTrackId set state for TrackId
 * @param {function} setCurrentAlbumId set state for AlbumId
 * @param {string} AlbumId
 */
const GetAlbumTrack = async (
  spotifyApi,
  setCurrentTrackId,
  setCurrentAlbumId,
  AlbumId
) => {
  try {
    const data = await spotifyApi.getAlbumTracks(AlbumId, { limit: 1 });
    const TrackId = data.body?.items[0]?.id;
    setCurrentTrackId(TrackId);
    setCurrentAlbumId(AlbumId);
  } catch (err) {
    console.error('Error retrieving Album track:', err);
  }
};

/**
 * Either play or pause current track
 * in Card.js or topResultCard.js component
 * @function HandleCardPlayPause
 * @param {object} item the media information
 * @param {function} setCurrentAlbumId set state for current album chosen (if applicable) otherwise null
 * @param {string} currentAlbumId the current AlbumId
 * @param {function} setCurrentItemId set state for current card chosen
 * @param {function} setIsPlaying set state whether track playing or not
 * @param {function} setPlayerInfoType set state to determine type of info the display in player info component
 * @param {function} setCurrentTrackId set state for current track chosen
 * @param {function} setCurrentSongIndex set state for the index of where the song is in the list
 * @param {function} setActivePlaylist set state for ActivePlaylist
 * @param {object} spotifyApi SpotifyWebApi
 */
export const HandleCardPlayPause = (
  item,
  setCurrentAlbumId,
  currentAlbumId,
  setCurrentItemId,
  currentItemId,
  setIsPlaying,
  setPlayerInfoType,
  setCurrentTrackId,
  setCurrentSongIndex,
  setActivePlaylist,
  spotifyApi
) => {
  let address, playPromise;
  setCurrentItemId(item.id);

  // set states when a track can play successfully
  const handlePlaybackSuccess = () => {
    console.log('Playback Success');
    setPlayerInfoType('track');
    setIsPlaying(true);
    setCurrentSongIndex(0); // top result is always the first item in array hence value zero
    setActivePlaylist(item.id);
  };

  // check if current playing track matches the one chosen by the user
  // if "yes" pause if "no" play the new track selected
  spotifyApi.getMyCurrentPlaybackState().then((data) => {
    if (
      (item.type !== 'album' &&
        currentItemId === item.id &&
        data.body?.is_playing) ||
      (item.type === 'album' &&
        currentAlbumId === item.id &&
        data.body?.is_playing)
    ) {
      spotifyApi
        .pause()
        .then(() => {
          setIsPlaying(false);
        })
        .catch((err) => {
          console.error('Pause failed: ', err);
        });
    } else {
      if (item?.type === 'artist' || item?.type === 'track') {
        setCurrentAlbumId(null);
        // if artist selected get tracks Uris & play in player
        if (item?.type === 'artist') {
          if (spotifyApi.getAccessToken()) {
            playPromise = spotifyApi
              .getArtistTopTracks(item.id, ['US', 'FR'])
              .then((data) => {
                setCurrentTrackId(data.body?.tracks[0]?.id); // will trigger playerInfo to update
                return data.body.tracks.map((track) => track.uri);
              })
              .then((trackUris) => {
                return spotifyApi.play({ uris: trackUris });
              })
              .catch((err) => {
                console.error(
                  'Either Artist retrieval or playback failed:',
                  err
                );
              });
          }
          // if track selected get track Uri & play in player
        } else if (item?.type === 'track') {
          if (spotifyApi.getAccessToken()) {
            playPromise = spotifyApi
              .play({
                uris: [item.uri],
              })
              .then(() => {
                setCurrentTrackId(item.id); // will trigger playerInfo to update
                setPlayerInfoType('track');
              })
              .catch((err) => {
                console.error('Track playback failed:', err);
              });
          }
        }
        // else get corresponding context_uri depending on if album or playlist
      } else if (item?.type === 'playlist') {
        address = `spotify:playlist:${item.id}`;
        setCurrentAlbumId(null);
        GetPlaylistTrack(spotifyApi, setCurrentTrackId, item.id);
      } else if (item?.type === 'album') {
        address = `spotify:album:${item.id}`;
        GetAlbumTrack(
          spotifyApi,
          setCurrentTrackId,
          setCurrentAlbumId,
          item.id
        );
      }
      // context_uri exists then play it
      if (address && spotifyApi.getAccessToken()) {
        playPromise = spotifyApi.play({ context_uri: address });
      }
      // if possible to play a track then call function to set states otherwise fail
      if (playPromise) {
        playPromise
          .then(handlePlaybackSuccess)
          .catch((err) =>
            console.error('Either album or Playlist Playback failed: ', err)
          );
      }
    }
  });
};

