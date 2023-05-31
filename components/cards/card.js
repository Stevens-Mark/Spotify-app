import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PlayCircleIcon } from '@heroicons/react/24/solid';
import noImage from '@/public/images/noImageAvailable.svg';
import { capitalize } from '@/lib/capitalize';

/**
 * Render a card for either album, playlist, podcast, artist, or recentsearch
 * @function Card
 * @param {object} item (album, playlist, podcast, artist, or recentsearch info)
 * @param {string} type of card
 * @returns {JSX}
 */
function Card({ item, type }) {
  return (
    <Link
      href=""
      className={`group relative rounded-lg cursor-pointer bg-gray-900 hover:bg-gray-800 transition delay-100 duration-300 ease-in-out pb-8`}
    >
      <div className="relative p-2 sm:p-2 md:p-3 xl:p-4">
        <Image
          className={`aspect-square w-full shadow-image ${
            type === 'artist' ? 'rounded-full' : 'rounded-md'
          }`}
          src={item.images?.[0]?.url || noImage}
          alt="cover"
          width={100}
          height={100}
        />
        {type !== 'podcast' && (
          <button className=" absolute bottom-24 right-7 bg-black rounded-full opacity-0 shadow-3xl text-green-500 group-hover:-translate-y-2 transition delay-100 duration-300 ease-in-out group-hover:opacity-100 hover:scale-110">
            <PlayCircleIcon className="w-12 h-12 -m-2" />
          </button>
        )}

        <h2 className="text-white capitalize mt-2 line-clamp-1">
          {item.name.replace('/', ' & ')}
        </h2>

        <div className="flex flex-wrap text-pink-swan mt-2 h-10">
          {/* album */}
          {type === 'album' && (
            <>
              <span>{item.release_date.slice(0, 4)}&nbsp;•&nbsp;</span>
              {item.artists.slice(0, 2).map((item) => (
                <span className="truncate" key={item.id}>
                  {item.name}.&nbsp;
                </span>
              ))}
            </>
          )}

          {/* playlist*/}
          {type === 'playlist' && (
            <span className="truncate">
              By {capitalize(item.owner.display_name)}
            </span>
          )}

          {/*artist*/}
          {type === 'artist' && (
            <span className="truncate">{capitalize(item.type)}</span>
          )}

          {/* podcast */}
          {type === 'podcast' && (
            <span className="truncate">{capitalize(item.publisher)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default Card;
