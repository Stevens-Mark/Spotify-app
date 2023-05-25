import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

import useSpotify from '@/hooks/useSpotify';
// import state management recoil
import { useRecoilState, useRecoilValue } from 'recoil';
import { searchResultState, queryState } from '@/atoms/searchAtom';
// import layouts
import Layout from '@/components/Layout';
import NestedLayout from '@/components/NestLayout';

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

function Albums() {
  const spotifyApi = useSpotify();
  const router = useRouter();
  const [queryResults, setQueryResults] = useRecoilState(searchResultState);
  const [currentOffset, setCurrentOffset] = useState(0);
  const query = useRecoilValue(queryState);

  const albums = queryResults?.albums?.items;

  useEffect(() => {
    if (!query) {
      router.push('/search');
    }
  }, [query, router]);

  function mergeObjects(queryResults, data) {
    const existingItems = queryResults.albums.items;
    const newItems = data.albums.items.filter(newAlbum => {
      return !existingItems.some(existingAlbum => existingAlbum.name == newAlbum.name);
    });

    const mergedObject = {
      albums: {
        href: queryResults.albums.href,
        items: existingItems.concat(newItems),
        limit: queryResults.albums.limit,
        next: queryResults.albums.next,
        offset: queryResults.albums.offset,
        previous: queryResults.albums.previous,
        total: queryResults.albums.total + data.albums.total
      },
      artists: { ...queryResults.artists, ...data.artists },
      episodes: { ...queryResults.episodes, ...data.episodes },
      playlists: { ...queryResults.playlists, ...data.playlists },
      shows: { ...queryResults.shows, ...data.shows },
      tracks: { ...queryResults.tracks, ...data.tracks }
    };
  
    return mergedObject;
  }

  function fetchMore() {
    const itemsPerPage = 20;
    const nextOffset = currentOffset + itemsPerPage;
    setCurrentOffset(nextOffset);

    if (spotifyApi.getAccessToken()) {
      spotifyApi
        .searchAlbums(query, {
          offset: nextOffset,
          limit: itemsPerPage,
        })
        .then(
          function (data) {
            const updatedList = mergeObjects(queryResults, data.body);
            setQueryResults(updatedList);
          },
          function (err) {
            console.log('Get more album items failed:', err);
          }
        );
    }
  }

  return (
    <div className=" bg-black overflow-y-scroll h-screen text-white scrollbar-hide  px-8 pt-2 pb-56">
      {/* album list here */}
      <h1 className="text-white mb-5 text-2xl md:text-3xl 2xl:text-4xl">
        Albums
      </h1>
      <div className="grid xxs:grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-6">
        {albums?.map((item, i) => (
          <Link
            href=""
            key={`${item.id}-${i}`}
            className={`relative overflow-hidden rounded-lg  aspect-square cursor-pointer ${
              bgColors[i % bgColors.length]
            }`}
          >
            <h2 className="relative z-10 capitalize px-3 py-4 text-xl md:text-2xl2xl:text-3xl">
              {item.name.replace('/', ' & ')}
            </h2>
            <Image
              className="absolute bottom-3 right-0 origin-bottom-left rotate-[30deg] w-3/4 h-3/4"
              src={item.images[0].url}
              alt="user"
              width={100}
              height={100}
            />
          </Link>
        ))}
      </div>
      <button
        className="flex justify-end w-full mt-4 space-x-2 text-xl md:text-2xl2xl:text-3xl text-white  hover:text-green-500"
        onClick={() => {
          fetchMore();
        }}
      >
        <span>Add More</span>
      </button>
    </div>
  );
}

export default Albums;

Albums.getLayout = function getLayout(page) {
  return (
    <Layout>
      <NestedLayout>{page}</NestedLayout>
    </Layout>
  );
};
