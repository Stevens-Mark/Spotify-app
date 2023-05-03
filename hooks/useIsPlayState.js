import { useEffect, useState } from 'react';
import useSpotify from './useSpotify';


function useIsPlayState() {
  const spotifyApi = useSpotify();
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const fetchPlayingState = async () => {
      const trackPlayingState = await fetch(
        `https://api.spotify.com/v1/me/player`,
        {
          headers: {
            Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
          },
        }
      ).then((res) => res.json());
      setIsPlaying(trackPlayingState);
    };
    fetchPlayingState();
  }, [spotifyApi]);

  return isPlaying;
}

export default useIsPlayState;
