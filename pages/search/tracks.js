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
import { songsUrisState, songsListState } from '@/atoms/songAtom';
import { errorState } from '@/atoms/errorAtom';
// import functions
import { mergeObject } from '@/lib/merge';
// import layouts/components
import Layout from '@/components/layouts/Layout';
import NestedLayout from '@/components/layouts/NestedLayout';
import MediaResultList from '@/components/lists/mediaResultList';

/**
 * Renders the list of Albums from search.
 * @function Tracks
 * @returns {JSX}
 */
function Tracks() {
  const spotifyApi = useSpotify();
  const router = useRouter();
  const { scrollableSectionRef, showButton, scrollToTop } = useScrollToTop(); // scroll button

  const [queryResults, setQueryResults] = useRecoilState(searchResultState);
  const setSongsUris = useSetRecoilState(songsUrisState); // song uris (from search)
  const [songsList, setSongsList] = useRecoilState(songsListState); // songs list (from search)

  const [currentOffset, setCurrentOffset] = useState(0);
  const query = useRecoilValue(queryState);
  const setIsSearching = useSetRecoilState(searchingState);
  const setIsError = useSetRecoilState(errorState);
  const [stopFetch, setStopFetch] = useState(false);

  const totalNumber = queryResults?.tracks?.total;

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
   * Fetches more tracks & updates the list of tracks
   * @function fetchMoreData
   * @returns {object} updated list of tracks & uris
   */
  const fetchMoreData = () => {
    if (!stopFetch) {
      const itemsPerPage = 25;
      const nextOffset = currentOffset + itemsPerPage;
      setIsSearching(true);

      if (spotifyApi.getAccessToken()) {
        spotifyApi
          .searchTracks(query, {
            offset: nextOffset,
            limit: itemsPerPage,
          })
          .then(
            function (data) {
              const updatedList = mergeObject(
                data.body,
                queryResults,
                'tracks'
              );
              setStopFetch(data?.body?.tracks?.next === null);
              setQueryResults(updatedList);

              // Update songList state with the new items
              // a "set" is used to remove duplicates based on the URI property
              setSongsList((prevList) => {
                const newList = [...prevList, ...updatedList?.tracks?.items];
                // the set is converted back to an array using "Array.from", and the original order of the items
                // is restored by using map to find the corresponding item in the original list.
                return Array.from(new Set(newList.map((item) => item.uri))).map(
                  (uri) => newList.find((item) => item.uri === uri)
                );
              });

              // Update songUris state with the new URIs
              setSongsUris((prevUris) => {
                const newUris = updatedList?.tracks?.items.map(
                  (item) => item.uri
                );
                return Array.from(new Set([...prevUris, ...newUris]));
              });

              setIsSearching(false);
              setCurrentOffset(nextOffset);
            },
            function (err) {
              setIsSearching(false);
              setIsError(true);
              console.log('Retrieving more items failed ...');
              toast.error('Retrieving more items failed!', {
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
        <title>Provided by Spotify - Results for Songs</title>
        <link rel="icon" href="/spotify.ico"></link>
      </Head>
      <MediaResultList
        mediaList={songsList}
        totalNumber={totalNumber}
        showButton={showButton}
        scrollToTop={scrollToTop}
        scrollableSectionRef={scrollableSectionRef}
        containerRef={containerRef}
      />
    </>
  );
}

export default Tracks;

Tracks.getLayout = function getLayout(page) {
  return (
    <Layout>
      <NestedLayout>{page}</NestedLayout>
    </Layout>
  );
};
