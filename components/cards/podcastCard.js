import React from 'react'
import Link from 'next/link';
import Image from 'next/image';
import { capitalize } from '@/lib/capitalize';
import noImage from '@/public/images/noImageAvailable.svg';

function EpisodeCard({item}) {
  return (
    <Link
    href=""
    className={`group relative rounded-lg cursor-pointer bg-gray-900 hover:bg-gray-800 transition delay-100 duration-300 ease-in-out pb-8`}
  >
    <article className="relative p-2 sm:p-2 md:p-3 xl:p-4">
      <Image
        className="aspect-square w-full rounded-md shadow-image"
        src={item.images?.[0]?.url || noImage}
        alt="cover"
        width={100}
        height={100}
      />

      <h2 className="text-white capitalize mt-2 line-clamp-1">
        {item.name.replace('/', ' & ')}
      </h2>
      <span className="flex flex-wrap text-pink-swan mt-2 h-10">
        <span>{capitalize(item.publisher)}</span>
      </span>
    </article>
  </Link>
  )
}

export default EpisodeCard
