import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
// import custom hooks
import useSpotify from '@/hooks/useSpotify';
import useSongInfo from '@/hooks/useSongInfo';
import { useSession } from 'next-auth/react';
// import state management recoil
import { useRecoilState } from 'recoil';
import { currentTrackIdState, isPlayState } from '@/atoms/songAtom';
import noAlbum from '@/public/images/blank.svg';

// please vist https://heroicons.com/ for icon details
import {
  ArrowsRightLeftIcon,
  BackwardIcon,
  ForwardIcon,
  PauseIcon,
  PlayIcon,
  ArrowUturnLeftIcon,
  PauseCircleIcon,
  PlayCircleIcon,
} from '@heroicons/react/24/solid';
import {
  HeartIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
} from '@heroicons/react/24/outline';

function Player() {
  const spotifyApi = useSpotify();
  const songInfo = useSongInfo();
  const { data: session } = useSession();
  const [currenTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayState);
  const [volume, setVolume] = useState(50);

  const fetchCurrentSong = useCallback(() => {
    if (!songInfo) {
      spotifyApi.getMyCurrentPlayingTrack().then((data) => {
        console.log('Now Playing: ', data.body?.item);
        setCurrentTrackId(data.body?.item?.id);

        spotifyApi.getMyCurrentPlaybackState().then((data) => {
          setIsPlaying(data.body?.is_playing);
        });
      });
    }
  }, [setCurrentTrackId, setIsPlaying, songInfo, spotifyApi]);

  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currenTrackId) {
      // fetch the song info
      fetchCurrentSong();
      setVolume(50);
    }
  }, [spotifyApi, session, currenTrackId, fetchCurrentSong]);

  const handlePlayPause = () => {
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      if (data.body.is_playing) {
        spotifyApi.pause();
        setIsPlaying(false);
      } else {
        spotifyApi.play();
        setIsPlaying(true);
      }
    });
  };

  return (
    <div className="h-24 bg-gradient-to-b from-black to-gray-900 text-white text-sm md:text-base px-2 md:px-8 grid grid-cols-3">
      {/* left side */}
      <div className="flex items-center space-x-4 pt-4">
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
      {/* center */}
      <div className="flex items-center justify-evenly">
        <ArrowsRightLeftIcon className="button" />
        <BackwardIcon
          onClick={() => spotifyApi.skipToPrevious()} // The API is not working
          className="button"
        />
        {isPlaying ? (
          <PauseCircleIcon
            className="button w-10 h-10"
            onClick={handlePlayPause}
          />
        ) : (
          <PlayCircleIcon
            className="button w-10 h-10"
            onClick={handlePlayPause}
          />
        )}
        <ForwardIcon
          onClick={() => spotifyApi.skipToNext()} // The API is not working
          className="button"
        />
        <ArrowUturnLeftIcon
          // onClick={() => spotifyApi.()} // The API is not working
          className="button"
        />
      </div>
    </div>
  );
}

export default Player;
