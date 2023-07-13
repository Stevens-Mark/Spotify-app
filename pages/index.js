import Head from 'next/head';
// import { getSession } from 'next-auth/react';
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

/**
 * Renders home page
 * @function Home
 * @returns {JSX}
 */
export default function Home() {
  return (
    <>
      <Head>
        <title>Spotify - Web Player</title>
        <link rel="icon" href="/spotify.ico"></link>
      </Head>
      <Welcome />
    </>
  );
}

Home.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
