import useSpotify from '@/hooks/useSpotify';

export function GetMyCurrentPlayListId() {
  const spotifyApi = useSpotify();
  if (spotifyApi.getAccessToken()) {
    spotifyApi
      .getMyCurrentPlayingTrack()
      .then((data) => {
        // check if the user is currently playing a track & return it's Playlist ID
        if (data.body && data.body.is_playing) {
          const playlist = data.body?.context.uri.split(':');
          const id = playlist[playlist.length - 1];
          // setCurrentPlaylistId(id);
          return id;
        } else {
          console.log('User is not currently playing a track');
        }
      })
      .catch((error) => {
        console.error('Failed to get current playing track / playlist ID', error);
      });
  }
}
