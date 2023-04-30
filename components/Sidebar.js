import React, { useState, useEffect } from 'react';
import { signOut, useSession } from 'next-auth/react';
import useSpotify from '@/hooks/useSpotify';
// import state management recoil
import { useRecoilState } from 'recoil';
import { playlistIdState } from '@/atoms/playlistAtom';

// please vist https://heroicons.com/ for icon details
import { SpeakerWaveIcon } from '@heroicons/react/24/solid';
import {
  HomeIcon,
  BuildingLibraryIcon,
  MagnifyingGlassIcon,
  HeartIcon,
  PlusCircleIcon,
  RssIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline';

function Sidebar() {
  const spotifyApi = useSpotify();
  const { data: session } = useSession();
  const [playlists, setPlaylists] = useState([]);

  const [playlistId, setPlaylistId] = useRecoilState(playlistIdState);

  const [currentPlaylistId, setCurrentPlaylistId] = useState(null);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi.getUserPlaylists().then((data) => {
        setPlaylists(data.body.items);
        setPlaylistId(data.body.items[0].id);
      });
    }

    // retrieve the current playing track
    spotifyApi
      .getMyCurrentPlayingTrack()
      .then((data) => {
        // check if the user is currently playing a track
        if (data.body && data.body.is_playing) {
          const playlist = data.body?.context.uri.split(':');
          const id = playlist[playlist.length - 1];
          setCurrentPlaylistId(id);
        } else {
          console.log('User is not currently playing a track');
        }
      })
      .catch((error) => {
        console.error('Failed to get current playing track', error);
      });
    // .then(
    //   setTimeout(() => {
    //     spotifyApi
    //       .getPlaylist(currentPlaylistId)
    //       .then((data) => {
    //         console.log(data.body.name);
    //       })
    //       // )
    //       .catch((error) => {
    //         console.error('Failed to get current playing track', error);
    //       });
    //   }, '1000')
    // );
  }, [currentPlaylistId, session, setPlaylistId, spotifyApi]);

  // console.log(playlists);
  // console.log("you clicked >>>>> ", playlistId);

  return (
    <div className="text-gray-500 p-5 text-xs lg:text-sm border-r border-gray-900 overflow-y-scroll h-screen scrollbar-hide  sm:max-w-[12rem] lg:max-w-[15rem] hidden md:inline-flex pb-36">
      <div className="space-y-4">
        <button
          className="flex items-center space-x-2 hover:text-white"
          onClick={() => signOut()}
        >
          <ArrowLeftOnRectangleIcon className="h-5 w-5" />
          <p>Logout</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <HomeIcon className="h-5 w-5" />
          <p>Home</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <MagnifyingGlassIcon className="h-5 w-5" />
          <p>Search</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <BuildingLibraryIcon className="h-5 w-5" />
          <p>Your Library</p>
        </button>
        <hr className="border-t-[0.1px] border-gray-900" />

        <button className="flex items-center space-x-2 hover:text-white">
          <PlusCircleIcon className="h-5 w-5" />
          <p>Create Playlist</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <HeartIcon className="h-5 w-5" />
          <p>Liked Songs</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <RssIcon className="h-5 w-5" />
          <p>Your Episodes</p>
        </button>
        <hr className="border-t-[0.1px] border-gray-900" />

        {/* Playlists.. */}
        {playlists.map((playlist) => (
          <p
            key={playlist.id}
            onClick={() => setPlaylistId(playlist.id)}
            className="cursor-pointer hover:text-white flex items-center"
          >
            {playlist.name}
            <span className="pl-2">
              {playlist.id == playlistId ? (
                <SpeakerWaveIcon className="w-4 h-4 text-green-500" />
              ) : (
                ' '
              )}
            </span>
          </p>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
