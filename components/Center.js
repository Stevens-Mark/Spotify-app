import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import useSpotify from '@/hooks/useSpotify';
// import { colors } from '@/styles/colors';
// import state management recoil
import { useRecoilState, useRecoilValue } from 'recoil';
import { myPlaylistIdState, myPlaylistState } from '@/atoms/playListAtom';
// import component
import MediaHeading from './headerLabels/MediaHero';
import PlaylistTracks from '@/components/trackListPlaylist/playlistTracks';
import QuickPlay from './QuickPlay';
import QuickPlayBanner from './QuickPlayBanner';

// random color options for top background
const colors = [
  'from-indigo-500',
  'from-blue-500',
  'from-green-500',
  'from-red-500',
  'from-yellow-500',
  'from-pink-500',
  'from-purple-500',
];

/**
 * Renders the chosen user's playlist heading with the associated tracks
 * @function Center
 * @returns {JSX}
 */
function Center() {
  const { data: session } = useSession();
  const spotifyApi = useSpotify();
  const scrollRef = useRef(null);
  const myPlaylistId = useRecoilValue(myPlaylistIdState);
  const [myPlaylist, setMyPlaylist] = useRecoilState(myPlaylistState);
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
          setMessage('Connect to Spotify & reload page.');
          handleMyAlert();
        });
    }
  }, [spotifyApi]);

  /* fetch playlist which is currently playing */
  useEffect(() => {
    if (myPlaylistId !== null) {
      if (spotifyApi.getAccessToken()) {
        spotifyApi
          .getPlaylist(myPlaylistId)
          .then((data) => {
            setMyPlaylist(data.body);
          })
          .catch((err) =>
            console.log('Something went wrong - Get Playlist Failed! ', err)
          );
      }
    }
  }, [spotifyApi, session, myPlaylistId, setMyPlaylist]);

  return (
    <div
      className="flex-grow h-screen overflow-y-scroll scrollbar-hide relative"
      ref={scrollRef}
    >
      <p
        style={myAlert ? { display: 'block' } : { display: 'none' }}
        className="text-white absolute top-0 left-1/2 transform -translate-x-1/2 w-64"
      >
        {message}
      </p>
      {/* Hero bar with image, playlist title etc */}

      <MediaHeading item={myPlaylist} />
      <QuickPlayBanner item={myPlaylist} scrollRef={scrollRef} />

      {/* <QuickPlay item={myPlaylist} /> */}

      <section className="pb-20">
        <PlaylistTracks Tracklist={myPlaylist} whichList="myPlaylist" />
      </section>
    </div>
  );
}

export default Center;
