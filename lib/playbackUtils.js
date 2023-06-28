

// export const HandlePlayPause = (
//   song,
//   currentTrackId,
//   currentAlbumId,
//   currentTrackIndex,
//   setIsPlaying,
//   setPlayerInfoType,
//   setCurrentTrackId,
//   setCurrentSongIndex,
//   setActivePlaylist,
//   spotifyApi
// ) => {

//   spotifyApi.getMyCurrentPlaybackState().then((data) => {
//     if (data.body?.is_playing && song.id === currentTrackId) {
//       spotifyApi
//         .pause()
//         .then(() => {
//           setIsPlaying(false);
//         })
//         .catch((err) => console.error('Pause failed: ', err));
//     } else {
//       spotifyApi
//         .play({
//           context_uri: `spotify:album:${currentAlbumId}`,
//           offset: { position: currentTrackIndex },
//         })
//         .then(() => {
//           console.log('Playback Success');
//           setPlayerInfoType('track');
//           setIsPlaying(true);
//           setCurrentTrackId(song.id);
//           setCurrentSongIndex(currentTrackIndex);
//           setActivePlaylist(null); // album playing, so user's playlist is null
//         })
//         .catch((err) => console.error('Playback failed: ', err));
//     }
//   });
// };

// const handleClick = (event) => {
//   HandlePlayPause(
//     song,
//     currentTrackId,
//     currentAlbumId,
//     order,
//     setIsPlaying,
//     setPlayerInfoType,
//     setCurrentTrackId,
//     setCurrentSongIndex,
//     setActivePlaylist,
//     spotifyApi
//   );
// };
