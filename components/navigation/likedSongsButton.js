import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { SpeakerWaveIcon } from '@heroicons/react/24/solid';

/**
 * Render Liked song Button in Navigation sidebar
 * @function LikedButton
 * @param {string} activePlaylistId
 * @param {string} activePlaylist
 * @param {boolean} isPlaying
 * @returns {JSX}
 */
function LikedSongsButton({
  activePlaylistId,
  // activePlaylist,
  isPlaying,
}) {
  const activePlaylist = null; // disabled highlight on active functionality as issues

  const router = useRouter();

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
    if (activePlaylistId !== collection?.id) {
      // if on likesongs page this check stops the page being reloaded & loosing previously loaded song data
      router.push(`/collection`);
    }
  };

  return (
    <button
      onClick={() => handleCollectionClick(collection?.id)}
      aria-label="Go to Liked Songs"
      className={`flex items-center p-3  rounded-lg min-w-full cursor-pointer
              ${
                activePlaylist == collection?.id && isPlaying
                  ? 'text-green-500'
                  : 'hover:text-white focus:text-white'
              } 
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
      <p className="line-clamp-1">{collection?.name}</p>
      <span className="pl-2">
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
