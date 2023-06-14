import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { bgColors } from '@/styles/colors';

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
        bgColors[idx % bgColors.length]
      }`}
    >
      <h3 className="relative z-10 capitalize px-3 py-4 text-xl md:text-2xl2xl:text-3xl">
        {item.name.replace('/', ' & ')}
      </h3>
      <Image
        className="absolute bottom-3 right-0 origin-bottom-left rotate-[30deg] w-3/4 h-3/4"
        src={item.icons[0].url}
        alt=""
        width={100}
        height={100}
        style={{objectFit:"cover"}}
      />
    </Link>
  );
}

export default GenreCard;
