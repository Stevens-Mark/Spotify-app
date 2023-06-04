import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import useSpotify from '@/hooks/useSpotify';
// import state management recoil
import { useRecoilState, useRecoilValue } from 'recoil';
import { searchResultState, queryState } from '@/atoms/searchAtom';
// import functions
import { msToTime, getMonthYear } from '@/lib/time';
import { capitalize } from '@/lib/capitalize';
// import layouts
import Layout from '@/components/Layout';
import NestedLayout from '@/components/NestLayout';
import noImage from '@/public/images/noImageAvailable.svg';

function Episodes() {
  const spotifyApi = useSpotify();
  const router = useRouter();
  const [queryResults, setQueryResults] = useRecoilState(searchResultState);
  const [currentOffset, setCurrentOffset] = useState(0);
  const query = useRecoilValue(queryState);

  console.log(queryResults);

  const episodes = queryResults?.episodes?.items;
  const totalNumber = queryResults?.episodes?.total;
  const currentNumber = queryResults?.episodes?.items.length;

  useEffect(() => {
    if (!query) {
      router.push('/search');
    }
  }, [query, router]);

  const mergeEpisodes = (data) => {
    const existingItems = queryResults.episodes.items;
    const newItems = data.episodes.items.filter((newItem) => {
      return !existingItems.some(
        (existingEpisodes) => existingEpisodes.id == newItem.id
      );
    });

    const episodesMerged = {
      episodes: {
        href: queryResults.episodes.href,
        items: existingItems.concat(newItems),
        limit: queryResults.episodes.limit,
        next: queryResults.episodes.next,
        offset: queryResults.episodes.offset,
        previous: queryResults.episodes.previous,
        total: queryResults.episodes.total,
      },
      albums: { ...queryResults.albums, ...data.albums },
      artists: { ...queryResults.artists, ...data.artists },
      shows: { ...queryResults.shows, ...data.shows },
      playlists: { ...queryResults.playlists, ...data.playlists },
      tracks: { ...queryResults.tracks, ...data.tracks },
    };
    return episodesMerged;
  };

  const fetchMoreEpisodes = () => {
    const itemsPerPage = 50;
    const nextOffset = currentOffset + itemsPerPage;
    setCurrentOffset(nextOffset);

    if (spotifyApi.getAccessToken()) {
      spotifyApi
        .searchEpisodes(query, {
          offset: nextOffset,
          limit: itemsPerPage,
        })
        .then(
          function (data) {
            const updatedList = mergeEpisodes(data.body);
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
            Sorry no Episodes
          </h1>
        </span>
      ) : (
        <>
          {/* album list here */}
          <h1 className="text-white mb-5 text-2xl md:text-3xl 2xl:text-4xl">
            Episodes
          </h1>
          <div className="grid xxs:grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-6">
            {episodes?.map((item, i) => (
              <Link
                href=""
                key={`${item.id}-${i}`}
                className={`group relative rounded-lg cursor-pointer bg-gray-900 hover:bg-gray-800 transition delay-100 duration-300 ease-in-out pb-8`}
              >
                <div className="relative p-2 sm:p-2 md:p-3 xl:p-4">
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
                    <p className=" line-clamp-2">{item.description}</p>
                    <span>{getMonthYear(item.release_date)}&nbsp;•&nbsp;</span>
                    <span>{msToTime(item.duration_ms)}</span>
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
                  fetchMoreEpisodes();
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

export default Episodes;

Episodes.getLayout = function getLayout(page) {
  return (
    <Layout>
      <NestedLayout>{page}</NestedLayout>
    </Layout>
  );
};
