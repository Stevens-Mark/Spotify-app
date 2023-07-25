import Head from 'next/head';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
// custom hooks
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
  const [stopFetch, setStopFetch] = useState(false);

  const shows = queryResults?.shows?.items;
  const totalNumber = queryResults?.shows?.total;

  useEffect(() => {
    if (!query) {
      router.push('/search');
    }
  }, [query, router]);

  // show message when all data loaded/end of infinite scrolling
  useEffect(() => {
    if (stopFetch) {
      toast.info("That's everything !", {
        theme: 'colored',
      });
    }
  }, [stopFetch]);

  /**
   * Fetches more Podcasts/shows & updates the list of Podcasts/shows
   * @function fetchMoreData
   * @returns {object} updated list of Podcasts/shows in queryResults
   */
  const fetchMoreData = () => {
    if (!stopFetch) {
      const itemsPerPage = 25;
      const nextOffset = currentOffset + itemsPerPage;
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
              setStopFetch(data?.body?.shows?.next === null);
              setQueryResults(updatedList);
              setIsSearching(false);
              setCurrentOffset(nextOffset);
            },
            function (err) {
              setIsSearching(false);
              setIsError(true);
              console.log('Retrieving more items failed ...');
              toast.error('Retrieving more items failed !', {
                theme: 'colored',
              });
            }
          );
      }
    }
  };
  const containerRef = useInfiniteScroll(fetchMoreData);

  return (
    <>
      <Head>
        <title>Provided by Spotify - Results for Shows</title>
        <link rel="icon" href="/spotify.ico"></link>
      </Head>
      <MediaResultList
        mediaList={shows}
        totalNumber={totalNumber}
        showButton={showButton}
        scrollToTop={scrollToTop}
        scrollableSectionRef={scrollableSectionRef}
        containerRef={containerRef}
      />
    </>
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
