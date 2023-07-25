import Head from 'next/head';
import React, { useState, useEffect } from 'react';
import { getSession } from 'next-auth/react';
import { toast } from 'react-toastify';
// custom hooks
import useScrollToTop from '@/hooks/useScrollToTop';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
// import state management recoil
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { recentlyListState, recentlyUrisState } from '@/atoms/songAtom';
// import layouts/components
import Layout from '@/components/layouts/Layout';
import MediaResultList from '@/components/lists/mediaResultList';

export async function getServerSideProps(context) {
  const session = await getSession(context);

  const fetchRecent = async () => {
    try {
      const res = await fetch(
        `https://api.spotify.com/v1/me/player/recently-played?limit=${50}`,
        {
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
          },
        }
      );
      const data = await res.json();
      return data;
    } catch (err) {
      console.error('Error retrieving recent tracks:', err);
      return null;
    }
  };

  const recent = await fetchRecent();

  return {
    props: {
      recent,
    },
  };
}

/**
 * Renders the list of the most recently played tracks (maximum 50)
 * @function RecentlyPlayedPage
 * @returns {JSX}
 */
function RecentlyPlayedPage({ recent }) {
  const { scrollableSectionRef, showButton, scrollToTop } = useScrollToTop(); // scroll button
  const [recentlyUris, setRecentlyUris] = useRecoilState(recentlyUrisState); // recently played uris (for player)
  const [recentlyList, setRecentlyList] = useRecoilState(recentlyListState);
  const [stopFetch, setStopFetch] = useState(false);
  const totalNumber = recentlyUris?.length;

  useEffect(() => {
    const uniqueItems = Array.from(
      new Set(recent?.items?.map((track) => track.track.uri))
    ).map((uri) => recent?.items?.find((track) => track.track.uri === uri));
    setRecentlyList(uniqueItems);
    setRecentlyUris(uniqueItems?.map((track) => track.track.uri));
  }, [recent?.items, setRecentlyList, setRecentlyUris]);

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
