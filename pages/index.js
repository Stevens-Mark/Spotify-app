import Head from 'next/head';
import { getSession } from 'next-auth/react';
// import components
import Layout from '@/components/layouts/Layout';
import Center from '@/components/Center';

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
        <title>Spotify</title>
        <link rel="icon" href="/spotify.ico"></link>
      </Head>

      <Center />
    </>
  );
}

Home.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
