import React, { useEffect, useState } from 'react';
import useSpotify from '@/hooks/useSpotify';
// import state management recoil
import { useRecoilState, useSetRecoilState, useRecoilValue } from 'recoil';
import {
  currentTrackIdState,
  currentSongIndexState,
  isPlayState,
} from '@/atoms/songAtom';
import { activePlaylistState } from '@/atoms/playListAtom';
import { currentAlbumIdState } from '@/atoms/albumAtom';
import {
  currentItemIdState,
  playerInfoTypeState,
  triggeredBySongState,
} from '@/atoms/idAtom';
import { HandleCardPlayPause } from '@/lib/playbackUtils';
// import icons/images
import {
  PlayCircleIcon,
  PauseCircleIcon,
  EllipsisHorizontalIcon,
} from '@heroicons/react/24/solid';

function QuickPlay({ item }) {
  const spotifyApi = useSpotify();

  // used to determine what type of info to load
  const setPlayerInfoType = useSetRecoilState(playerInfoTypeState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayState);
  const setActivePlaylist = useSetRecoilState(activePlaylistState);
  const setCurrentTrackId = useSetRecoilState(currentTrackIdState); // to control player information window
  const setCurrentSongIndex = useSetRecoilState(currentSongIndexState);
  const [triggeredBySong, setTriggeredBySong] =
    useRecoilState(triggeredBySongState);
  // used to set play/pause icons
  const [currentItemId, setCurrentItemId] = useRecoilState(currentItemIdState);
  const currentAlbumId = useRecoilValue(currentAlbumIdState);

  const HandleCardPlayPauseClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    HandleCardPlayPause(
      item,
      setCurrentItemId,
      currentItemId,
      setIsPlaying,
      setPlayerInfoType,
      setCurrentTrackId,
      setCurrentSongIndex,
      setActivePlaylist,
      triggeredBySong,
      setTriggeredBySong,
      spotifyApi
    );
  };
  // used to set play/pause icons
  const [activeStatus, setActiveStatus] = useState(false);
  useEffect(() => {
    const newActiveStatus = currentItemId === item?.id && isPlaying;
    // ||
    // (currentAlbumId === item?.id && isPlaying);
    setActiveStatus(newActiveStatus);
  }, [currentAlbumId, currentItemId, isPlaying, item?.id]);

  return (
    <div className="flex items-center mb-4 isSm:mb-8">
      <button
        className={`pl-5 isSm:mx-0 bg-black rounded-full shadow-3xl text-green-500 transition delay-100 duration-300 ease-in-out hover:scale-110`}
        onClick={(event) => {
          HandleCardPlayPauseClick(event);
        }}
      >
        {activeStatus ? (
          <PauseCircleIcon className="w-12 h-12 isSm:w-16 isSm:h-16" />
        ) : (
          <PlayCircleIcon className="w-12 h-12 isSm:w-16 isSm:h-16" />
        )}
      </button>
      <EllipsisHorizontalIcon className="ml-5 w-10 h-10 text-pink-swan" />
    </div>
  );
}

export default QuickPlay;
