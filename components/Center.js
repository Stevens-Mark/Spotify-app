import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import useSpotify from '@/hooks/useSpotify';
// import icon/images
import Image from 'next/image';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import noUserImage from '@/public/images/user_noImage.svg';
import noAlbum from '@/public/images/noImageAvailable.svg';
// import component
import Songs from './Songs';
// import state management recoil
import { useRecoilState, useRecoilValue } from 'recoil';
import { playlistIdState, playlistState } from '@/atoms/playListAtom';
// import { isPlayState } from '@/atoms/songAtom';
// import functions
import { shuffle } from 'lodash'; // function used to select random color
import { msToTime } from '@/lib/time';

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

function Center() {
  const { data: session } = useSession();
  const spotifyApi = useSpotify();
  const playlistId = useRecoilValue(playlistIdState);
  const [playlist, setPlaylist] = useRecoilState(playlistState);
  const [message, setMessage] = useState(null);
  const [randomColor, setRandomColor] = useState(null);

  const [myAlert, setMyAlert] = useState(false);
  const handleMyAlert = () => {
    setMyAlert(true);
    setTimeout(() => {
      setMyAlert(false);
    }, 5000);
  };

  const totalDuration = playlist?.tracks.items.reduce((prev, current) => {
    return prev + current.track.duration_ms;
  }, 0);

  useEffect(() => {
    // setRandomColor(colors[Math.floor(Math.random() * 7)]);
    setRandomColor(shuffle(colors).pop());
  }, [playlistId]);

  useEffect(() => {
    // check whether there is an active device connected to spotify account.
    // if not this app will not be fully functional.
    // Inform user to connect to spotify
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
          setMessage(
            `Active device found: ${activeDevice.name}. PREMIUM ACCOUNT needed for most features!`
          );
        } else {
          console.log('No active device found');
          setMessage(
            'No active device found! Please connect to Spotify & reload the page.'
          );
        }
        handleMyAlert();
      })
      .catch((error) => {
        console.error('Failed to get devices', error);
        setMessage(
          'Failed to get devices! Please connect to Spotify & reload the page.'
        );
        handleMyAlert();
      });
  }, [spotifyApi]);

  useEffect(() => {
    if (playlistId !== null) {
      if (spotifyApi.getAccessToken()) {
        spotifyApi
          .getPlaylist(playlistId)
          .then((data) => {
            setPlaylist(data.body);
          })
          .catch((err) =>
            console.log('Something went wrong - Get Playlist Failed! ', err)
          );
      }
    }
  }, [spotifyApi, session, playlistId, setPlaylist]);

  return (
    <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide">
      {/* <header className="absolute top-5 right-8">
        <div
          className="flex items-center bg-black space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2 text-white"
          onClick={signOut}
        >
          <Image
            className="rounded-full w-10 h-10"
            src={session?.user.image || noUserImage}
            alt="user"
            width={100}
            height={100}
            priority
          />
          <h2>{session?.user.name}</h2>
          <ChevronDownIcon className="h-5 w-5" />
        </div>
      </header> */}

      <div
        className={`flex flex-col justify-end sm:flex-row sm:justify-start sm:items-end space-x-7 bg-gradient-to-b to-black ${randomColor} h-80 text-white p-8`}
      >
        <h2
          style={myAlert ? { display: 'block' } : { display: 'none' }}
          className="text-white absolute top-0 left-1/2 transform -translate-x-1/2"
        >
          {message}
        </h2>
        <Image
          className="h-16 w-16 sm:h-44 sm:w-44 shadow-2xl ml-7"
          src={playlist?.images?.[0]?.url || noAlbum}
          alt="album cover"
          width={100}
          height={100}
          priority
        />
        <div>
          {playlist && (
            <>
              <p className="pt-2">Playlist</p>
              <h1 className="text-2xl md:text-3xl xl:text-5xl font-bold pb-5 pt-1">
                {playlist?.name}
              </h1>
              <h2 className="text-gray-400 text-sm pb-2">
                {playlist?.description}
              </h2>
              <span className="text-sm">
                {playlist?.tracks.items.length}{' '}
                {playlist?.tracks.items.length > 1 ? 'songs' : 'song'},{' '}
              </span>
              <span className="text-gray-400 text-sm">{msToTime(totalDuration)}</span>
            </>
          )}
        </div>
      </div>

      <div className="pb-20">
        <Songs />
      </div>
    </div>
  );
}

export default Center;
