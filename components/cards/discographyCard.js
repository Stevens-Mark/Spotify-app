import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import useSpotify from '@/hooks/useSpotify';
import { useSession } from 'next-auth/react';
import { debounce } from 'lodash';
// import state management recoil
import { useRecoilState, useSetRecoilState, useRecoilValue } from 'recoil';
import { currentItemIdState } from '@/atoms/otherAtoms';
import { albumIdState } from '@/atoms/albumAtom';
// import { isPlayState } from '@/atoms/songAtom';
import { isPlayState } from '@/atoms/songAtom';
// import functions
import { capitalize } from '@/lib/capitalize';
// import images/icons
import noImage from '@/public/images/noImageAvailable.svg';
import { PlayCircleIcon, PauseCircleIcon } from '@heroicons/react/24/solid';
// import components 
import TitleTimeLabel from '@/components/headerLabels/titleTime';
import DiscographyTrack from '../trackListDiscography/discographyTracks';
import { albumAndTrackData } from '@/public/mockData/mockAlbums';
import DiscographyQuickPlayBanner from '../player/DiscographyQuickPlayer';

/**
 * @function DiscographyCard
 * @param {object} item
 * @param {object} scrollRef
 * @returns {JSX}
 */
function DiscographyCard({ item, scrollRef }) {
  const spotifyApi = useSpotify();
  const { data: session } = useSession();
  const [activeStatus, setActiveStatus] = useState(false);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayState);
  const [currentItemId, setCurrentItemId] = useRecoilState(currentItemIdState);
  const [albumTracks, setAlbumTracklist] = useState(null);
  const [currentAlbumId, setCurrentAlbumId] = useRecoilState(albumIdState);

  const [isAtTop, setIsAtTop] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const cardRect = cardRef.current.getBoundingClientRect();

      if (cardRect.top <= 0 && cardRect.bottom > 0) {
        // console.log(`Item name "${item?.name}" is at the top of the screen.`);
        setIsAtTop(true); // Set the state when the component is at the top
      } else {
        setIsAtTop(false); // Reset the state when the component is not at the top
      }
    };

    const debouncedHandleScroll = debounce(handleScroll, 100);

    handleScroll(); // Check initial position

    const scrollContainer = scrollRef.current;
    scrollContainer.addEventListener('scroll', debouncedHandleScroll);

    return () => {
      debouncedHandleScroll.cancel();
      scrollContainer.removeEventListener('scroll', debouncedHandleScroll);
    };
  }, [item, scrollRef]);

  // fetch album tracklist
  useEffect(() => {
    // setAlbumTracklist(albumAndTrackData); // for mocking data
    if (spotifyApi.getAccessToken()) {
      spotifyApi.getAlbum(item?.id).then(
        function (data) {
          setAlbumTracklist(data.body);
        },
        function (err) {
          console.error(err);
        }
      );
    }
  }, [item?.id, spotifyApi, session]);

  // album quickplay button update to active or not
  useEffect(() => {
    const newActiveStatus = item?.id === currentAlbumId && isPlaying;
    setActiveStatus(newActiveStatus);
  }, [currentAlbumId, isPlaying, item?.id]);

  // TEMPORARY FUNCTION - NOT COORECT FUNCTIONALITY
  // const HandleCardPlayPauseClick = (event) => {
  //   if (activeStatus) {
  //     // Pause logic: Set isPlaying to false
  //     setIsPlaying(false);
  //     setCurrentItemId(null); // Clear the currently playing item
  //   } else {
  //     // Play logic: Set isPlaying to true and set the current item ID
  //     setIsPlaying(true);
  //     setCurrentItemId(item?.id);
  //   }
  // };

  /**
   * Either play or pause current track
   * @function HandleCardPlayPauseClick
   * @param {event object} event
   */
  const HandleCardPlayPauseClick = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (spotifyApi.getAccessToken()) {
      spotifyApi.getMyCurrentPlaybackState().then((data) => {
        // if track playing originates from the current page then pause
        if (item.id === data.body?.item?.album?.id && data.body?.is_playing) {
          console.log('should pause');
          // if (currentItemId === originId && data.body?.is_playing) {
          // spotifyApi
          //   .pause()
          //   .then(() => {
          setIsPlaying(false);
          //   })
          //   .catch((err) => {
          //     console.error('Pause failed: ');
          //     toast.error('Pause failed !', {
          //       theme: 'colored',
          //     });
          //   });
        } else {
          // or if paused, restart track (that originates from the current page)
          if (item.id === data.body?.item?.album?.id) {
            console.log('should restart same track');
            // if (currentItemId === originId) {
            // spotifyApi
            //   .play()
            //   .then(() => {
                setIsPlaying(true);
            //   })
            //   .catch((err) => {
            //     console.error('Playback failed: ');
            //     toast.error('Playback failed !', {
            //       theme: 'colored',
            //     });
            //   });
          } else {
            console.log('so start with first track');
            setIsPlaying(true);
            // otherwise no track played from the curent page yet, so start with first track
            // HandleCardPlayPause(
            //   item,
            //   setCurrentItemId,
            //   currentItemId,
            //   setIsPlaying,
            //   setPlayerInfoType,
            //   setCurrentTrackId,
            //   setCurrentSongIndex,
            //   setActivePlaylist,
            //   setActiveArtist,
            //   spotifyApi
            // );
          }
        }
      });
    }
  };

  return (
    <section ref={cardRef}>
      <div className="grid grid-cols-[max-content_1fr] items-center p-2 text-white pr-12 mb-6">
        {/* Conditionally render quick play button & title when album reaches top */}
        {isAtTop && (
          <DiscographyQuickPlayBanner
            title={item?.name}
            activeStatus={activeStatus}
            handleClick={HandleCardPlayPauseClick}
          />
        )}
        <div className="flex items-center">
          <Image
            className="ml-4 xs:ml-8 aspect-square shadow-image w-20 h-20 md:w-28 md:h-28"
            src={item?.images?.[0]?.url || noImage}
            alt=""
            width={100}
            height={100}
            style={{ objectFit: 'cover' }}
          />
        </div>

        {/* Album/single details */}
        <div className="ml-4">
          <h2 className="capitalize text-xl md:text-2xl line-clamp-1">
            {item?.name}
          </h2>
          <div className="text-pink-swan mt-0 md:mt-2">
            <span>{capitalize(item?.album_type)}&nbsp;•&nbsp;</span>
            <span>{item?.release_date?.slice(0, 4)}&nbsp;•&nbsp;</span>
            <span>
              {albumTracks?.tracks?.items?.length}&nbsp;
              {albumTracks?.tracks?.items?.length === 1 ? 'Song' : 'Songs'}
            </span>
          </div>
          <button
            className="mt-1 md:mt-3"
            onClick={(event) => {
              HandleCardPlayPauseClick(event);
            }}
            aria-label="Play or Pause"
          >
            {activeStatus ? (
              <PauseCircleIcon className="w-8 h-8 md:w-10 md:h-10 transition delay-100 duration-300 ease-in-out hover:scale-110 focus:scale-110 " />
            ) : (
              <PlayCircleIcon className="w-8 h-8 md:w-10 md:h-10 transition delay-100 duration-300 ease-in-out hover:scale-110 focus:scale-110" />
            )}
          </button>
        </div>
      </div>
      <div className="text-white p-0 xs:px-8 flex items-center w-full justify-between">
        <TitleTimeLabel />
      </div>
      <hr className="border-t-1 text-gray-400 mx-5 xs:mx-[3rem]" />
      <div>
        <h3 className="sr-only">Album Track List</h3>
        <div className="p-0 xs:p-8 flex flex-col space-y-1 bp-28 text-white">
          {albumTracks?.tracks?.items?.map((track, i) => (
            <DiscographyTrack
              key={`${track.id}-${i}`}
              track={track}
              order={i}
              currentAlbumId={item?.id}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default DiscographyCard;
