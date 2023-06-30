//*******************************************************************/
// HANDLE PLAY/PAUSE FOR ALBUM, ARTIST OR PLAYLIST (USER & OTHERS): //
//             Card.js or topResultCard.js component                //
//******************************************************************/

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

  AlbumId
) => {
  try {
    const data = await spotifyApi.getAlbumTracks(AlbumId, { limit: 1 });
    const TrackId = data.body?.items[0]?.id;
    setCurrentTrackId(TrackId);
    // setCurrentAlbumId(AlbumId);
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
 * @param {function} setTriggeredBySong set wehter currentItemId triggered by a song or not
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
  triggeredBySong,
  setTriggeredBySong,
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
    setTriggeredBySong(false);
  };

  // check if current playing track matches the one chosen by the user
  // if "yes" pause if "no" play the new track selected
  spotifyApi.getMyCurrentPlaybackState().then((data) => {
    if (
      (triggeredBySong && currentItemId === item.id && data.body?.is_playing) ||
      (currentItemId === item.id && data.body?.is_playing)
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
        // setCurrentAlbumId(null);
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
        // setCurrentAlbumId(null);
        GetPlaylistTrack(spotifyApi, setCurrentTrackId, item.id);
      } else if (item?.type === 'album') {
        address = `spotify:album:${item.id}`;
        GetAlbumTrack(
          spotifyApi,
          setCurrentTrackId,

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

//***********************************************************************************/
// HANDLE PLAY/PAUSE FOR THE TRACKS IN ALBUMS, ARTISTS OR PLAYLISTS (USER & OTHERS) //
//**********************************************************************************/

// Function to create play options for an album
const createAlbumPlayOptions = (currentAlbumId, currentTrackIndex) => {
  return {
    context_uri: `spotify:album:${currentAlbumId}`,
    offset: { position: currentTrackIndex },
  };
};

// Function to create play options for artist tracks
const createArtistPlayOptions = (artistTrackUris, currentTrackIndex) => {
  return {
    uris: artistTrackUris,
    offset: { position: currentTrackIndex },
  };
};

// Function to create play options for a playlist
const createPlaylistPlayOptions = (IdToUse, currentTrackIndex) => {
  return {
    context_uri: `spotify:playlist:${IdToUse}`,
    offset: { position: currentTrackIndex },
  };
};

// Function to handle play/pause
export const HandleTrackPlayPause = (options) => {
  const {
    originId,

    song,
    currentAlbumId,
    artistTrackUris,
    IdToUse,

    setCurrentItemId,

    currentTrackIndex,
    currentTrackId,
    setCurrentTrackId,
    setCurrentSongIndex,
    setPlayerInfoType,
    setIsPlaying,
    setActivePlaylist,
    setTriggeredBySong,
    spotifyApi,
  } = options;

  // Get the current playback state
  spotifyApi.getMyCurrentPlaybackState().then((data) => {
    if (data.body?.is_playing && song.id === currentTrackId) {
      // If the song is already playing, pause it
      spotifyApi
        .pause()
        .then(() => {
          setIsPlaying(false);
        })
        .catch((err) => console.error('Pause failed: ', err));
    } else {
      let playOptions;
      setCurrentItemId(originId);
      // Determine the play options based on whether album, artist or playlists
      if (currentAlbumId) {
        playOptions = createAlbumPlayOptions(currentAlbumId, currentTrackIndex);
      } else if (artistTrackUris) {
        playOptions = createArtistPlayOptions(
          artistTrackUris,
          currentTrackIndex
        );
      } else {
        playOptions = createPlaylistPlayOptions(IdToUse, currentTrackIndex);
      }

      // Play the song with the generated play options
      spotifyApi
        .play(playOptions)
        .then(() => {
          console.log('Playback Success');
          setPlayerInfoType('track');
          setIsPlaying(true);
          setCurrentTrackId(song.id);
          setCurrentSongIndex(currentTrackIndex);
          setTriggeredBySong(true);

          // Set the active playlist based on the scenario
          if (!currentAlbumId && !artistTrackUris) {
            setActivePlaylist(IdToUse);
          } else {
            setActivePlaylist(null);
          }
        })
        .catch((err) => console.error('Playback failed: ', err));
    }
  });
};
