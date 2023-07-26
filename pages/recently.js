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
import { recentlyListState, recentlyUrisState } from '@/atoms/songAtom';
// import layouts/components
import Layout from '@/components/layouts/Layout';
import MediaResultList from '@/components/lists/mediaResultList';

// export async function getServerSideProps(context) {
//   const session = await getSession(context);

//   const fetchRecent = async () => {
//     try {
//       const res = await fetch(
//         `https://api.spotify.com/v1/me/player/recently-played?limit=${50}`,
//         {
//           headers: {
//             Authorization: `Bearer ${session.user.accessToken}`,
//           },
//         }
//       );
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

// AFTER TESTING I HAVE FOUND LOADING THE RECENT PLAYED TRACKS IN THE FRONT END
// FASTER THAN ON THE SERVER FIRST (FROM A USER'S VIEW I.E, TIME TO SEE PAGE)

/**
 * Renders the list of the most recently played tracks (maximum 50)
 * @function RecentlyPlayedPage
 * @param {Object} recent played tracks - NOT IN USE
 * @returns {JSX}
 */
function RecentlyPlayedPage() {
  const spotifyApi = useSpotify();
  const { data: session } = useSession();
  const { scrollableSectionRef, showButton, scrollToTop } = useScrollToTop(); // scroll button
  const [recentlyUris, setRecentlyUris] = useRecoilState(recentlyUrisState); // recently played uris (for player)
  const [recentlyList, setRecentlyList] = useRecoilState(recentlyListState);
  const [stopFetch, setStopFetch] = useState(false);
  const totalNumber = recentlyUris?.length;

  useEffect(() => {
    // Get Current User's Recently Played Tracks
    if (recentlyList === null) {
      if (spotifyApi.getAccessToken()) {
        spotifyApi
          .getMyRecentlyPlayedTracks({
            limit: 50,
          })
          .then(
            function (data) {
              const uniqueItems = Array.from(
                new Set(data.body?.items?.map((track) => track.track.uri))
              ).map((uri) =>
                data.body?.items?.find((track) => track.track.uri === uri)
              );
              setRecentlyList(uniqueItems);
              setRecentlyUris(uniqueItems?.map((track) => track.track.uri));
            },
            function (err) {
              console.log('Recent tracks retrieval failed!');
              toast.error('Recent tracks retrieval failed!', {
                theme: 'colored',
              });
            }
          );
      }
    }
  }, [setRecentlyList, setRecentlyUris, spotifyApi, session, recentlyList]);

  // show message to tell user this is the maximum number of tracks if they try infinite scrolling
  useEffect(() => {
    if (stopFetch) {
      toast.info('These are all the most recent!', {
        theme: 'colored',
      });
    }
  }, [stopFetch]);

  const sendMessage = () => {
    setStopFetch(true);
  };

  const containerRef = useInfiniteScroll(sendMessage);

  return (
    <>
      <Head>
        <title>Provided by Spotify - Recently Played Songs</title>
        <link rel="icon" href="/spotify.ico"></link>
      </Head>

      <MediaResultList
        heading={'Recently Played'}
        mediaList={recentlyList}
        totalNumber={totalNumber}
        showButton={showButton}
        scrollToTop={scrollToTop}
        scrollableSectionRef={scrollableSectionRef}
        containerRef={containerRef}
      />
    </>
  );
}

export default RecentlyPlayedPage;

RecentlyPlayedPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
