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
import MediaResultList from '@/components/lists/mediaResultList';

/**
 * Renders the list of Podcasts/shows from search.
 * @function Shows
 * @returns {JSX}
 */
function Shows() {
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
    <MediaResultList
      mediaList={shows}
      totalNumber={totalNumber}
      showButton={showButton}
      scrollToTop={scrollToTop}
      scrollableSectionRef={scrollableSectionRef}
      containerRef={containerRef}
    />
  );
}

export default Shows;

Shows.getLayout = function getLayout(page) {
  return (
    <Layout>
      <NestedLayout>{page}</NestedLayout>
    </Layout>
  );
};
