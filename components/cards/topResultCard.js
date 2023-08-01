import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import useSpotify from '@/hooks/useSpotify';
import { useRouter } from 'next/router';
// import state management recoil
import { useRecoilState, useSetRecoilState } from 'recoil';
import {
  currentTrackIdState,
  currentSongIndexState,
  isPlayState,
} from '@/atoms/songAtom';
import { activePlaylistState } from '@/atoms/playListAtom';
import { activeArtistState } from '@/atoms/artistAtom';
import { playerInfoTypeState, currentItemIdState } from '@/atoms/otherAtoms';
// import functions
import { capitalize } from '@/lib/capitalize';
import { HandleCardPlayPause } from '@/lib/playbackUtils';
// import icons/images
import { PlayCircleIcon, PauseCircleIcon } from '@heroicons/react/24/solid';
import noImage from '@/public/images/noImageAvailable.svg';

/**
 * Render a card for either album, playlist, artist, or track in top result
 * @function TopResultCard
 * @param {object} item (album, playlist, artist, or track)
 * @returns {JSX}
 */
function TopResultCard({ item }) {
  const spotifyApi = useSpotify();
  const router = useRouter();

  // used to determine what type of info to load
  const setPlayerInfoType = useSetRecoilState(playerInfoTypeState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayState);
  const setActivePlaylist = useSetRecoilState(activePlaylistState);
  const setActiveArtist = useSetRecoilState(activeArtistState);
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const setCurrentSongIndex = useSetRecoilState(currentSongIndexState);
  // used to set play/pause icons
  const [currentItemId, setCurrentItemId] = useRecoilState(currentItemIdState);

  const linkAddress =
    item?.type === 'album'
      ? `/album/${item?.id}`
      : item?.type === 'playlist'
      ? `/playlist/${item?.id}`
      : item?.type === 'artist'
      ? `/artist/${item?.id}`
      : '';

  const handleNavigationClick = (link) => {
      router.push(link);
  };

  /**
   * Either play or pause current track
   * in Card.js or topResultCard.js or quickplaybanner component
   * @function HandleCardPlayPauseClick
   * @param {event object} event
   */
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
      setActiveArtist,
      spotifyApi,
      currentTrackId
    );
  };

  const linkRef = useRef(null);
  // used for highlighting card for keyboard users
  const [isFocused, setIsFocused] = useState(false);
  // used to set play/pause icons
  const [activeStatus, setActiveStatus] = useState(false);

  useEffect(() => {
    const newActiveStatus =
      (currentItemId === item?.id && isPlaying) ||
      (currentTrackId === item?.id && isPlaying);
    setActiveStatus(newActiveStatus);
  }, [currentItemId, currentTrackId, isPlaying, item?.id]);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <Link href={linkAddress} passHref className="group" ref={linkRef}>
      <div
        className={`relative p-4 rounded-lg bg-gray-900 hover:bg-gray-800 transition delay-100 duration-300 ease-in-out h-60 group-focus:bg-gray-800`}
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={{
          background: isFocused ? 'rgb(31 41 55)' : '',
        }}
      >
        <Image
          className={`aspect-square shadow-image ${
            item?.type === 'artist' ? 'rounded-full' : 'rounded-md'
          }`}
          src={
            item?.images?.[0]?.url || item?.album?.images?.[0]?.url || noImage
          }
          alt=""
          width={100}
          height={100}
        />

        <button
          className={`absolute bottom-4 right-7 bg-black rounded-full shadow-3xl text-green-500 transition delay-100 duration-300 ease-in-out hover:scale-110 focus:scale-110 ${
            activeStatus
              ? '-translate-y-2'
              : 'opacity-0 group-hover:-translate-y-2 group-hover:opacity-100 group-focus:-translate-y-2 group-focus:opacity-100'
          }`}
          onClick={(event) => {
            HandleCardPlayPauseClick(event);
          }}
          aria-label="Play or Pause"
        >
          {activeStatus ? (
            <PauseCircleIcon className="w-12 h-12 -m-2" />
          ) : (
            <PlayCircleIcon className="w-12 h-12 -m-2" />
          )}
        </button>

        <h2 className="text-white capitalize mt-4 truncate text-xl md:text-2xl 2xl:text-3xl">
          {item?.name.replace('/', ' & ')}
        </h2>

        <div className="flex text-pink-swan mt-2 items-center">
          {/* album */}
          {item?.type === 'album' && (
            <>
              {item?.artists && (
                <div className=" text-pink-swan line-clamp-1 mr-5">
                  {item?.artists?.map((artist, index) => (
                    <div key={artist?.id}>
                      {index > 0 && ', '}
                      <button
                        aria-label='go to artist'
                        className="hover:text-white hover:underline focus:underline focus:text-white "
                        onClick={() => {
                          handleNavigationClick(`/artist/${artist?.id}`);
                        }}
                      >
                        {artist?.name}
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div
                className="text-white bg-zinc-800 rounded-3xl px-3 py-[0.5px] line-clamp-1 flex-shrink-0 flex-grow-0"
              >
                {capitalize(item?.type)}
              </div>
            </>
          )}

          {/* playlist*/}
          {item?.type === 'playlist' && (
            <>
              <span className="truncate mr-5">
                By {capitalize(item?.owner.display_name)}
              </span>
              <span
                className="text-white bg-zinc-800 rounded-3xl px-3 py-[0.5px] line-clamp-1 flex-shrink-0 flex-grow-0"
              >
                {capitalize(item?.type)}
              </span>
            </>
          )}

          {/*artist*/}
          {item?.type === 'artist' && (
            <span className=" text-white bg-zinc-800 rounded-3xl px-3 py-[0.5px] line-clamp-1 flex-shrink-0 flex-grow-0"
            >
              {capitalize(item?.type)}
            </span>
          )}

          {/* track */}
          {item?.type === 'track' && (
            <>
              {item?.artists && (
                <span className="text-pink-swan line-clamp-1  mr-5">
                  {item?.artists?.map((artist, index) => (
                    <span key={artist?.id}>
                      {index > 0 && ', '}
                      <button
                        aria-label='go to artist'
                        className="hover:text-white hover:underline focus:underline focus:text-white group-focus:bg-gray-800"
                        onClick={() => {
                          handleNavigationClick(`/artist/${artist?.id}`);
                        }}
                      >
                        {artist?.name}
                      </button>
                    </span>
                  ))}
                </span>
              )}
              <span
                className="text-white bg-zinc-800 rounded-3xl px-3 py-[0.5px] line-clamp-1 flex-shrink-0 flex-grow-0"
               >
                Song
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}

export default TopResultCard;
