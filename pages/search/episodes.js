import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import useSpotify from '@/hooks/useSpotify';
import useScrollToTop from '@/hooks/useScrollToTop';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
// import state management recoil
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  searchResultState,
  queryState,
  searchingState,
} from '@/atoms/searchAtom';
import { errorState } from '@/atoms/errorAtom';
// import functions
import { mergeObject } from '@/lib/merge';
// import layouts/components
import Layout from '@/components/layouts/Layout';
import NestedLayout from '@/components/layouts/NestedLayout';
import EpisodeCard from '@/components/cards/episodeCard';
import { ArrowUpCircleIcon } from '@heroicons/react/24/solid';

/**
 * Renders the list of Episodes from search.
 * @function Episodes
 * @returns {JSX}
 */
function Episodes() {
  const spotifyApi = useSpotify();
  const router = useRouter();
  const { scrollableSectionRef, showButton, scrollToTop } = useScrollToTop(); // scroll button

  const [queryResults, setQueryResults] = useRecoilState(searchResultState);
  const [currentOffset, setCurrentOffset] = useState(0);
  const query = useRecoilValue(queryState);
  const setIsSearching = useSetRecoilState(searchingState);
  const setIsError = useSetRecoilState(errorState);

  const episodes = queryResults?.episodes?.items;
  const totalNumber = queryResults?.episodes?.total;

  useEffect(() => {
    if (!query) {
      router.push('/search');
    }
  }, [query, router]);

  /**
   * Fetches more episodes & updates the list of episodes
   * @function fetchMoreData
   * @returns {object} updated list of episodes in queryResults
   */
  const fetchMoreData = () => {
    const itemsPerPage = 30;
    const nextOffset = currentOffset + itemsPerPage;
    setCurrentOffset(nextOffset);
    setIsSearching(true);
    if (spotifyApi.getAccessToken()) {
      spotifyApi
        .searchEpisodes(query, {
          offset: nextOffset,
          limit: itemsPerPage,
        })
        .then(
          function (data) {
            const updatedList = mergeObject(
              data.body,
              queryResults,
              'episodes'
            );
            setQueryResults(updatedList);
            setIsSearching(false);
          },
          function (err) {
            setIsSearching(false);
            setIsError(true);
            console.log('Retrieving more items failed:', err);
          }
        );
    }
  };
  const containerRef = useInfiniteScroll(fetchMoreData);

  return (
    <section
      className="bg-black overflow-y-scroll h-screen scrollbar-hide px-8 pt-2 pb-56"
      ref={(node) => {
        containerRef.current = node;
        scrollableSectionRef.current = node;
      }}
    >
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
        </>
      )}
      {showButton && (
        <button
          className="fixed bottom-28 isSm:bottom-36 right-2 isSm:right-4 rounded-full hover:scale-110 duration-150 ease-in-out"
          onClick={scrollToTop}
        >
          <ArrowUpCircleIcon className="w-12 h-12 text-green-500" />
        </button>
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
