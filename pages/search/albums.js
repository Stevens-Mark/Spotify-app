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
import { itemsPerPageState } from '@/atoms/otherAtoms';
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
 * Renders the list of Albums from search.
 * @function Albums
 * @returns {JSX}
 */
function Albums() {
  const spotifyApi = useSpotify();
  const router = useRouter();
  const { scrollableSectionRef, showButton, scrollToTop } = useScrollToTop(); // scroll button

  const itemsPerPage = useRecoilValue(itemsPerPageState);
  const [queryResults, setQueryResults] = useRecoilState(searchResultState);
  const [currentOffset, setCurrentOffset] = useState(0);
  const query = useRecoilValue(queryState);
  const setIsSearching = useSetRecoilState(searchingState);
  const setIsError = useSetRecoilState(errorState);
  const [stopFetch, setStopFetch] = useState(false);

  const albums = queryResults?.albums?.items;
  const totalNumber = queryResults?.albums?.total;

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
   * Fetches more albums & updates the list of albums
   * @function fetchMoreData
   * @returns {object} updated list of albums in queryResults
   */
  const fetchMoreData = () => {
    if (!stopFetch) {
      const nextOffset = currentOffset + itemsPerPage;
      setIsSearching(true);

      if (spotifyApi.getAccessToken()) {
        spotifyApi
          .searchAlbums(query, {
            offset: nextOffset,
            limit: itemsPerPage,
          })
          .then(
            function (data) {
              const updatedList = mergeObject(
                data.body,
                queryResults,
                'albums'
              );
              setStopFetch(data?.body?.album?.next === null);
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
        <title>Provided by Spotify - Results for Albums</title>
        <link rel="icon" href="/spotify.ico"></link>
      </Head>

      <MediaResultList
        mediaList={albums}
        totalNumber={totalNumber}
        showButton={showButton}
        scrollToTop={scrollToTop}
        scrollableSectionRef={scrollableSectionRef}
        containerRef={containerRef}
      />
    </>
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
