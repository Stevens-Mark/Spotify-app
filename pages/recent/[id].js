import Head from 'next/head';
import React, { useState, useEffect } from 'react';
import { getSession } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
// custom hooks
import useSpotify from '@/hooks/useSpotify';
import useScrollToTop from '@/hooks/useScrollToTop';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
// import state management recoil
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { songsUrisState, songsListState } from '@/atoms/songAtom';
import { errorState } from '@/atoms/errorAtom';
// import functions
import { mergeObject } from '@/lib/merge';
// import layouts/components
import Layout from '@/components/layouts/Layout';
import MediaResultList from '@/components/lists/mediaResultList';

// export async function getServerSideProps(context) {
 
//   const session = await getSession(context);

//   const fetchRecent = async (id) => {
//     try {
//       const res = await fetch(`https://api.spotify.com/v1/me/player/recently-played`, {
//         headers: {
//           Authorization: `Bearer ${session.user.accessToken}`,
//         },
//       });
//       const data = await res.json();
//       return data;
//     } catch (err) {
//       console.error('Error retrieving recent tracks:', err);
//       return null;
//     }
//   };

//   const recent = await fetchRecent();

//   return {
//     props: {
//       recent,
//     },
//   };
// }

/**
 * Renders the list of Albums from search.
 * @function RecentlyPlayedPage
 * @returns {JSX}
 */
function RecentlyPlayedPage() {
  const { scrollableSectionRef, showButton, scrollToTop } = useScrollToTop(); // scroll button


  // const setSongsUris = useSetRecoilState(songsUrisState); // song uris (from search)
  // const setsongsList = useSetRecoilState(songsListState); // songs list (from search)

  const [currentOffset, setCurrentOffset] = useState(0);

  const setIsError = useSetRecoilState(errorState);
  const [stopFetch, setStopFetch] = useState(false);

  const tracks = recent?.tracks?.items;
  const totalNumber = recent?.tracks?.total;



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
   * @returns {object} updated list of tracks in queryResults
   */
  // const fetchMoreData = async () => {
  //   if (!stopFetch) {
  //     const itemsPerPage = 30;
  //     const nextOffset = currentOffset + itemsPerPage;
  //     try {
  //       const res = await fetch(
  //         `https://api.spotify.com/v1/me/player/recently-played?offset=${nextOffset}&limit=${itemsPerPage}`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${session.user.accessToken}`,
  //           },
  //         }
  //       );
  //       const data = await res.json();
  //       setStopFetch(data?.playlists?.next === null);
  //       // Update genreList state
  //       // setGenreList([...genreList, ...data.playlists.items]);
  //       // setCurrentOffset(nextOffset);
  //     } catch (err) {
  //       console.error('Retrieving more items failed ...');
  //       toast.error('Retrieving more items failed !', {
  //         theme: 'colored',
  //       });
  //       return null;
  //     }
  //   }
  // };
  // const containerRef = useInfiniteScroll(fetchMoreData);

  return (
    <>
      <Head>
        <title>Spotify - Recently Played Songs</title>
        <link rel="icon" href="/spotify.ico"></link>
      </Head>

      <h1 className='text-white text-7xl'>TEST</h1>
      {/* <MediaResultList
        mediaList={tracks}
        totalNumber={totalNumber}
        showButton={showButton}
        scrollToTop={scrollToTop}
        scrollableSectionRef={scrollableSectionRef}
        containerRef={containerRef}
      /> */}
    </>
  );
}

export default RecentlyPlayedPage;

RecentlyPlayedPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
