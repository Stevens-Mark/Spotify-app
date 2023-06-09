import React, { useEffect } from 'react';
import Image from 'next/image';
import noAlbum from '@/public/images/blank.svg';
// import custom hooks
import useSpotify from '@/hooks/useSpotify';
import useSongInfo from '@/hooks/useSongInfo';
// import state management recoil
import { useSetRecoilState } from 'recoil';
import { currentTrackIdState, isPlayState } from '@/atoms/songAtom';

/**
 * Renders track info bottom left side
 * @function PlayingInfo
 * @returns {JSX}
 */
function PlayingInfo() {
  const spotifyApi = useSpotify();
  const songInfo = useSongInfo('episode');
  const setCurrentTrackId = useSetRecoilState(currentTrackIdState);
  const setIsPlaying = useSetRecoilState(isPlayState);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      // fetch the song info & set isPlaying & currentTrackId states
      const fetchCurrentSong = () => {
        if (!songInfo) {
          spotifyApi.getMyCurrentPlayingTrack().then((data) => {
            setCurrentTrackId(data.body?.item?.id);
            setIsPlaying(data.body?.is_playing);
          });
        }
      };
      fetchCurrentSong();
    }
  }, [setCurrentTrackId, setIsPlaying, songInfo, spotifyApi]);

  return (
    <div className="flex items-center space-x-4">
      <Image
        className="hidden md:inline h-10 w-10"
        src={songInfo?.album?.images?.[0]?.url || songInfo?.images?.[0]?.url || noAlbum}
        alt=""
        width={100}
        height={100}
      />
      <div>
        <h3 className='line-clamp-1'>{songInfo?.name}</h3>
        {songInfo?.artist && (<span className='text-sm line-clamp-1' >{songInfo?.artists?.[0]?.name}</span>)}
        {songInfo?.show && (<span className='text-xs text-pink-swan line-clamp-1' >{songInfo?.show?.name}</span>)}
        
      </div>
    </div>
  );
}

export default PlayingInfo;
