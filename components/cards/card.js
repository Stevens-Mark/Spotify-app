import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import useSpotify from '@/hooks/useSpotify';
// import state management recoil
import { useRecoilState, useSetRecoilState, useRecoilValue } from 'recoil';
import {
  currentTrackIdState,
  currentSongIndexState,
  isPlayState,
} from '@/atoms/songAtom';
import { activePlaylistState } from '@/atoms/playListAtom';
import { albumIdState } from '@/atoms/albumAtom';
import { activeArtistState } from '@/atoms/artistAtom';
import { currentItemIdState, playerInfoTypeState } from '@/atoms/otherAtoms';
// import functions
import { millisecondsToMinutes, getMonthYear } from '@/lib/time';
import { capitalize } from '@/lib/capitalize';
import { HandleCardPlayPause } from '@/lib/playbackUtils';
// import icons/images
import { PlayCircleIcon, PauseCircleIcon } from '@heroicons/react/24/solid';
import noImage from '@/public/images/noImageAvailable.svg';

/**
 * Render a card for either album, playlist, show, artist, or recent search
 * @function Card
 * @param {object} item (album, playlist, show, artist, or recent search info)
 * @returns {JSX}
 */
function Card({ item }) {
  const spotifyApi = useSpotify();

  // used to determine what type of info to load
  const setPlayerInfoType = useSetRecoilState(playerInfoTypeState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayState);
  const setActivePlaylist = useSetRecoilState(activePlaylistState);
  const setActiveArtist = useSetRecoilState(activeArtistState);
  const setCurrentTrackId = useSetRecoilState(currentTrackIdState); // to control player information window
  const setCurrentSongIndex = useSetRecoilState(currentSongIndexState);
  // used to set play/pause icons
  const [currentItemId, setCurrentItemId] = useRecoilState(currentItemIdState);
  const currentAlbumId = useRecoilValue(albumIdState);

  const linkAddress =
    item?.type === 'album'
      ? `/album/${item?.id}`
      : item?.type === 'playlist'
      ? `/playlist/${item?.id}`
      : item?.type === 'artist'
      ? `/artist/${item?.id}`
      : item?.type === 'show'
      ? `/show/${item?.id}`
      : item?.type === 'episode'
      ? `/episode/${item?.id}`
      : '';

  /**
   * Either play or pause current track
   * in Card.js or topResultCard.js & quickplaybanner component
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
      spotifyApi
    );
  };

  // used to set play/pause icons
  const [activeStatus, setActiveStatus] = useState(false);
  useEffect(() => {
    const newActiveStatus = currentItemId === item?.id && isPlaying;
    setActiveStatus(newActiveStatus);
  }, [currentAlbumId, currentItemId, isPlaying, item?.id]);

  return (
    <Link
      href={linkAddress}
      passHref
      className={`group relative rounded-lg cursor-pointer bg-gray-900 hover:bg-gray-800 transition delay-100 duration-300 ease-in-out pb-8`}
    >
      <div className="relative p-2 sm:p-2 md:p-3 xl:p-4">
        <Image
          className={`aspect-square w-full shadow-image ${
            item?.type === 'artist' ? 'rounded-full' : 'rounded-md'
          }`}
          src={item?.images?.[0]?.url || noImage}
          alt=""
          width={100}
          height={100}
          style={{ objectFit: 'cover' }}
        />
        {item?.type !== 'show' && item?.type !== 'episode' && (
          <button
            className={`absolute bottom-24 right-7 bg-black rounded-full shadow-3xl text-green-500 transition delay-100 duration-300 ease-in-out hover:scale-110 ${
              activeStatus
                ? '-translate-y-2'
                : 'opacity-0 group-hover:-translate-y-2 group-hover:opacity-100'
            }`}
            onClick={(event) => {
              HandleCardPlayPauseClick(event);
            }}
            aria-label="Play or Pause track"
          >
            {activeStatus ? (
              <PauseCircleIcon className="w-12 h-12 -m-2" />
            ) : (
              <PlayCircleIcon className="w-12 h-12 -m-2" />
            )}
          </button>
        )}

        <h3 className="text-white capitalize mt-2 truncate">
          {item?.name?.replace('/', ' & ')}
        </h3>

        <div className="flex flex-wrap text-pink-swan mt-2 h-10">
          {/* album */}
          {item?.type === 'album' && (
            <>
              <span>{item?.release_date.slice(0, 4)}&nbsp;•&nbsp;</span>
              {item?.artists?.slice(0, 2).map((item) => (
                <span className="truncate" key={item?.id}>
                  {item?.name}.&nbsp;
                </span>
              ))}
            </>
          )}

          {/* playlist*/}
          {item?.type === 'playlist' && (
            <span className="truncate">
              By {capitalize(item?.owner?.display_name)}
            </span>
          )}

          {/*artist*/}
          {item?.type === 'artist' && (
            <span className="truncate">{capitalize(item?.type)}</span>
          )}

          {/* show */}
          {item?.type === 'show' && (
            <span className="truncate">{capitalize(item?.publisher)}</span>
          )}
          {/* episode */}
          {item?.type === 'episode' && (
            <>
              <span className="-1">
                {getMonthYear(item?.release_date)}&nbsp;•&nbsp;
              </span>
              <span className="line-clamp-1">
                {millisecondsToMinutes(item?.duration_ms)}
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}

export default Card;
