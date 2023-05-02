import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import useSpotify from '@/hooks/useSpotify';
// import icon/images
import Image from 'next/image';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import noUserImage from '@/public/images/user_noImage.svg';
import noAlbum from '@/public/images/noImageAvailable.svg';
import likedImage from '@/public/images/likedSongs.png';
// import component
import Songs from './Songs';
// import state management recoil
import { useRecoilState, useRecoilValue } from 'recoil';
import { playlistIdState, playlistState } from '@/atoms/playlistAtom';
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
  const [randomColor, setRandomColor] = useState(null);
  const playlistId = useRecoilValue(playlistIdState);
  const [playlist, setPlaylist] = useRecoilState(playlistState);

  const total = playlist?.tracks.items.reduce((prev, current) => {
    return prev + current.track.duration_ms;
  }, 0);

  useEffect(() => {
    // setRandomColor(colors[Math.floor(Math.random() * 7)]);
    setRandomColor(shuffle(colors).pop());
  }, [playlistId]);

  useEffect(() => {
    if (playlistId !== null) {
      if (playlistId == 99999) {
        // Get the user's liked songs
        spotifyApi
          .getMySavedTracks({ limit: 50 })
          .then((data) => {
            setPlaylist({
              name: 'Liked Songs',
              images: [{ height: 60, url: likedImage, width: 60 }],
              tracks: data.body,
            });
            console.log('liked ', data);
          })
          .catch(console.error);
      } else {
        if (spotifyApi.getAccessToken()) {
          spotifyApi
            .getPlaylist(playlistId)
            .then((data) => {
              setPlaylist(data.body);
              console.log('normal: ', data.body);
            })
            .catch((err) => console.log('Something went wrong! ', err));
        }
      }
    }
  }, [spotifyApi, playlistId, setPlaylist]);

  return (
    <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide">
      <header className="absolute top-5 right-8">
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
      </header>

      <session
        className={`flex items-end space-x-7 bg-gradient-to-b to-black ${randomColor} h-80 text-white p-8`}
      >
        <Image
          className="h-44 w-44 shadow-2xl"
          src={playlist?.images?.[0]?.url || noAlbum}
          alt="album cover"
          width={100}
          height={100}
          priority
        />
        <div>
          {playlist && (
            <>
              <p>Playlist</p>
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
              <span className="text-gray-400 text-sm">{msToTime(total)}</span>
            </>
          )}
        </div>
      </session>

      <div className="pb-20">
        <Songs />
      </div>
    </div>
  );
}

export default Center;
