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
import { PlayCircleIcon } from '@heroicons/react/24/solid';

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

  const mergeObjects = (data) => {
    const existingItems = queryResults.albums.items;
    const newItems = data.albums.items.filter((newAlbum) => {
      return !existingItems.some(
        (existingAlbum) => existingAlbum.name == newAlbum.name
      );
    });

    const mergedObject = {
      albums: {
        href: queryResults.albums.href,
        items: existingItems.concat(newItems),
        limit: queryResults.albums.limit,
        next: queryResults.albums.next,
        offset: queryResults.albums.offset,
        previous: queryResults.albums.previous,
        total: queryResults.albums.total + data.albums.total,
      },
      artists: { ...queryResults.artists, ...data.artists },
      episodes: { ...queryResults.episodes, ...data.episodes },
      playlists: { ...queryResults.playlists, ...data.playlists },
      shows: { ...queryResults.shows, ...data.shows },
      tracks: { ...queryResults.tracks, ...data.tracks },
    };
    return mergedObject;
  };

  const fetchMore = () => {
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
            const updatedList = mergeObjects(data.body);
            setQueryResults(updatedList);
          },
          function (err) {
            console.log('Get more album items failed:', err);
          }
        );
    }
  };

  return (
    <div className=" bg-black overflow-y-scroll h-screen  scrollbar-hide px-8 pt-2 pb-56">
      {/* album list here */}
      <h1 className="text-white mb-5 text-2xl md:text-3xl 2xl:text-4xl">
        Albums
      </h1>
      <div className="grid xxs:grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-6">
        {albums?.map((item, i) => (
          <Link
            href=""
            key={`${item.id}-${i}`}
            className={`group relative rounded-lg cursor-pointer hover:bg-gray-800 transition delay-100 duration-300 ease-in-out`}
          >
            <Image
              className="w-full p-5 pb-20 h-full"
              src={item.images[0].url}
              alt="user"
              width={100}
              height={100}
            />
            <button class="absolute bottom-20 right-7 bg-black rounded-full opacity-0 shadow-3xl text-green-500 group-hover:-translate-y-2 transition delay-100 duration-300 ease-in-out group-hover:opacity-100">
              <PlayCircleIcon className="w-12 h-12 -m-2" />
            </button>

            <h2 className="text-white absolute bottom-8 capitalize px-3 pt-4 line-clamp-1">
              {item.name.replace('/', ' & ')}
            </h2>
            <span className="flex flex-wrap absolute bottom-2 px-2 text-pink-swan">
              <span>{item.release_date.slice(0, 4)}</span>
              <span>&nbsp;• {item.artists[0].name}</span>
              {/* {item.artists.map((item) => (
                <span key={item.id}>&nbsp;• {item.name}</span>
              ))} */}
            </span>
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
