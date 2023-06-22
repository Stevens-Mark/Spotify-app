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
import Card from '@/components/cards/card';
import { ArrowUpCircleIcon } from '@heroicons/react/24/solid';

/**
 * Renders the list of Podcasts/shows from search.
 * @function Podcasts
 * @returns {JSX}
 */
function Podcasts() {
  const spotifyApi = useSpotify();
  const router = useRouter();
  const { scrollableSectionRef, showButton, scrollToTop } = useScrollToTop(); // scroll button

  const [queryResults, setQueryResults] = useRecoilState(searchResultState);
  const [currentOffset, setCurrentOffset] = useState(0);
  const query = useRecoilValue(queryState);
  const setIsSearching = useSetRecoilState(searchingState);
  const setIsError = useSetRecoilState(errorState);

  const shows = queryResults?.shows?.items;
  const totalNumber = queryResults?.shows?.total;

  useEffect(() => {
    if (!query) {
      router.push('/search');
    }
  }, [query, router]);

  /**
   * Fetches more Podcasts/shows & updates the list of Podcasts/shows
   * @function fetchMoreData
   * @returns {object} updated list of Podcasts/shows in queryResults
   */
  const fetchMoreData = () => {
    const itemsPerPage = 30;
    const nextOffset = currentOffset + itemsPerPage;
    setCurrentOffset(nextOffset);
    setIsSearching(true);
    if (spotifyApi.getAccessToken()) {
      spotifyApi
        .searchShows(query, {
          offset: nextOffset,
          limit: itemsPerPage,
        })
        .then(
          function (data) {
            const updatedList = mergeObject(data.body, queryResults, 'shows');
            setQueryResults(updatedList);
            setIsSearching(false);
          },
          function (err) {
            setIsSearching(false);
            setIsError(true);
            console.log('Retrieving more items failed: ', err);
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
            Sorry no Shows/Podcasts
          </h1>
        </span>
      ) : (
        <>
          {/* shows/postcasts list here */}
          <h1 className="text-white mb-5 text-2xl md:text-3xl 2xl:text-4xl">
            Podcasts & Shows
          </h1>
          <div className="grid grid-cols-1 xxs:grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-6">
            {shows?.map((item, i) => (
              <Card key={`${item.id}-${i}`} item={item} />
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

export default Podcasts;

Podcasts.getLayout = function getLayout(page) {
  return (
    <Layout>
      <NestedLayout>{page}</NestedLayout>
    </Layout>
  );
};
