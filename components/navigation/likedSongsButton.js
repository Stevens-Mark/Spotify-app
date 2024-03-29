import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import useSpotify from '@/hooks/useSpotify';
import { useRouter } from 'next/router';
// import state management recoil
import { useRecoilState } from 'recoil';
import { isLikedSongState } from '@/atoms/songAtom';
import { SpeakerWaveIcon, HandThumbUpIcon } from '@heroicons/react/24/solid';

/**
 * Render Liked song Button in Navigation sidebar
 * @function LikedButton
 * @param {string} activePlaylistId
 * @param {string} activePlaylist
 * @param {boolean} isPlaying
 * @returns {JSX}
 */
function LikedSongsButton({ activePlaylistId, activePlaylist, isPlaying }) {
  const router = useRouter();
  const { data: session } = useSession();
  const spotifyApi = useSpotify();
  const [isLikedSong, setIsLikedSong] = useRecoilState(isLikedSongState);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [stopFetch, setStopFetch] = useState(false);

  // collect all track Ids in the liked song list (used to set heart if needed in addRemoveLiked.js)
  useEffect(() => {
    if (!stopFetch) {
      const nextOffset = currentOffset + 50;

      if (spotifyApi.getAccessToken()) {
        spotifyApi
          .getMySavedTracks({
            limit: 50,
            offset: currentOffset,
          })
          .then(
            function (data) {
              const newLikedSongs = data.body?.items?.map(
                (item) => item?.track?.id
              );

              const uniqueLikedSongs = [
                ...new Set([...isLikedSong, ...newLikedSongs]),
              ];

              setIsLikedSong(uniqueLikedSongs);
              setCurrentOffset(nextOffset);
              // Check if there's no more data to fetch
              if (data?.body?.items?.length === 0) {
                setStopFetch(true);
                // return;
              }
            },
            function (err) {
              console.log('Liked songs retrieval failed !');
            }
          );
      }
    }
  }, [
    currentOffset,
    isLikedSong,
    setIsLikedSong,
    spotifyApi,
    session,
    stopFetch,
  ]);

  const collection = {
    id: 'collection',
    type: 'collection',
    name: 'Liked Songs',
    images: [
      {
        height: 640,
        url: '/images/LikedSongs.png',
        width: 640,
      },
    ],
  };

  const handleCollectionClick = () => {
    // if on likesongs page this check stops the page being reloaded & loosing previously loaded song data
    if (activePlaylistId !== collection?.id) {
      router.push(`/collection`);
    }
  };

  return (
    <button
      onClick={() => handleCollectionClick(collection?.id)}
      aria-label="Go to Liked Songs"
      className={`group flex items-center p-3 rounded-lg text-left w-full

              ${
                activePlaylistId == collection?.id
                  ? ` bg-gray-900 hover:bg-gray-800 focus:bg-gray-800`
                  : 'hover:bg-gray-900 focus:bg-gray-900'
              }
            `}
    >
      <Image
        className="h-10 w-10 mr-2 rounded-sm"
        src={collection?.images?.[0].url}
        alt=""
        width={100}
        height={100}
        style={{ objectFit: 'cover' }}
      />
      <div className="flex flex-col text-left w-full">
        <span
          className={`line-clamp-1 ${
            activePlaylist == collection?.id && isPlaying
              ? 'text-green-500'
              : 'group-hover:text-white group-focus:text-white'
          }  `}
        >
          {collection?.name}
        </span>

        <span className="flex text-[13px] items-center">
          <HandThumbUpIcon className="w-4 h-4 mr-1 text-green-500" />
          <span>Playlist</span>
          &nbsp;•&nbsp;
          <span className="line-clamp-1">
            {isLikedSong?.length}&nbsp; Songs
          </span>
        </span>
      </div>

      <span className="pl-2 justify-end">
        {activePlaylist == collection?.id && isPlaying ? (
          <SpeakerWaveIcon className="w-4 h-4 text-green-500" />
        ) : (
          ' '
        )}
      </span>
    </button>
  );
}

export default LikedSongsButton;
