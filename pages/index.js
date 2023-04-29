import Head from 'next/head';
import { useEffect } from 'react';
import { getSession } from 'next-auth/react';
// import custom hooks
import useSpotify from '@/hooks/useSpotify';
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
  // check whether there is an active device connected to spotify account.
  // if not this app will not be fully functional.
  // At present only logging message to console.....
  const spotifyApi = useSpotify();

  // useEffect(() => {
  //   spotifyApi
  //     .getMyDevices()
  //     .then((data) => {
  //       // check if there is an active device
  //       const activeDevice = data.body.devices.find(
  //         (device) => device.is_active
  //       );

  //       if (activeDevice) {
  //         (`Active device found: ${activeDevice.name}`);
  //       } else {
  //         console.log('No active device found');
  //       }
  //     })
  //     .catch((error) => {
  //       console.error('Failed to get devices', error);
  //     });
  // }, [spotifyApi]);

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
