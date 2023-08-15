import Head from 'next/head';
import { getSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
// import state management recoil
import { useRecoilValue, useRecoilState } from 'recoil';
import { isLikedSongState } from '@/atoms/otherAtoms';
// import components
import Layout from '@/components/layouts/Layout';
import Welcome from '@/components/Welcome';
// export async function getServerSideProps(context) {
//   const session = await getSession(context);
//   return {
//     props: {
//       session,
//     },
//   };
// }

// export async function getServerSideProps(context) {
//   const session = await getSession(context);

//   const fetchLikedSongs = async () => {
//     try {
//       const res = await fetch(
//         `https://api.spotify.com/v1/me/tracks?offset=0&limit=50`,
//         {
//           headers: {
//             Authorization: `Bearer ${session.user.accessToken}`,
//           },
//         }
//       );
//       const data = await res.json();

//       return data;
//     } catch (err) {
//       console.error('Error retrieving Liked Songs:', err);
//       return null;
//     }
//   };

//   const likedSongs = await fetchLikedSongs();

//   return {
//     props: {
//       likedSongs,
//     },
//   };
// }

/**
 * Renders home page
 * @function Home
 * @returns {JSX}
 */
export default function Home() {
  // const LikedSongs = likedSongs?.items?.map((item) => item?.track?.id);
  // const [isLikedSong, setIsLikedSong] = useRecoilState(isLikedSongState);

  // useEffect(() => {
  //   setIsLikedSong(likedSongs?.items?.map((item) => item?.track?.id));
  // }, [likedSongs?.items, setIsLikedSong]);

  // console.log('likedSongs', LikedSongs);
  // console.log('isLikedSong', isLikedSong);
  return (
    <>
      <Head>
        <title>Provided by Spotify - Web Player</title>
        <link rel="icon" href="/spotify.ico"></link>
      </Head>
      <Welcome />
    </>
  );
}

Home.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
