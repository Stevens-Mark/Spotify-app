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
 * Renders the list of Playlists from search.
 * @function Playlists
 * @returns {JSX}
 */
function Playlists() {
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

  const playlists = queryResults?.playlists?.items;
  const totalNumber = queryResults?.playlists?.total;

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
   * Fetches more playlists & updates the list of playlists
   * @function fetchMoreData
   * @returns {object} updated list of playlists in queryResults
   */
  const fetchMoreData = () => {
    if (!stopFetch) {
      const nextOffset = currentOffset + itemsPerPage;
      setIsSearching(true);

      if (spotifyApi.getAccessToken()) {
        spotifyApi
          .searchPlaylists(query, {
            offset: nextOffset,
            limit: itemsPerPage,
          })
          .then(
            function (data) {
              const updatedList = mergeObject(
                data.body,
                queryResults,
                'playlists'
              );
              setStopFetch(data?.body?.playlists?.next === null);
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
        <title>Provided by Spotify - Results for Playlists</title>
        <link rel="icon" href="/spotify.ico"></link>
      </Head>
      <MediaResultList
        mediaList={playlists}
        totalNumber={totalNumber}
        showButton={showButton}
        scrollToTop={scrollToTop}
        scrollableSectionRef={scrollableSectionRef}
        containerRef={containerRef}
      />
    </>
  );
}

export default Playlists;

Playlists.getLayout = function getLayout(page) {
  return (
    <Layout>
      <NestedLayout>{page}</NestedLayout>
    </Layout>
  );
};
