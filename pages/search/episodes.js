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
import { episodesListState, episodesUrisState } from '@/atoms/showAtom';
import { errorState } from '@/atoms/errorAtom';
// import functions
import { mergeObject } from '@/lib/merge';
// import layouts/components
import Layout from '@/components/layouts/Layout';
import NestedLayout from '@/components/layouts/NestedLayout';
import MediaResultList from '@/components/lists/mediaResultList';

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

  const [episodesUris, setEpisodesUris] = useRecoilState(episodesUrisState); // episodes uris (from search)
  const setEpisodesList = useSetRecoilState(episodesListState); // episodes list (from search)

  const [currentOffset, setCurrentOffset] = useState(0);
  const query = useRecoilValue(queryState);
  const setIsSearching = useSetRecoilState(searchingState);
  const setIsError = useSetRecoilState(errorState);
  const [stopFetch, setStopFetch] = useState(false);

  const episodes = queryResults?.episodes?.items;
  const totalNumber = queryResults?.episodes?.total;

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
   * Fetches more episodes & updates the list of episodes
   * @function fetchMoreData
   * @returns {object} updated list of episodes in queryResults
   */

  const fetchMoreData = () => {
    if (!stopFetch) {
      const itemsPerPage = 30;
      const nextOffset = currentOffset + itemsPerPage;
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
              setStopFetch(data?.body?.episodes?.next === null);
              setQueryResults(updatedList);
              setEpisodesList(updatedList);
              // Merge the new URIs into the existing episodesUris state
              const newUris = data.body?.episodes?.items.map(
                (item) => item.uri
              );

              setEpisodesUris((prevUris) => [...prevUris, ...newUris]);
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
        <title>Spotify - Results for Episodes</title>
        <link rel="icon" href="/spotify.ico"></link>
      </Head>
      <MediaResultList
        mediaList={episodes}
        totalNumber={totalNumber}
        showButton={showButton}
        scrollToTop={scrollToTop}
        scrollableSectionRef={scrollableSectionRef}
        containerRef={containerRef}
      />
    </>
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
