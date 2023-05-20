import Head from 'next/head';
import { getSession } from 'next-auth/react';
// import components
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
        <title>Spotify App</title>
        <link rel="icon" href="/favicon.ico"></link>
      </Head>

      <Center />
    </>
  );
}
