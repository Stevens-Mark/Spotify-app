import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import useSpotify from '@/hooks/useSpotify';
// import state management recoil
import { useRecoilState, useRecoilValue } from 'recoil';
import { searchResultState, queryState } from '@/atoms/searchAtom';
// import layouts
import Layout from '@/components/Layout';
import NestedLayout from '@/components/NestLayout';
import EpisodeCard from '@/components/cards/episodeCard';

/**
 * Renders the list of Episodes from search.
 * @function Episodes
 * @returns {JSX}
 */
function Episodes() {
  const spotifyApi = useSpotify();
  const router = useRouter();
  const [queryResults, setQueryResults] = useRecoilState(searchResultState);
  const [currentOffset, setCurrentOffset] = useState(0);
  const query = useRecoilValue(queryState);

  const episodes = queryResults?.episodes?.items;
  const totalNumber = queryResults?.episodes?.total;
  const currentNumber = queryResults?.episodes?.items.length;

  useEffect(() => {
    if (!query) {
      router.push('/search');
    }
  }, [query, router]);

  /**
   * merges next set of fetched episodes into current episodes list
   * @function mergedEpisodes
   * @param {object} data next set of fetched episodes
   * @returns {object} updated queryResults
   */
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

  /**
   * Fetches more episodes & updates the list of episodes
   * @function fetchMoreEpisodes
   * @returns {object} updated list of episodes in queryResults
   */
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
    <section className="bg-black overflow-y-scroll h-screen scrollbar-hide px-8 pt-2 pb-56">
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
          <div className="flex flex-col">
            {episodes?.map((item, i) => (
              <EpisodeCard key={`${item.id}-${i}`} item={item} />
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
    </section>
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
