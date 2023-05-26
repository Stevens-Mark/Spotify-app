import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import useSpotify from '@/hooks/useSpotify';
// import state management recoil
import { useRecoilState, useRecoilValue } from 'recoil';
import { searchResultState, queryState } from '@/atoms/searchAtom';
import { capitalize } from '@/lib/capitalize';
// import layouts
import Layout from '@/components/Layout';
import NestedLayout from '@/components/NestLayout';
import { PlayCircleIcon } from '@heroicons/react/24/solid';

function Playlists() {
  const spotifyApi = useSpotify();
  const router = useRouter();
  const [queryResults, setQueryResults] = useRecoilState(searchResultState);
  const [currentOffset, setCurrentOffset] = useState(0);
  const query = useRecoilValue(queryState);

  const playlists = queryResults?.playlists?.items;

  useEffect(() => {
    if (!query) {
      router.push('/search');
    }
  }, [query, router]);

  const mergedPlaylists = (data) => {
    const existingItems = queryResults.playlists.items;
    const newItems = data.playlists.items.filter((newPlaylist) => {
      return !existingItems.some(
        (existingPlaylist) => existingPlaylist.id == newPlaylist.id
      );
    });

    const playlistsMerged = {
      playlists: {
        href: queryResults.playlists.href,
        items: existingItems.concat(newItems),
        limit: queryResults.playlists.limit,
        next: queryResults.playlists.next,
        offset: queryResults.playlists.offset,
        previous: queryResults.playlists.previous,
        total: queryResults.playlists.total + data.playlists.total,
      },
      albums: { ...queryResults.albums, ...data.albums },
      artists: { ...queryResults.artists, ...data.artists },
      episodes: { ...queryResults.episodes, ...data.episodes },
      shows: { ...queryResults.shows, ...data.shows },
      tracks: { ...queryResults.tracks, ...data.tracks },
    };
    return playlistsMerged;
  };

  const fetchMorePlaylists = () => {
    const itemsPerPage = 20;
    const nextOffset = currentOffset + itemsPerPage;
    setCurrentOffset(nextOffset);

    if (spotifyApi.getAccessToken()) {
      spotifyApi
        .searchPlaylists(query, {
          offset: nextOffset,
          limit: itemsPerPage,
        })
        .then(
          function (data) {
            const updatedList = mergedPlaylists(data.body);
            setQueryResults(updatedList);
          },
          function (err) {
            console.log('Get more items failed:', err);
          }
        );
    }
  };

  return (
    <div className=" bg-black overflow-y-scroll h-screen scrollbar-hide px-8 pt-2 pb-56">
      {/* playlists list here */}
      <h1 className="text-white mb-5 text-2xl md:text-3xl 2xl:text-4xl">
        Playlists
      </h1>
      <div className="grid xxs:grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-6">
        {playlists?.map((item, i) => (
          <Link
            href=""
            key={`${item.id}-${i}`}
            className={`group relative rounded-lg cursor-pointer hover:bg-gray-800 transition delay-100 duration-300 ease-in-out`}
          >
            <div className="relative p-2 sm:p-2 md:p-3 xl:p-4">
              <Image
                className="aspect-square w-full rounded-md"
                src={item.images[0].url}
                alt="cover"
                width={100}
                height={100}
              />

              <button className="absolute bottom-24 right-7 bg-black rounded-full opacity-0 shadow-3xl text-green-500 group-hover:-translate-y-2 transition delay-100 duration-300 ease-in-out group-hover:opacity-100">
                <PlayCircleIcon className="w-12 h-12 -m-2" />
              </button>

              <h2 className="text-white capitalize mt-2 line-clamp-1">
                {item.name.replace('/', ' & ')}
              </h2>
              <span className="flex flex-wrap text-pink-swan mt-2 h-10">
                <span>By {capitalize(item.owner.display_name)}</span>
              </span>
            </div>
          </Link>
        ))}
      </div>
      <button
        className="flex justify-end w-full mt-4 space-x-2 text-xl md:text-2xl2xl:text-3xl text-white  hover:text-green-500"
        onClick={() => {
          fetchMorePlaylists();
        }}
      >
        <span>Add More</span>
      </button>
    </div>
  );
}

export default Playlists;

Playlists.getLayout = function getLayout(page) {
  return (
    <Layout>
      <NestedLayout>{page}</NestedLayout>
    </Layout>
  );
};
