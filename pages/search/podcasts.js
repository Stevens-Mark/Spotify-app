import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import useSpotify from '@/hooks/useSpotify';
// import state management recoil
import { useRecoilState, useRecoilValue } from 'recoil';
import { searchResultState, queryState } from '@/atoms/searchAtom';
// import layouts
import Layout from '@/components/Layout';
import NestedLayout from '@/components/NestLayout';
import Card from '@/components/cards/card';

function PodcastAndEpisodes() {
  const spotifyApi = useSpotify();
  const router = useRouter();
  const [queryResults, setQueryResults] = useRecoilState(searchResultState);
  const [currentOffset, setCurrentOffset] = useState(0);
  const query = useRecoilValue(queryState);

  const shows = queryResults?.shows?.items;
  const totalNumber = queryResults?.shows?.total;
  const currentNumber = queryResults?.shows?.items.length;

  useEffect(() => {
    if (!query) {
      router.push('/search');
    }
  }, [query, router]);

  const mergeShows = (data) => {
    const existingItems = queryResults.shows.items;
    const newItems = data.shows.items.filter((newItem) => {
      return !existingItems.some(
        (existingShows) => existingShows.id == newItem.id
      );
    });

    const showsMerged = {
      shows: {
        href: queryResults.shows.href,
        items: existingItems.concat(newItems),
        limit: queryResults.shows.limit,
        next: queryResults.shows.next,
        offset: queryResults.shows.offset,
        previous: queryResults.shows.previous,
        total: queryResults.shows.total,
      },
      albums: { ...queryResults.albums, ...data.albums },
      artists: { ...queryResults.artists, ...data.artists },
      episodes: { ...queryResults.episodes, ...data.episodes },
      playlists: { ...queryResults.playlists, ...data.playlists },
      tracks: { ...queryResults.tracks, ...data.tracks },
    };
    return showsMerged;
  };

  const fetchMoreShows = () => {
    const itemsPerPage = 50;
    const nextOffset = currentOffset + itemsPerPage;
    setCurrentOffset(nextOffset);

    if (spotifyApi.getAccessToken()) {
      spotifyApi
        .searchShows(query, {
          offset: nextOffset,
          limit: itemsPerPage,
        })
        .then(
          function (data) {
            const updatedList = mergeShows(data.body);
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
            Sorry no Shows/Podcasts
          </h1>
        </span>
      ) : (
        <>
          {/* shows/postcasts list here */}
          <h1 className="text-white mb-5 text-2xl md:text-3xl 2xl:text-4xl">
            Podcasts & Shows
          </h1>
          <div className="grid xxs:grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-6">
            {shows?.map((item, i) => (
              <Card key={`${item.id}-${i}`} type={'podcast'} item={item} />
            ))}
          </div>
          {totalNumber > currentNumber && (
            <span className="flex justify-end w-full mt-4">
              <button
                className="text-xl md:text-2xl2xl:text-3xl text-white hover:text-green-500"
                onClick={() => {
                  fetchMoreShows();
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

export default PodcastAndEpisodes;

PodcastAndEpisodes.getLayout = function getLayout(page) {
  return (
    <Layout>
      <NestedLayout>{page}</NestedLayout>
    </Layout>
  );
};
