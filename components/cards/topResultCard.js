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
import { currentAlbumIdState } from '@/atoms/albumAtom';
import {
  playerInfoTypeState,
  currentItemIdState,
  // triggeredBySongState,
} from '@/atoms/otherAtoms';
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

  // used to determine what type of info to load
  const setPlayerInfoType = useSetRecoilState(playerInfoTypeState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayState);
  const setActivePlaylist = useSetRecoilState(activePlaylistState);
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const setCurrentSongIndex = useSetRecoilState(currentSongIndexState);
  // const [triggeredBySong, setTriggeredBySong] =
  //   useRecoilState(triggeredBySongState);
  // used to set play/pause icons
  const [currentItemId, setCurrentItemId] = useRecoilState(currentItemIdState);
  const currentAlbumId = useRecoilValue(currentAlbumIdState);

  const linkAddress =
    item?.type === 'album'
      ? `/album/${item?.id}`
      : item?.type === 'playlist'
      ? `/playlist/${item?.id}`
      : item?.type === 'artist'
      ? `/artist/${item?.id}`
      : '';

  /**
   * Either play or pause current track
   * in Card.js or topResultCard.js component
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
      triggeredBySong,
      // setTriggeredBySong,
      spotifyApi
    );
  };

  // used to set play/pause icons
  const [activeStatus, setActiveStatus] = useState(false);
  useEffect(() => {
    const newActiveStatus =
      (currentItemId === item?.id && isPlaying) ||
      // (currentAlbumId === item?.id && isPlaying) ||
      (currentItemId === item?.album?.id && isPlaying) ||
      (currentAlbumId === item?.id && currentTrackId === item?.id && isPlaying);

    setActiveStatus(newActiveStatus);
  }, [
    currentAlbumId,
    currentItemId,
    currentTrackId,
    isPlaying,
    item?.album?.id,
    item?.id,
  ]);

  return (
    <Link href={linkAddress} className="group">
      <div className="relative p-4 rounded-lg bg-gray-900 hover:bg-gray-800 transition delay-100 duration-300 ease-in-out h-60">
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
          className={`absolute bottom-4 right-7 bg-black rounded-full shadow-3xl text-green-500 transition delay-100 duration-300 ease-in-out hover:scale-110 ${
            activeStatus
              ? '-translate-y-2'
              : 'opacity-0 group-hover:-translate-y-2 group-hover:opacity-100'
          }`}
          onClick={(event) => {
            HandleCardPlayPauseClick(event);
          }}
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

        <div className="flex flex-wrap text-pink-swan mt-2">
          {/* album */}
          {item?.type === 'album' && (
            <>
              <span className="truncate">
                <span>{item?.release_date.slice(0, 4)}&nbsp;•&nbsp;</span>

                {item?.artists.slice(0, 2).map((item) => (
                  <span className="trucate mr-5" key={item?.id}>
                    {item?.name}.&nbsp;
                  </span>
                ))}
                <span className="text-white bg-zinc-800 rounded-3xl px-3 py-[0.5px]">
                  {capitalize(item?.type)}
                </span>
              </span>
            </>
          )}

          {/* playlist*/}
          {item?.type === 'playlist' && (
            <>
              <span className="truncate mr-5">
                By {capitalize(item?.owner.display_name)}
              </span>
              <span className="text-white bg-zinc-800 rounded-3xl px-3 py-[0.5px] truncate">
                {capitalize(item?.type)}
              </span>
            </>
          )}

          {/*artist*/}
          {item?.type === 'artist' && (
            <span className="text-white bg-zinc-800 rounded-3xl px-3 py-[0.5px]">
              {capitalize(item?.type)}
            </span>
          )}

          {/* track */}
          {item?.type === 'track' && (
            <>
              <span className="truncate mr-5">
                {capitalize(item?.artists?.[0]?.name)}
              </span>
              <span className="text-white bg-zinc-800 rounded-3xl px-3 py-[0.5px]">
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
