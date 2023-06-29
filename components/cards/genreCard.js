import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
// import { bgColors } from '@/styles/colors';

// color options for genre card backgrounds: total: 26
const bgColors = [
  'bg-cyan-600',
  'bg-lime-600',
  'bg-red-700',
  'bg-amber-400',
  'bg-stone-400',
  'bg-cyan-400',
  'bg-yellow-500',
  'bg-teal-600',
  'bg-lime-400',
  'bg-fuchsia-500',
  'bg-orange-600',
  'bg-green-600',
  'bg-teal-400',
  'bg-blue-500',
  'bg-emerald-400',
  'bg-yellow-700',
  'bg-amber-600',
  'bg-sky-600',
  'bg-red-600',
  'bg-orange-400',
  'bg-emerald-600',
  'bg-violet-400',
  'bg-pink-500',
  'bg-purple-400',
  'bg-gray-500',
  'bg-blue-700',
];

/**
 * Render a card for a genre
 * @function GenreCard
 * @param {object} item (genre info)
 * @param {number} idx (index)
 * @returns {JSX}
 */
function GenreCard({ item, idx }) {
  return (
    <Link
      href=""
      className={`relative overflow-hidden rounded-lg  aspect-square cursor-pointer ${
        bgColors[idx % bgColors?.length]
      }`}
    >
      <h3 className="relative z-10 capitalize px-3 py-4 text-xl md:text-2xl2xl:text-3xl">
        {item.name.replace('/', ' & ')}
      </h3>
      <Image
        className="absolute bottom-3 right-0 origin-bottom-left rotate-[30deg] w-3/4 h-3/4"
        src={item?.icons?.[0].url}
        alt=""
        width={100}
        height={100}
        style={{ objectFit: 'cover' }}
      />
    </Link>
  );
}

export default GenreCard;
