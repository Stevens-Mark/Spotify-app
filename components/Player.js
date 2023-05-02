import React, { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
// import custom hooks
import useSpotify from '@/hooks/useSpotify';
import useSongInfo from '@/hooks/useSongInfo';
import { useSession } from 'next-auth/react';
import { debounce } from 'lodash';
// import state management recoil
import { useRecoilState } from 'recoil';
import { currentTrackIdState, isPlayState } from '@/atoms/songAtom';
// import noAlbum from '@/public/images/blank.svg';

import PlayingInfo from './PlayingInfo';
// please vist https://heroicons.com/ for icon details
import {
  ArrowsRightLeftIcon,
  BackwardIcon,
  ForwardIcon,
  ArrowPathRoundedSquareIcon,
  ArrowPathIcon,
  PauseCircleIcon,
  PlayCircleIcon,
} from '@heroicons/react/24/solid';
import { SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/outline';

function Player() {
  const spotifyApi = useSpotify();
  const { data: session } = useSession();
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayState);
  const [volume, setVolume] = useState(50);
  const [currentrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);

  const [shuffleState, setShuffletState] = useState(false);
  const setShuffle = () => {
    setShuffletState((prevState) => !prevState);
    spotifyApi
      .setShuffle(!shuffleState)
      .catch((err) => console.error('Shuffle failed:'));
  };

  const skipToPrevious = () => {
    spotifyApi.skipToPrevious().catch((err) => console.error('Rewind failed:'));
    setTimeout(() => {
      spotifyApi
        .getMyCurrentPlayingTrack()
        .then((data) => {
          setCurrentTrackId(data.body.item.id);
        })
        .catch((err) => console.error('Get Current Track ID failed: ', err));
    }, '750');
  };

  const handlePlayPause = () => {
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      if (data.body?.is_playing) {
        spotifyApi.pause();
        setIsPlaying(false);
      } else {
        spotifyApi
          .play()
          .catch((err) => console.error('Playback failed: ', err));
        setIsPlaying(true);
      }
    });
  };

  const skipToNext = () => {
    spotifyApi
      .skipToNext()
      .catch((err) => console.error('Forward failed: ', err));
    setTimeout(() => {
      spotifyApi
        .getMyCurrentPlayingTrack()
        .then((data) => {
          setCurrentTrackId(data.body.item.id);
        })
        .catch((err) => console.error('Get Current Track ID failed: ', err));
    }, '750');
  };

  // handles 3 way toggle, off, repeat, repeat  once
  const [repeatState, setRepeatState] = useState(0);
  const handleRepeatToggle = () => {
    let adjusted = repeatState == 0 ? 1 : repeatState == 2 ? 0 : 2;
    let value = adjusted === 0 ? 'off' : adjusted === 1 ? 'context' : 'track';
    setRepeatState((prevState) => (prevState + 1) % 3);
    spotifyApi
      .setRepeat(`${value}`, {})
      .catch((err) => console.error('Repeat failed:'));
  };

  // Debouncing is a programming pattern/ technique to restrict the calling of a time-consuming function frequently, by delaying the execution of the function until a specified time to avoid unnecessary API calls and improve performance.
  const debounceAdjustVolume = useMemo(
    () =>
      debounce((volume) => {
        spotifyApi.setVolume(volume).catch((err) => {}); // for now throw error but could check for active device;
      }, 500),
    [spotifyApi]
  );

  useEffect(() => {
    if (volume > 0 && volume < 100) {
      debounceAdjustVolume(volume);
    }
  }, [debounceAdjustVolume, volume]);

  // const renderCount = useMemo(() => {
  //   let count = 0;
  //   return () => ++count;
  // }, []);

  // useEffect(() => {
  //   console.log(`Component has rendered ${renderCount()} times`);
  // }, [renderCount]);

  return (
    <div className="h-24 bg-gradient-to-b from-black to-gray-900 text-white text-sm md:text-base px-2 md:px-8 grid grid-cols-3">
      <PlayingInfo /> {/* left hand side - album photo/info */}
      {/* center */}
      <div className="flex items-center justify-evenly">
        <span className="relative">
          <ArrowsRightLeftIcon
            onClick={() => setShuffle()}
            className={`button ${
              shuffleState === false ? 'text-white' : 'text-green-500'
            }`}
          />
          {shuffleState && (
            <span className="absolute top-6 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-green-500 rounded-full"></span>
          )}
        </span>

        <BackwardIcon onClick={() => skipToPrevious()} className="button" />

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

        <ForwardIcon onClick={() => skipToNext()} className="button" />

        <span className="relative">
          <ArrowPathRoundedSquareIcon
            onClick={() => handleRepeatToggle()}
            className={`button w-6 h-6 ${
              repeatState === 0 ? 'text-white' : 'text-green-500'
            }`}
          />
          {repeatState === 1 || repeatState === 2 ? (
            <span className="absolute top-6 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-green-500 rounded-full"></span>
          ) : (
            ''
          )}

          {repeatState === 2 ? (
            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs text-green-500 pointer-events-none pr-[1.1px]">
              1
            </span>
          ) : (
            ''
          )}
        </span>
      </div>
      {/* right hand side */}
      <div className="flex items-center space-x-3 md:space-x-4 justify-end pr-5">
        <SpeakerXMarkIcon
          className="button "
          onClick={() => volume > 0 && setVolume(volume - 10)}
        />
        <input
          className="w-14 md:w-28"
          type="range"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          min={0}
          max={100}
        />
        <SpeakerWaveIcon
          className="button"
          onClick={() => volume < 100 && setVolume(volume + 10)}
        />
      </div>
    </div>
  );
}

export default Player;
