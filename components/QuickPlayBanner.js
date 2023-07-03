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
  backgroundColorState,
  randomColorColorState,
} from '@/atoms/otherAtoms';
import { HandleCardPlayPause } from '@/lib/playbackUtils';
// import functions
import { capitalize } from '@/lib/capitalize';
// import icons/images
import {
  PlayCircleIcon,
  PauseCircleIcon,
  EllipsisHorizontalIcon,
} from '@heroicons/react/24/solid';
import TitleAlbumDateTimeLabel from '@/components/headerLabels/titleAlbumDateTime';
import TitleTimeLabel from '@/components/headerLabels/titleTime';
import TitleAlbumTimeLabel from '@/components/headerLabels/titleAlbumTime';

/**
 * Renders quick play start button for media (& in sticky Banner)
 * @function QuickPlayBanner
 * @param {object} item media information
 * @param {object} scrollRef ref for container scroll
 * @returns {JSX}
 */
function QuickPlayBanner({ item, scrollRef }) {
  console.log("item ", item)
  const spotifyApi = useSpotify();

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

  // used for quick play banner
  const randomColor = useRecoilValue(randomColorColorState);
  const backgroundColor = useRecoilValue(backgroundColorState);



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

  // show track info when play button at top of screen
  const [isTextVisible, setIsTextVisible] = useState(false);

  const [isVisible, setIsVisible] = useState(false);
  const [opacity, setOpacity] = useState(0);
  // used for sticky banner quick play button
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = scrollRef.current.scrollTop;
      setIsTextVisible(scrollPosition > 295); // Changed to the desired threshold
      setIsVisible(scrollPosition > 25);

      const maxScroll = 185; // Adjust the maximum scroll value as needed
      const opacityValue = Math.min(scrollPosition / maxScroll, 1);
      setOpacity(opacityValue);
    };

    handleScroll(); // Run initially to set the text visibility

    const scrollContainer = scrollRef.current;
    scrollContainer.addEventListener('scroll', handleScroll);
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, [scrollRef]);

  return (
    <>
      <div
        className={`absolute top-0 h-20 w-full z-20 transition-opacity duration-500 ease-in-out bg-gradient-to-b to-black  
           ${
             backgroundColor !== null ? '' : randomColor
           } flex items-center py-4`}
        style={{ opacity }}
      >
        <button
          className={`ml-5 isSm:ml-28 rounded-full text-green-500 transition delay-100 duration-300 ease-in-out hover:scale-110`}
          onClick={(event) => {
            HandleCardPlayPauseClick(event);
          }}
        >
          {activeStatus ? (
            <PauseCircleIcon className=" w-12 h-12 isSm:w-[3.5rem] isSm:h-[3.5rem]" />
          ) : (
            <PlayCircleIcon className="w-12 h-12 isSm:w-[3.5rem] isSm:h-[3.5rem]" />
          )}
        </button>

        <span className="text-white text-xl font-bold p-2 hidden xxs:inline w-24 xs:w-36 mdlg:w-64 xl:w-auto truncate">
          {capitalize(item?.name)}
        </span>
      </div>

      <div className="sticky top-0">
        <div
          className={`flex items-center py-4 w-full`}
  
        >
          <button
            className={`ml-5 isSm:ml-8 rounded-full text-green-500 transition delay-100 duration-300 ease-in-out hover:scale-110`}
            onClick={(event) => {
              HandleCardPlayPauseClick(event);
            }}
          >
            {activeStatus ? (
              <PauseCircleIcon className=" w-12 h-12 isSm:w-[3.5rem] isSm:h-[3.5rem]" />
            ) : (
              <PlayCircleIcon className="w-12 h-12 isSm:w-[3.5rem] isSm:h-[3.5rem]" />
            )}
          </button>
          <EllipsisHorizontalIcon className="ml-5 w-10 h-10 text-pink-swan" />
        </div>

        {item?.type === 'artist' && !isTextVisible && (
          <span className="text-white px-5 pb-6 xs:px-8 text-xl md:text-2xl xl:text-3xl">
            Popular
          </span>
        )}

        {/* choose heading depending on media type */}
        <div className="grid grid-cols-2 text-pink-swan px-0 xs:px-8 bg-black">
          {item?.type === 'playlist' && <TitleAlbumDateTimeLabel />}
          {item?.type === 'album' && <TitleTimeLabel />}
          {item?.type === 'artist' && <TitleAlbumTimeLabel />}
        </div>
        <hr className="border-t-1 text-gray-400 mx-4 xs:mx-[2.1rem]" />
      </div>
    </>
  );
}

export default QuickPlayBanner;
