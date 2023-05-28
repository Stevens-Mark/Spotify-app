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
  const totalNumber = queryResults?.albums?.total;
  const currentNumber = queryResults?.albums?.items.length;

  useEffect(() => {
    if (!query) {
      router.push('/search');
    }
  }, [query, router]);

  const mergeAlbums = (data) => {
    const existingItems = queryResults.albums.items;
    const newItems = data.albums.items.filter((newItem) => {
      return !existingItems.some(
        (existingAlbum) => existingAlbum.name == newItem.name
      );
    });

    const albumMerged = {
      albums: {
        href: queryResults.albums.href,
        items: existingItems.concat(newItems),
        limit: queryResults.albums.limit,
        next: queryResults.albums.next,
        offset: queryResults.albums.offset,
        previous: queryResults.albums.previous,
        total: queryResults.albums.total,
      },
      artists: { ...queryResults.artists, ...data.artists },
      episodes: { ...queryResults.episodes, ...data.episodes },
      playlists: { ...queryResults.playlists, ...data.playlists },
      shows: { ...queryResults.shows, ...data.shows },
      tracks: { ...queryResults.tracks, ...data.tracks },
    };
    return albumMerged;
  };

  const fetchMoreAlbums = () => {
    const itemsPerPage = 50;
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
            const updatedList = mergeAlbums(data.body);
            setQueryResults(updatedList);
          },
          function (err) {
            console.log('Get more album items failed:', err);
          }
        );
    }
  };

  return (
    <div className="bg-black overflow-y-scroll h-screen scrollbar-hide px-8 pt-2 pb-56">
      {totalNumber === 0 ? (
        <span className="flex items-center h-full justify-center">
          <h1 className="text-white text-2xl md:text-3xl 2xl:text-4xl">
            Sorry no Albums
          </h1>
        </span>
      ) : (
        <>
          {/* album list here */}
          <h1 className="text-white mb-5 text-2xl md:text-3xl 2xl:text-4xl">
            Albums
          </h1>
          <div className="grid xxs:grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-6">
            {albums?.map((item, i) => (
              <Link
                href=""
                key={`${item.id}-${i}`}
                className={`group relative rounded-lg cursor-pointer hover:bg-gray-800 transition delay-100 duration-300 ease-in-out pb-8`}
              >
                <div className="relative p-2 sm:p-2 md:p-3 xl:p-4">
                  <Image
                    className="aspect-square w-full rounded-md"
                    src={item.images[0].url}
                    alt="cover"
                    width={100}
                    height={100}
                  />

                  <button className=" absolute bottom-24 right-7 bg-black rounded-full opacity-0 shadow-3xl text-green-500 group-hover:-translate-y-2 transition delay-100 duration-300 ease-in-out group-hover:opacity-100 hover:scale-110">
                    <PlayCircleIcon className="w-12 h-12 -m-2" />
                  </button>

                  <h2 className="text-white capitalize mt-2 line-clamp-1">
                    {item.name.replace('/', ' & ')}
                  </h2>
                  <span className="flex flex-wrap text-pink-swan mt-2 h-10">
                    <span>{item.release_date.slice(0, 4)}&nbsp;•&nbsp;</span>

                    {item.artists.slice(0, 2).map((item) => (
                      <span className="truncate" key={item.id}>
                        {item.name}.&nbsp;
                      </span>
                    ))}
                  </span>
                </div>
              </Link>
            ))}
          </div>
          {totalNumber > currentNumber && (
            <button
              className="flex justify-end w-full mt-4 space-x-2 text-xl md:text-2xl2xl:text-3xl text-white  hover:text-green-500"
              onClick={() => {
                fetchMoreAlbums();
              }}
            >
              <span>Add More</span>
            </button>
          )}
        </>
      )}
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
