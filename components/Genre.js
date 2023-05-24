import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import useSpotify from '@/hooks/useSpotify';
// import state management recoil
import { useRecoilState } from 'recoil';
import { genreState } from '@/atoms/genreAtom';

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

function Genre() {
  const spotifyApi = useSpotify();
  const [genres, setGenres] = useRecoilState(genreState);
  const [offset, setOffset] = useState(51);

  if (genres === null) {
    console.log('call api');
    if (spotifyApi.getAccessToken()) {
      spotifyApi
        .getCategories({
          limit: 50,
          offset: 0,
          country: 'US', // FR, US, GB
          locale: 'en_US', // fr_FR, en_US, en_GB
        })
        .then(
          function (data) {
            setGenres(data.body.categories.items);
          },
          function (err) {
            console.log('Failed to get genres!', err);
          }
        );
    }
  }

  const fetchGenre = () => {
    spotifyApi
      .getCategories({
        limit: 50,
        offset: offset,
        country: 'US', // FR, US, GB
        locale: 'en_US', // fr_FR, en_US, en_GB
      })
      .then(
        function (data) {
          const updatedList = [...genres, ...data.body.categories.items];
          // Always ensure there are no dublicate objects in the list of categories
          const genreList = updatedList.filter(
            (genre, index) =>
              index === updatedList.findIndex((other) => genre.id === other.id)
          );
          setGenres(genreList);
        },
        function (err) {
          console.log('Failed to get genres!', err);
        }
      );
  };

  return (
    <div className="overflow-y-scroll h-screen text-white scrollbar-hide px-8 pt-2 pb-48">
      {/* genres list here */}
      <h1 className="text-white mb-5 text-2xl md:text-3xl 2xl:text-4xl">
        Browse all Genres
      </h1>
      <div className="grid xxs:grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-6">
        {genres?.map((genre, i) => (
          <Link href=""
            key={`${genre.id}-${i}`}
            className={`relative overflow-hidden rounded-lg  aspect-square cursor-pointer ${
              bgColors[i % bgColors.length]
            }`}
          >
            <h2 className="relative z-10 capitalize px-3 py-4 text-xl md:text-2xl2xl:text-3xl">
              {genre.name.replace('/', ' & ')}
            </h2>
            <Image
              className="absolute bottom-3 right-0 origin-bottom-left rotate-[30deg] w-3/4 h-3/4"
              src={genre.icons[0].url}
              alt="user"
              width={100}
              height={100}
            />
          </Link>
        ))}
      </div>
      <button
        className="flex justify-end w-full mt-5 space-x-2 text-xl md:text-2xl2xl:text-3xl text-white  hover:text-green-500"
        onClick={() => {
          setOffset(offset + 50);
          fetchGenre();
        }}
      >
        <span>Add More</span>
      </button>
    </div>
  );
}

export default Genre;
