import React, { useEffect, useState, useCallback, useMemo } from 'react';
import Image from 'next/image';
// import custom hooks
import useSpotify from '@/hooks/useSpotify';
import useSongInfo from '@/hooks/useSongInfo';
import { useSession } from 'next-auth/react';
import { debounce } from 'lodash';
// import state management recoil
import { useRecoilState } from 'recoil';
import { currentTrackIdState, isPlayState } from '@/atoms/songAtom';
import noAlbum from '@/public/images/blank.svg';

// please vist https://heroicons.com/ for icon details
import {
  ArrowsRightLeftIcon,
  BackwardIcon,
  ForwardIcon,
  ArrowUturnLeftIcon,
  PauseCircleIcon,
  PlayCircleIcon,
} from '@heroicons/react/24/solid';
import { SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/outline';

function Player() {
  const spotifyApi = useSpotify();
  const songInfo = useSongInfo();

  // console.log("songinfo", songInfo)

  const { data: session } = useSession();
  const [currenTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayState);
  const [volume, setVolume] = useState(50);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      // fetch the song info
      const fetchCurrentSong = () => {
        if (!songInfo) {
          spotifyApi.getMyCurrentPlayingTrack().then((data) => {
            setCurrentTrackId(data.body?.item?.id);

            spotifyApi.getMyCurrentPlaybackState().then((data) => {
              setIsPlaying(data.body?.is_playing);
            });
          });
        }
      };
      fetchCurrentSong();
      setVolume(50);
    }
  }, [
    spotifyApi,
    session,
    currenTrackId,
    songInfo,
    setCurrentTrackId,
    setIsPlaying,
  ]);

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

  // handles 3 way toggle, off, repeat, repeat  once
  const [repeatState, setRepeatState] = useState(0);
  const handleRepeatToggle = () => {
    let value =
      repeatState === 0 ? 'off' : repeatState === 1 ? 'context' : 'track';
    setRepeatState((prevState) => (prevState + 1) % 3);
    spotifyApi.setRepeat(`${value}`, {});
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

  const renderCount = useMemo(() => {
    let count = 0;
    return () => ++count;
  }, []);

  useEffect(() => {
    console.log(`Component has rendered ${renderCount()} times`);
  }, [renderCount]);

  return (
    <div className="h-24 bg-gradient-to-b from-black to-gray-900 text-white text-sm md:text-base px-2 md:px-8 grid grid-cols-3">
      {/* left hand side */}
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
          className="button"
          onClick={() => handleRepeatToggle()}
        />
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
