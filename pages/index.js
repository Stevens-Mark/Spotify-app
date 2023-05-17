import Head from 'next/head';
import { getSession } from 'next-auth/react';
// import components
import Sidebar from '@/components/Sidebar';
import Center from '@/components/Center';
import Player from '@/components/Player';

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

      <div className="bg-black h-screen overflow-hidden">
        <main className="flex">
          <Sidebar />
          <Center />
        </main>

        <div className="sticky bottom-0">
          <Player />
        </div>
      </div>
    </>
  );
}
