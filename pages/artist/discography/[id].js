import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
// custom hooks
import useSpotify from '@/hooks/useSpotify';
import useScrollToTop from '@/hooks/useScrollToTop';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
// import state management recoil
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { artistsDiscographyState } from '@/atoms/artistAtom';
import { itemsPerPageState } from '@/atoms/otherAtoms';
// import functions
// import { mergeObject } from '@/lib/merge';
// import layouts/components
import Layout from '@/components/layouts/Layout';
import NestedLayout from '@/components/layouts/NestedLayout';
import DiscographyCard from '@/components/cards/discographyCard';
import Footer from '@/components/navigation/Footer';
import BackToTopButton from '@/components/backToTopButton';

/**
 * Renders the artist discography page.
 * @function Discography
 * @returns {JSX}
 */
function Discography() {
  const spotifyApi = useSpotify();
  const router = useRouter();
  const { scrollableSectionRef, showButton, scrollToTop } = useScrollToTop(); // scroll button
  const [discography, setDiscography] = useRecoilState(artistsDiscographyState);
  const scrollRef = useRef(null);
  console.log(discography);

  const itemsPerPage = useRecoilValue(itemsPerPageState);
  // const [queryResults, setQueryResults] = useRecoilState(searchResultState);
  const [currentOffset, setCurrentOffset] = useState(0);
  // const query = useRecoilValue(queryState);
  // const setIsSearching = useSetRecoilState(searchingState);
  // const setIsError = useSetRecoilState(errorState);
  // const [stopFetch, setStopFetch] = useState(false);

  // const shows = queryResults?.shows?.items;
  // const totalNumber = queryResults?.shows?.total;

  // show message when all data loaded/end of infinite scrolling
  // useEffect(() => {
  //   if (stopFetch) {
  //     toast.info("That's everything !", {
  //       theme: 'colored',
  //     });
  //   }
  // }, [stopFetch]);

  /**
   * Fetches more Podcasts/shows & updates the list of Podcasts/shows
   * @function fetchMoreData
   * @returns {object} updated list of Podcasts/shows in queryResults
   */
  // const fetchMoreData = () => {
  //   if (!stopFetch) {
  //     const nextOffset = currentOffset + itemsPerPage;
  //     setIsSearching(true);

  //     if (spotifyApi.getAccessToken()) {
  //       spotifyApi
  //         .searchShows(query, {
  //           offset: nextOffset,
  //           limit: itemsPerPage,
  //         })
  //         .then(
  //           function (data) {
  //             const updatedList = mergeObject(data.body, queryResults, 'shows');
  //             setStopFetch(data?.body?.shows?.next === null);
  //             setQueryResults(updatedList);
  //             setIsSearching(false);
  //             setCurrentOffset(nextOffset);
  //           },
  //           function (err) {
  //             setIsSearching(false);
  //             setIsError(true);
  //             console.log('Retrieving more items failed ...');
  //             toast.error('Retrieving more items failed !', {
  //               theme: 'colored',
  //             });
  //           }
  //         );
  //     }
  //   }
  // };
  // const containerRef = useInfiniteScroll(fetchMoreData);

  return (
    <>
      <Head>
        <title>Provided by Spotify - Discography</title>
        <link rel="icon" href="/spotify.ico"></link>
      </Head>
      <div
        className="flex-grow h-screen overflow-y-scroll scrollbar-hide"
        // ref={scrollRef}
        ref={(node) => {
          scrollRef.current = node;
          scrollableSectionRef.current = node;
        }}
      >
        <div className="flex flex-col">
          {discography.map((item, i) => (
            <DiscographyCard key={`${item.id}-${i}`} item={item} />
          ))}
        </div>
        {showButton && <BackToTopButton scrollToTop={scrollToTop} />}
        <Footer />
      </div>
    </>
  );
}

export default Discography;

Discography.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
