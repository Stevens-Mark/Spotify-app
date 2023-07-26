import React, { useState, useEffect, useRef } from 'react';
import useSpotify from '@/hooks/useSpotify';
import Logo from '@/components/logo';
// import component
import Footer from './navigation/Footer';

/**
 * Renders welcome page
 * @function Welcome
 * @returns {JSX}
 */
function Welcome() {
  const spotifyApi = useSpotify();
  const scrollRef = useRef(null);
  const [message, setMessage] = useState(null);

  const [myAlert, setMyAlert] = useState(false);
  const handleMyAlert = () => {
    setMyAlert(true);
    setTimeout(() => {
      setMyAlert(false);
    }, 5000);
  };

  // const renderCount = useMemo(() => {
  //   let count = 0;
  //   return () => ++count;
  // }, []);

  // useEffect(() => {
  //   console.log(`Component has rendered ${renderCount()} times`);
  // }, [renderCount]);

  useEffect(() => {
    // check whether there is an active device connected to spotify account.
    // if not this app will not be fully functional.
    // Inform user to connect to spotify
    if (spotifyApi.getAccessToken()) {
      spotifyApi
        .getMyDevices()
        .then((data) => {
          // check if there is an active device
          const activeDevice = data.body.devices.find(
            (device) => device.is_active
          );

          if (activeDevice) {
            console.log(
              `Active device found: ${activeDevice.name}. PREMIUM ACCOUNT needed for most features!`
            );
            setMessage(`PREMIUM ACCOUNT needed !`);
          } else {
            console.log(
              'No active device found: Connect to Spotify & reload page'
            );
            setMessage('Connect to Spotify & reload page.');
          }
          handleMyAlert();
        })
        .catch((err) => {
          console.error(
            'Failed to find active devices. Connect to Spotify & reload page.',
            err
          );
          setMessage('Have you connected to Spotify?');
          handleMyAlert();
        });
    }
  }, [spotifyApi]);

  return (
    <>
      <div
        className="flex-grow h-screen overflow-y-scroll scrollbar-hide relative"
        ref={scrollRef}
      >
        <p
          style={myAlert ? { display: 'block' } : { display: 'none' }}
          className="text-white absolute text-center w-full"
        >
          {message}
        </p>
        <div className="h-[5rem] isMd:h-[4rem] md:h-[6rem]  lg:h-[10rem]"></div>
        <div className="flex flex-col items-center justify-center p-6 text-center text-green-500">
          <h1 className="text-3xl isSm:text-5xl mb-12">Welcome</h1>
          <Logo />
          <h2 className="text-2xl isSm:text-3xl mt-6">
            For Your Listening Pleasure ...
          </h2>
          <h2 className="text-lg isSm:text-2xl mt-6">
            Why not listen to your playlists or search for something new...
          </h2>
          <p className="text-sm mt-6">
            ( To use this app you need to have Spotify running in the back
            ground. If you don&apos;t have an account, please follow one of the
            links in the right hand bottom corner )
          </p>
          <p className="text-sm mt-6">
            ( Make sure to connect to your Spotify account & have a PREMIUM
            ACCOUNT to access all features )
          </p>
          <p className="text-m mt-6">
            ( NOTE: ALL content is being supplied and made available by Spotify
            )
          </p>
        </div>
        <div className="h-[5rem] isMd:h-[4rem] md:h-[6rem] lg:h-[10rem]"></div>
        <Footer />
      </div>
    </>
  );
}

export default Welcome;
