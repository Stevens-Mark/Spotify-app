import { useEffect, useState } from 'react';
import useSpotify from './useSpotify';
// import state management recoil
import { useRecoilState, useRecoilValue } from 'recoil';
import { currentTrackIdState } from '@/atoms/songAtom';
import { playerInfoTypeState } from '@/atoms/idAtom';

/**
 * Custom hook to return the current playing track information
 * @function useSongInfo
 * @returns {object} playing track information
 */
function useSongInfo() {
  const spotifyApi = useSpotify();
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
      // used to determine what type of info to load
  const playerInfoType = useRecoilValue(playerInfoTypeState);
  const [songInfo, setSongInfo] = useState(null);

  useEffect(() => {
    const fetchSongInfo = async () => {
      if (currentTrackId) {
        if (playerInfoType === 'episode') {
          const trackInfo = await fetch(
            `https://api.spotify.com/v1/episodes/${currentTrackId}`,
            {
              headers: {
                Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
              },
            }
          ).then((res) => res.json());
          setSongInfo(trackInfo);
        } else {
          const trackInfo = await fetch(
            `https://api.spotify.com/v1/tracks/${currentTrackId}`,
            {
              headers: {
                Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
              },
            }
          ).then((res) => res.json());
          setSongInfo(trackInfo);
        }
      }
    };
    fetchSongInfo();
  }, [currentTrackId, playerInfoType, spotifyApi]);
  return songInfo;
}

export default useSongInfo;
