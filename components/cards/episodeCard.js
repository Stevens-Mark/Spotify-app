import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
// import functions
import { msToTime, getMonthYear } from '@/lib/time';
// import layouts
import noImage from '@/public/images/noImageAvailable.svg';
import { PlayCircleIcon } from '@heroicons/react/24/solid';

/**
 * Render a card for an episode
 * @function episodeCard
 * @param {object} item (episode info)
 * @returns {JSX}
 */
function episodeCard({ item }) {
  return (
    <Link href="">
      <div className="border-b-[0.25px] border-gray-800 max-w-3xl">
        <div className="grid grid-cols-[max-content_1fr_1fr] md:grid-cols-[max-content_max-content_1fr_1fr] grid-rows-[max-content_max-content_1fr] rounded-lg hover:bg-gray-800 transition delay-100 duration-300 ease-in-out  text-white p-2 md:p-3 xl:p-4">
          <Image
            className="col-span-1 row-start-1 row-end-1 md:row-end-4 aspect-square rounded-md shadow-image mr-5 w-16 md:w-32"
            src={item.images?.[0]?.url || noImage}
            alt="cover"
            width={100}
            height={100}
          />

          <h2 className="col-span-3 row-start-1 text-white capitalize line-clamp-2 self-center">
            {item.name.replace('/', ' & ')}
          </h2>

          <div className="col-span-4 md:col-span-3 row-start-2 text-pink-swan pt-2 pb-3">
            <span className=" line-clamp-2">{item.description}</span>
          </div>
          <div className="col-start-1 md:col-start-2 col-span-1">
            <PlayCircleIcon className="w-10 h-10 transition delay-100 duration-300 ease-in-out hover:scale-110" />
          </div>

          <span className="col-start-2 md:col-start-3 col-span-2 row-start-3 flex items-center text-pink-swan -ml-3  md:ml-3">
            <span className="line-clamp-1">
              {getMonthYear(item.release_date)}&nbsp;•&nbsp;
            </span>
            <span className="line-clamp-1">{msToTime(item.duration_ms)}</span>
          </span>
        </div>
      </div>
    </Link>
  );
}

export default episodeCard;
