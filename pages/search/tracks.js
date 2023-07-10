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
  const setsongsList = useSetRecoilState(songsListState); // songs list (from search)

  const [currentOffset, setCurrentOffset] = useState(0);
  const query = useRecoilValue(queryState);
  const setIsSearching = useSetRecoilState(searchingState);
  const setIsError = useSetRecoilState(errorState);

  const tracks = queryResults?.tracks?.items;
  const totalNumber = queryResults?.tracks?.total;

  useEffect(() => {
    if (!query) {
      router.push('/search');
    }
  }, [query, router]);

  /**
   * Fetches more tracks & updates the list of tracks
   * @function fetchMoreData
   * @returns {object} updated list of tracks in queryResults
   */
  const fetchMoreData = () => {
    const itemsPerPage = 30;
    const nextOffset = currentOffset + itemsPerPage;
    setCurrentOffset(nextOffset);
    setIsSearching(true);
    if (spotifyApi.getAccessToken()) {
      spotifyApi
        .searchTracks(query, {
          offset: nextOffset,
          limit: itemsPerPage,
        })
        .then(
          function (data) {
            const updatedList = mergeObject(data.body, queryResults, 'tracks');
            setQueryResults(updatedList);
            setsongsList(updatedList?.tracks?.items);
            // Merge the new URIs into the existing songsUris state
            const newUris = data.body?.tracks?.items.map((item) => item.uri);

            setSongsUris((prevUris) => [...prevUris, ...newUris]);
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
    <MediaResultList
      mediaList={tracks}
      totalNumber={totalNumber}
      showButton={showButton}
      scrollToTop={scrollToTop}
      scrollableSectionRef={scrollableSectionRef}
      containerRef={containerRef}
    />
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
