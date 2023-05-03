import React, { useEffect } from 'react';
import Image from 'next/image';
import noAlbum from '@/public/images/blank.svg';
// import custom hooks
import useSpotify from '@/hooks/useSpotify';
import useSongInfo from '@/hooks/useSongInfo';
// import state management recoil
import { useRecoilState } from 'recoil';
import { currentTrackIdState, isPlayState } from '@/atoms/songAtom';

function PlayingInfo() {
  const spotifyApi = useSpotify();
  const songInfo = useSongInfo();
  const [currenTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayState);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      // fetch the song info & set isPlaying & currentTrackId states
      const fetchCurrentSong = () => {
        if (!songInfo) {
          spotifyApi.getMyCurrentPlayingTrack().then((data) => {
            setCurrentTrackId(data.body?.item?.id);

            // spotifyApi.getMyCurrentPlaybackState().then((data) => {
            //   setIsPlaying(data.body?.is_playing);
            // });
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
        src={songInfo?.album.images?.[0]?.url || noAlbum}
        alt="Track playing ..."
        width={100}
        height={100}
      />
      <div>
        <h3>{songInfo?.name}</h3>
        <p>{songInfo?.artists?.[0]?.name}</p>
      </div>
    </div>
  );
}

export default PlayingInfo;
