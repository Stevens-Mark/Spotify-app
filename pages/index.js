import Head from 'next/head';
import { getSession } from 'next-auth/react';
// import components
import Layout from '@/components/Layout';
import Center from '@/components/Center';

export async function getServerSideProps(context) {
  const session = await getSession(context);
  return {
    props: {
      session,
    },
  };
}

export default function Home() {
  return (
    <>
      <Head>
        <title>Spotify</title>
        <link rel="icon" href="/favicon.ico"></link>
      </Head>

      <Center />
    </>
  );
}

Home.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
