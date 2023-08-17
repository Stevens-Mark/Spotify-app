import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
// import functions
import { millisToMinutesAndSeconds, formatDateToTimeElapsed } from '@/lib/time';
// import icon
import { PlayIcon, PauseIcon } from '@heroicons/react/24/solid';
// import components
import Equaliser from '@/components/graphics/Equaliser';
import AddRemoveLiked from './addRemoveLiked';
import PlaylistAddRemoveButton from './playlistAddButton';

/**
 * Handles the actual rendering of each track.
 * @function RenderTracks
 * @param {boolean} isShown whether to show/hide play/pause/equaliser on move rollover (see below)
 * @param {function} setIsShown set state for mouse rollover
 * @param {function} HandleTrackPlayPauseClick handle play/pause functionality
 * @param {number} order index/position in list
 * @param {boolean} activeStatus if playing or not set equalizer & play/pause icon
 * @param {object} song data
 * @param {string} addedAt date track added to list (just for playlists)
 * @returns {JSX}
 */
function RenderTracks({
  isShown,
  setIsShown,
  HandleTrackPlayPauseClick,
  order,
  activeStatus,
  song,
  addedAt,
}) {
  const router = useRouter();
  const [linkAddress, setLinkAddress] = useState('');

  // Spotify does not make song further info/lyric etc available to the public
  // thus song name will direct to album, but no further
  useEffect(() => {
    if ((router?.asPath).includes('album')) {
      setLinkAddress(`/album/${(router?.asPath).split('/').pop()}`);
    } else {
      setLinkAddress(`/album/${song?.album?.id}`);
    }
  }, [router?.asPath, song?.album?.id]);

  return (
    <div
      className="grid grid-cols-[1fr,auto] mdlg:grid-cols-2 text-pink-swan py-4 px-5 hover:bg-gray-900 hover:text-white rounded-lg cursor-pointer group"
      onMouseEnter={() => setIsShown(true)}
      onMouseLeave={() => setIsShown(false)}
    >
      <div className="flex items-center space-x-4">
        <button
          className="w-8 flex flex-shrink-0 justify-center"
          onClick={(event) => {
            HandleTrackPlayPauseClick(event, order);
          }}
          onFocus={() => setIsShown(true)} // Triggered when the element receives focus (keyboard navigation)
          onBlur={() => setIsShown(false)} // Triggered when the element loses focus (keyboard navigation)
        >
          {!isShown ? (
            activeStatus ? (
              <Equaliser />
            ) : (
              order + 1
            )
          ) : activeStatus ? (
            <PauseIcon className="h-3.5" />
          ) : (
            <PlayIcon className="h-3.5" />
          )}
        </button>
        {song?.album?.images?.[0]?.url && (
          <Image
            className="h-10 w-10"
            src={song?.album?.images?.[0].url}
            alt=""
            width={100}
            height={100}
            style={{ objectFit: 'cover' }}
          />
        )}
        <div className="w-full">
          <Link
            href={linkAddress}
            className={`pr-2 hover:text-white hover:underline focus:text-white focus:underline line-clamp-1 ${
              activeStatus ? 'text-green-500' : 'text-white'
            }`}
          >
            {song?.name}
          </Link>
          {/* show link(s) to artist(s) if not on artist page */}
          {!(router?.asPath).includes('artist') && (
            <div className="text-sm pr-2 line-clamp-1">
              {song?.artists?.map((artist, index) => (
                <span key={artist?.id}>
                  {index > 0 && ', '}
                  <Link
                    href={`/artist/${artist?.id}`}
                    className="hover:text-white hover:underline focus:text-white focus:underline"
                  >
                    {artist?.name}
                  </Link>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      {song?.album?.name ? (
        <div className="flex items-end md:items-center justify-end mdlg:justify-between ml-auto md:ml-0">
          <span className="w-80 hidden mdlg:inline pr-3 truncate">
            <Link
              href={linkAddress}
              className=" xl:whitespace-normal hover:underline focus:text-white focus:underline "
            >
              {song?.album?.name}
            </Link>
          </span>
          {addedAt && (
            <span className="w-48 hidden mdlg:inline whitespace-nowrap pr-2">
              {formatDateToTimeElapsed(addedAt)}
            </span>
          )}
          <div className="flex items-center">
            {/**** "like" heart add/remove ****/}
            <AddRemoveLiked songId={song?.id} />

            <span>{millisToMinutesAndSeconds(song?.duration_ms)}</span>

            {/* <Ellipsis - add/remove track to/from playlist */}
            <PlaylistAddRemoveButton song={song} order={order}/>
          </div>
        </div>
      ) : (
        <div className="flex items-end xs:items-center justify-end ml-auto md:ml-0">
          {/**** "like" heart add/remove ****/}
          <AddRemoveLiked songId={song?.id} />
          <span>{millisToMinutesAndSeconds(song?.duration_ms)}</span>
          {/* <Ellipsis - add/remove track to/from playlist */}
          <PlaylistAddRemoveButton songUri={song?.uri} order={order}/>
        </div>
      )}
    </div>
  );
}

export default RenderTracks;
