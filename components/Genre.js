import React from 'react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
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

  useEffect(() => {
    if (genres === null) {
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
      // spotifyApi.getAvailableGenreSeeds().then(
      //   function (data) {
      //     let genreSeeds = data.body;
      //     console.log('genreSeeds ', genreSeeds);
      //   },
      //   function (err) {
      //     console.log('Something went wrong!', err);
      //   }
      // );
    }
  }, [genres, setGenres, spotifyApi]);

  const [offset, setOffset] = useState(51);
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
          setGenres([...genres, ...data.body.categories.items]);
        },
        function (err) {
          console.log('Failed to get genres!', err);
        }
      );
  };

  const genrleList = [...new Set(genres)];

  console.log(genrleList);

  return (
    <div className="overflow-y-scroll h-screen text-white scrollbar-hide p-8 pb-48">
      {/* genres list here */}
      <h2 className="text-white mb-5 text-2xl md:text-3xl 2xl:text-4xl">
        Browse all {genrleList?.length} Genres
      </h2>
      <div className="grid xxs:grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-6">
        {genrleList?.map((genre, i) => (
          <div
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
          </div>
        ))}
      </div>
      <button
        className="flex items-center space-x-2 hover:text-white"
        onClick={() => {
          setOffset(offset + 50);
          fetchGenre();
        }}
        // onClick={() => fetchGenre()}
      >
        <p>Add More</p>
      </button>
    </div>
  );
}

export default Genre;
