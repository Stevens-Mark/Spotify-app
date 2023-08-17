import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import noAlbum from '@/public/images/blank.svg';
// import custom hooks
import useSongInfo from '@/hooks/useSongInfo';

/**
 * Renders track info bottom left side
 * @function PlayingInfo
 * @returns {JSX}
 */
function PlayingInfo() {
  const songInfo = useSongInfo('episode');

  const linkAddress =
    songInfo?.type === 'episode'
      ? `/episode/${songInfo?.id}`
      : songInfo?.type === 'track'
      ? `/album/${songInfo?.album?.id}`
      : '/';

  return (
    <div className="flex items-center space-x-4">
      <Image
        className="hidden md:inline h-10 w-10"
        src={
          songInfo?.album?.images?.[0]?.url ||
          songInfo?.images?.[0]?.url ||
          noAlbum
        }
        alt="Artwork of track currently playing"
        width={100}
        height={100}
        style={{ objectFit: 'cover' }}
      />
      <div>
        <Link
          href={linkAddress}
          className="line-clamp-1 hover:text-white hover:underline"
        >
          {songInfo && songInfo.name ? (
            songInfo.name
          ) : (
            <span className="sr-only">Home</span>
          )}
        </Link>

        {songInfo?.artists && (
          <span className=" text-xs text-pink-swan line-clamp-1">
            {songInfo?.artists?.map((artist, index) => (
              <span key={artist?.id}>
                {index > 0 && ', '}
                <Link
                  href={`/artist/${artist?.id}`}
                  className="hover:text-white hover:underline"
                >
                  {artist?.name}
                </Link>
              </span>
            ))}
          </span>
        )}

        {songInfo?.show && (
          <Link
            href={`/show/${songInfo?.show?.id}`}
            className="text-xs text-pink-swan line-clamp-1 hover:text-white hover:underline"
          >
            {songInfo?.show?.name}
          </Link>
        )}
      </div>
    </div>
  );
}

export default PlayingInfo;
