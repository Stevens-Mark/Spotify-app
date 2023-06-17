import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import useSpotify from '@/hooks/useSpotify';
// import icon/images
import Image from 'next/image';
import noAlbum from '@/public/images/noImageAvailable.svg';
// import { colors } from '@/styles/colors';
// import component
import UserTracks from './trackListUser/userTracks';
// import state management recoil
import { useRecoilState, useRecoilValue } from 'recoil';
import { myPlaylistIdState, myPlaylistState } from '@/atoms/playListAtom';
// import functions
import { shuffle } from 'lodash'; // function used to select random color
import { msToTime } from '@/lib/time';
import { totalDuration } from '@/lib/totalTrackDuration';
import { capitalize } from '@/lib/capitalize';

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
  const myPlaylistId = useRecoilValue(myPlaylistIdState);
  const [myPlaylist, setMyPlaylist] = useRecoilState(myPlaylistState);
  const [message, setMessage] = useState(null);
  const [randomColor, setRandomColor] = useState(null);

  const [myAlert, setMyAlert] = useState(false);
  const handleMyAlert = () => {
    setMyAlert(true);
    setTimeout(() => {
      setMyAlert(false);
    }, 5000);
  };

  useEffect(() => {
    // setRandomColor(colors[Math.floor(Math.random() * 7)]);
    setRandomColor(shuffle(colors).pop());
  }, [myPlaylistId]);

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
            setMessage(`PREMIUM ACCOUNT needed for most features!`);
          } else {
            console.log(
              'No active device found: Connect to Spotify & reload the page'
            );
            setMessage('Connect to Spotify & reload the page.');
          }
          handleMyAlert();
        })
        .catch((err) => {
          console.error(
            'Failed to find active devices. Connect to Spotify & reload the page.',
            err
          );
          setMessage('Connect to Spotify & reload the page.');
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

  // useEffect(() => {
  //   if (spotifyApi.getAccessToken()) {
  //     spotifyApi
  //       .getUserPlaylists()
  //       .then((data) => {
  //         spotifyApi.getPlaylist(data.body.items[0].id).then((data) => {
  //           setMyPlaylist(data.body);
  //         });
  //       })
  //       .catch((err) => {
  //         console.error(
  //           'Failed to get current playing track / playlist ID',
  //           err
  //         );
  //       });
  //   }
  // }, [spotifyApi, session, setMyPlaylist]);

  return (
    <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide">
      <p
        style={myAlert ? { display: 'block' } : { display: 'none' }}
        className="text-white absolute top-0 left-1/2 transform -translate-x-1/2 w-96"
      >
        {message}
      </p>
      <div
        className={`flex flex-col justify-end xs:flex-row xs:justify-start xs:items-end space-x-0 xs:space-x-7 bg-gradient-to-b to-black ${randomColor} h-80 text-white py-4 px-5 xs:p-8`}
      >
        <Image
          className="h-16 w-16 xs:h-44 xs:w-44 shadow-2xl ml-0 xs:ml-7"
          src={myPlaylist?.images?.[0]?.url || noAlbum}
          alt=""
          width={100}
          height={100}
          priority
        />
        <div>
          {myPlaylist && (
            <>
              <p className="pt-2">Playlist</p>
              <h1 className="text-2xl md:text-3xl xl:text-5xl font-bold pt-1 pb-[7px] line-clamp-1">
                {myPlaylist?.name}
              </h1>
              <p className="text-sm mt-5 mb-2 line-clamp-2">{myPlaylist?.description}</p>
              <span>{capitalize(myPlaylist?.owner?.display_name)}&nbsp;•&nbsp;</span>
              <span className="text-sm">
                {myPlaylist?.tracks.items.length}{' '}
                {myPlaylist?.tracks.items.length > 1 ? 'songs' : 'song'},{' '}
              </span>
              <span className="text-sm truncate text-pink-swan">
                {msToTime(totalDuration(myPlaylist))}
              </span>
            </>
          )}
        </div>
      </div>

      <section className="pb-20">
        <h2 className="sr-only">Track List</h2>
        <UserTracks />
      </section>
    </div>
  );
}

export default Center;
