import { toast } from 'react-toastify';
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
    toast.error('Track retrieval Failed !', {
      theme: 'colored',
    });
  }
};

/**
 * fetch album track & set states accordingly
 * @function GetAlbumTrack
 * @param {object} spotifyApi SpotifyWebApi
 * @param {function} setCurrentTrackId set state for TrackId
 * @param {string} AlbumId
 */
const GetAlbumTrack = async (spotifyApi, setCurrentTrackId, AlbumId) => {
  try {
    const data = await spotifyApi.getAlbumTracks(AlbumId, { limit: 1 });
    const TrackId = data.body?.items[0]?.id;
    setCurrentTrackId(TrackId);
  } catch (err) {
    console.error('Error retrieving Album track:', err);
    toast.error('Track retrieval Failed  !', {
      theme: 'colored',
    });
  }
};

/**
 * Either play or pause current track
 * in Card.js or topResultCard.js component
 * @function HandleCardPlayPause
 * @param {object} item the media information
 * @param {function} setCurrentItemId set state for current card chosen
 * @param {string} currentItemId  current card chosen
 * @param {function} setIsPlaying set state whether track playing or not
 * @param {function} setPlayerInfoType set state to determine type of info the display in player info component
 * @param {function} setCurrentTrackId set state for current track chosen
 * @param {function} setCurrentSongIndex set state for the index of where the song is in the list
 * @param {function} setActivePlaylist set state for ActivePlaylist
 * @param {object} spotifyApi SpotifyWebApi
 * @param {string} currentTrackId current track chosen
 */
export const HandleCardPlayPause = (
  item,
  setCurrentItemId,
  currentItemId,
  setIsPlaying,
  setPlayerInfoType,
  setCurrentTrackId,
  setCurrentSongIndex,
  setActivePlaylist,
  spotifyApi,
  currentTrackId
) => {
  let address, playPromise;
  setCurrentItemId(item?.id);

  // set states when a track can play successfully
  const handlePlaybackSuccess = () => {
    // console.log('Playback Success');
    setPlayerInfoType('track');
    setIsPlaying(true);
    setCurrentSongIndex(0); // play on card so first time it will be the first track value zero
    setActivePlaylist(item?.id);
  };

  // check if current playing track matches the one chosen by the user
  // if "yes" pause if "no" play the new track selected
  spotifyApi.getMyCurrentPlaybackState().then((data) => {
    if (
      (currentItemId === item?.id && data.body?.is_playing) ||
      (currentTrackId === item?.id && data.body?.is_playing)
    ) {
      spotifyApi
        .pause()
        .then(setIsPlaying(false))
        .catch((err) => {
          console.error('Pause failed: ', err);
          toast.error('Pause failed !', {
            theme: 'colored',
          });
        });
    } else if (currentItemId === item?.id) {
      spotifyApi
        .play()
        .then(setIsPlaying(true))
        .catch((err) => {
          console.error('Playback failed: ', err);
          toast.error('Playback failed !', {
            theme: 'colored',
          });
        });
    } else {
      if (item?.type === 'artist' || item?.type === 'track') {
        // if artist selected get tracks Uris & play in player
        if (item?.type === 'artist') {
          if (spotifyApi.getAccessToken()) {
            playPromise = spotifyApi
              .getArtistTopTracks(item?.id, ['US', 'FR'])
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
                toast.error('Playback failed !', {
                  theme: 'colored',
                });
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
                toast.error('Playback failed !', {
                  theme: 'colored',
                });
              });
          }
        }
        // else get corresponding context_uri depending on if album or playlist
      } else if (item?.type === 'playlist') {
        address = `spotify:playlist:${item.id}`;
        GetPlaylistTrack(spotifyApi, setCurrentTrackId, item.id);
      } else if (item?.type === 'album') {
        address = `spotify:album:${item.id}`;
        GetAlbumTrack(spotifyApi, setCurrentTrackId, item.id);
      }
      // context_uri exists then play it
      if (address && spotifyApi.getAccessToken()) {
        playPromise = spotifyApi.play({ context_uri: address });
      }
      // if possible to play a track then call function to set states otherwise fail
      if (playPromise) {
        playPromise.then(handlePlaybackSuccess).catch((err) => {
          console.error('Either album or Playlist Playback failed:', err);
          toast.error('Playback failed !', {
            theme: 'colored',
          });
        });
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
    spotifyApi,
    setCurrentAlbumId,
    // setCurrentTrackNumber,
  } = options;

  console.log("origin ", originId)

  // Get the current playback state
  spotifyApi.getMyCurrentPlaybackState().then((data) => {
    if (data.body?.is_playing && song.id === currentTrackId) {
      // If the song is already playing, pause it
      spotifyApi
        .pause()
        .then(() => {
          setIsPlaying(false);
        })
        .catch((err) => {
          console.error('Pause failed: ', err);
          toast.error('Pause failed !', {
            theme: 'colored',
          });
        });
    } else {
      let playOptions;
      if (originId === 'tracks' || originId === 'all') {
        setCurrentItemId(song?.album?.id);
        // setCurrentTrackNumber(song?.track_number);
      } else {
        setCurrentItemId(originId);
      }

      // Determine the play options based on whether album, artist or playlists
      if (currentAlbumId) {
        playOptions = createAlbumPlayOptions(currentAlbumId, currentTrackIndex);
      } else if (artistTrackUris) {
        playOptions = createArtistPlayOptions(
          artistTrackUris,
          currentTrackIndex
        );
        setCurrentAlbumId(song?.album?.id);
      } else {
        playOptions = createPlaylistPlayOptions(IdToUse, currentTrackIndex);
      }

      // Play the song with the generated play options & set according states
      spotifyApi
        .play(playOptions)
        .then(() => {
          // console.log('Playback Success');
          setPlayerInfoType('track');
          setIsPlaying(true);
          setCurrentTrackId(song.id);
          // setCurrentSongIndex(currentTrackIndex);
          if (originId === 'tracks' || originId === 'all') {
            setCurrentSongIndex(song?.track_number);
          } else {
            setCurrentSongIndex(currentTrackIndex);
          }
          // Set the active playlist based on the scenario
          if (!currentAlbumId && !artistTrackUris) {
            setActivePlaylist(IdToUse);
          } else {
            setActivePlaylist(null);
          }
        })
        .catch((err) => {
          console.error('Playback failed: ', err);
          toast.error('Playback failed !', {
            theme: 'colored',
          });
        });
    }
  });
};
