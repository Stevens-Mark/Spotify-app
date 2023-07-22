import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { SpeakerWaveIcon } from '@heroicons/react/24/solid';

function LikedButton({ myPlaylistId, activePlaylist, isPlaying }) {
  const router = useRouter();

  const collection = {
    id: 'liked',
    type: 'liked',
    name: 'Liked Songs',

    images: [
      {
        height: 640,
        url: '/images/LikedSongs.png',
        width: 640,
      },
    ],
  };

  const handleClick = () => {
    router.push(`liked`);
  };

  return (
    <li>
      <button
        onClick={() => handleClick(collection?.id)}
        className={`flex items-center p-3 rounded-lg min-w-full cursor-pointer
              ${
                activePlaylist == collection?.id && isPlaying
                  ? 'text-green-500'
                  : 'hover:text-white'
              } 
              ${
                myPlaylistId == collection?.id
                  ? ` bg-gray-900 hover:bg-gray-800`
                  : 'hover:bg-gray-900'
              }
            `}
      >
        <Image
          className="h-8 w-8 mr-1 rounded-sm"
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
    </li>
  );
}

export default LikedButton;
