import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PlayCircleIcon } from '@heroicons/react/24/solid';
import noImage from '@/public/images/noImageAvailable.svg';
// import functions
import { capitalize } from '@/lib/capitalize';

/**
 * Render a card for either album, playlist, podcast, artist, or recentsearch
 * @function TopResultCard
 * @param {object} item (album, playlist, podcast, artist, or recentsearch info)
 * @param {string} type of card
 * @returns {JSX}
 */
function TopResultCard({ item, type }) {
  return (
    <Link href="" className="group">
      <div className="relative p-4 rounded-lg bg-gray-900 hover:bg-gray-800 transition delay-100 duration-300 ease-in-out h-60">
        <Image
          className={`aspect-square shadow-image ${
            type === 'artist' ? 'rounded-full' : 'rounded-md'
          }`}
          src={
            item?.images?.[0]?.url || item?.album?.images?.[0]?.url || noImage
          }
          alt=""
          width={100}
          height={100}
        />

        <button className="absolute bottom-4 right-7 bg-black rounded-full opacity-0 shadow-3xl text-green-500 group-hover:-translate-y-2 transition delay-100 duration-300 ease-in-out group-hover:opacity-100 hover:scale-110">
          <PlayCircleIcon className="w-12 h-12 -m-2" />
        </button>

        <h2 className="text-white capitalize mt-4 truncate text-xl md:text-2xl 2xl:text-3xl">
          {item?.name.replace('/', ' & ')}
        </h2>

        <div className="flex flex-wrap text-pink-swan mt-2">
          {/* album */}
          {type === 'album' && (
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
          {type === 'playlist' && (
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
          {type === 'artist' && (
            <span className="text-white bg-zinc-800 rounded-3xl px-3 py-[0.5px]">
              {capitalize(item?.type)}
            </span>
          )}

          {/* track */}
          {type === 'track' && (
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
