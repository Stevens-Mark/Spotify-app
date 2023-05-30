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
import { capitalize } from '@/lib/capitalize';
import noImage from '@/public/images/noImageAvailable.svg';

function Artists() {
  const spotifyApi = useSpotify();
  const router = useRouter();
  const [queryResults, setQueryResults] = useRecoilState(searchResultState);
  const [currentOffset, setCurrentOffset] = useState(0);
  const query = useRecoilValue(queryState);

  const artists = queryResults?.artists?.items;
  const totalNumber = queryResults?.artists?.total;
  const currentNumber = queryResults?.artists?.items.length;

  useEffect(() => {
    if (!query) {
      router.push('/search');
    }
  }, [query, router]);

  const mergedArtists = (data) => {
    const existingItems = queryResults.artists.items;
    const newItems = data.artists.items.filter((newItem) => {
      return !existingItems.some(
        (existingArtists) => existingArtists.id == newItem.id
      );
    });

    const artistsMerged = {
      artists: {
        href: queryResults.artists.href,
        items: existingItems.concat(newItems),
        limit: queryResults.artists.limit,
        next: queryResults.artists.next,
        offset: queryResults.artists.offset,
        previous: queryResults.artists.previous,
        total: queryResults.artists.total,
      },
      albums: { ...queryResults.albums, ...data.albums },
      episodes: { ...queryResults.episodes, ...data.episodes },
      playlists: { ...queryResults.playlists, ...data.playlists },
      shows: { ...queryResults.shows, ...data.shows },
      tracks: { ...queryResults.tracks, ...data.tracks },
    };
    return artistsMerged;
  };

  const fetchMoreArtists = () => {
    const itemsPerPage = 50;
    const nextOffset = currentOffset + itemsPerPage;
    setCurrentOffset(nextOffset);

    if (spotifyApi.getAccessToken()) {
      spotifyApi
        .searchArtists(query, {
          offset: nextOffset,
          limit: itemsPerPage,
        })
        .then(
          function (data) {
            const updatedList = mergedArtists(data.body);
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
      {totalNumber === 0 ? (
        <span className="flex items-center h-full justify-center">
          <h1 className="text-white text-2xl md:text-3xl 2xl:text-4xl">
            Sorry no Artists
          </h1>
        </span>
      ) : (
        <>
          {/* artists list here */}
          <h1 className="text-white mb-5 text-2xl md:text-3xl 2xl:text-4xl">
            Artists
          </h1>
          <div className="grid xxs:grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-6">
            {artists?.map((item, i) => (
              <Link
                href=""
                key={`${item.id}-${i}`}
                className={`group relative rounded-lg cursor-pointer bg-gray-900 hover:bg-gray-800 transition delay-100 duration-300 ease-in-out pb-8`}
              >
                <div className="relative p-2 sm:p-2 md:p-3 xl:p-4">
                  <Image
                    className="aspect-square w-full rounded-full shadow-image"
                    src={item.images?.[0]?.url || noImage}
                    alt="cover"
                    width={100}
                    height={100}
                  />

                  <button className="absolute bottom-24 right-7 bg-black rounded-full opacity-0 shadow-3xl text-green-500 group-hover:-translate-y-2 transition delay-100 duration-300 ease-in-out group-hover:opacity-100 hover:scale-110">
                    <PlayCircleIcon className="w-12 h-12 -m-2" />
                  </button>

                  <h2 className="text-white capitalize mt-2 line-clamp-1">
                    {item.name.replace('/', ' & ')}
                  </h2>
                  <span className="flex flex-wrap text-pink-swan mt-2 h-10">
                    <span className="truncate">{capitalize(item.type)}</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
          {totalNumber > currentNumber && (
            <span className="flex justify-end w-full mt-4">
              <button
                className="text-xl md:text-2xl2xl:text-3xl text-white hover:text-green-500"
                onClick={() => {
                  fetchMoreArtists();
                }}
              >
                <span>Add More</span>
              </button>
            </span>
          )}
        </>
      )}
    </div>
  );
}

export default Artists;

Artists.getLayout = function getLayout(page) {
  return (
    <Layout>
      <NestedLayout>{page}</NestedLayout>
    </Layout>
  );
};
4