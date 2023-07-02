import React, { useEffect, useState, useRef } from 'react';
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
// import functions
import { capitalize } from '@/lib/capitalize';
// import icons/images
import {
  PlayCircleIcon,
  PauseCircleIcon,
  EllipsisHorizontalIcon,
} from '@heroicons/react/24/solid';

function QuickPlayBanner({ item, scrollRef }) {
  const spotifyApi = useSpotify();

  console.log('item', item);

  const setPlayerInfoType = useSetRecoilState(playerInfoTypeState); // used to determine what type of info to load
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayState);
  const setActivePlaylist = useSetRecoilState(activePlaylistState);
  const setCurrentTrackId = useSetRecoilState(currentTrackIdState); // to control player information window
  const setCurrentSongIndex = useSetRecoilState(currentSongIndexState);
  const [triggeredBySong, setTriggeredBySong] =
    useRecoilState(triggeredBySongState);
  // used to set play/pause icons
  const [currentItemId, setCurrentItemId] = useRecoilState(currentItemIdState);
  const currentAlbumId = useRecoilValue(currentAlbumIdState);
  // show track info when play button at top of screen
  const [isTextVisible, setIsTextVisible] = useState(false);

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

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = scrollRef.current.scrollTop;
      setIsTextVisible(scrollPosition > 250); // Change 0 to the desired threshold
    };

    handleScroll(); // Run initially to set the text visibility

    const scrollContainer = scrollRef.current;
    scrollContainer.addEventListener('scroll', handleScroll);
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, [scrollRef]);

  return (
    <div className={`flex items-center py-4 sticky top-0 w-full bg-black`}>
      <button
        className={` ${
          isTextVisible ? 'ml-5 isSm:ml-28' : 'ml-5 isSm:ml-8'
        } bg-black rounded-full text-green-500 transition delay-100 duration-300 ease-in-out hover:scale-110`}
        onClick={(event) => {
          HandleCardPlayPauseClick(event);
        }}
      >
        {activeStatus ? (
          <PauseCircleIcon className="w-12 h-12 isSm:w-[3.5rem] isSm:h-[3.5rem]" />
        ) : (
          <PlayCircleIcon className="w-12 h-12 isSm:w-[3.5rem] isSm:h-[3.5rem]" />
        )}
      </button>
      {!isTextVisible && (
        <EllipsisHorizontalIcon className="ml-5 w-10 h-10 text-pink-swan" />
      )}

      {isTextVisible && (
        <span className="text-white text-xl font-bold p-2 hidden xxs:inline w-24 xs:w-36 mdlg:w-64 xl:w-auto truncate">
          {capitalize(item?.name)}
        </span>
      )}
    </div>
  );
}

export default QuickPlayBanner;
