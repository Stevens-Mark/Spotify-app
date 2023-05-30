import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';
import useSpotify from '@/hooks/useSpotify';
// import state management recoil
import { useRecoilState, useSetRecoilState, useRecoilValue } from 'recoil';
import { playlistIdState, activePlaylistState } from '@/atoms/playListAtom';
import { currentTrackIdState, isPlayState } from '@/atoms/songAtom';
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
  const router = useRouter();
  const spotifyApi = useSpotify();
  const { data: session } = useSession();
  const [playlists, setPlaylists] = useState([]);
  const [playlistId, setPlaylistId] = useRecoilState(playlistIdState);
  const setCurrentTrackId = useSetRecoilState(currentTrackIdState);
  const [activePlaylist, setActivePlaylist] =
    useRecoilState(activePlaylistState);
  const isPlaying = useRecoilValue(isPlayState);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi
        .getUserPlaylists()
        .then((data) => {
          setPlaylists(data.body.items);
          setPlaylistId(data.body.items[0].id); // base - set page to first playlist in list
        })
        .then(() => {
          spotifyApi.getMyCurrentPlayingTrack().then((data) => {
            // check if the user is currently playing a track from their playlist & set page to this playlist
            if (
              data.body &&
              data.body.is_playing &&
              data.body.context !== null
            ) {
              setCurrentTrackId(data.body.item.id);
              const currentplaylistId = data.body.context.uri.split(':');
              const playingId = currentplaylistId[currentplaylistId.length - 1];
              setPlaylistId(playingId);
              setActivePlaylist(playingId);
            }
          });
        })
        .catch((error) => {
          console.error(
            'Failed to get current playing track / playlist ID',
            error
          );
        });
    }
  }, [
    setPlaylistId,
    session,
    spotifyApi,
    setCurrentTrackId,
    setActivePlaylist,
  ]);

  const handleClick = (id) => {
    setPlaylistId(id);
    router.push('/');
  };

  return (
    <div className="text-pink-swan p-5 pb-36 text-sm lg:text-base border-r border-gray-900 overflow-y-scroll h-screen scrollbar-hide hidden md:inline-flex min-w-[16rem]">
      <div className="space-y-4 w-full">
        <button
          className="flex items-center space-x-2 hover:text-white"
          onClick={() => signOut()}
        >
          <ArrowLeftOnRectangleIcon className="h-5 w-5 ml-3" />
          <p>Logout</p>
        </button>

        <Link href="/" className="flex items-center space-x-2 hover:text-white">
          <HomeIcon className="h-5 w-5 ml-3" />
          <p>Home</p>
        </Link>

        <Link
          href="/search"
          className="flex items-center space-x-2 hover:text-white"
        >
          <MagnifyingGlassIcon className="h-5 w-5 ml-3" />
          <p>Search</p>
        </Link>

        <button className="flex items-center space-x-2 hover:text-white">
          <BuildingLibraryIcon className="h-5 w-5 ml-3" />
          <p>Your Library</p>
        </button>
        <hr className="border-t-[0.1px] border-gray-900" />

        <button className="flex items-center space-x-2 hover:text-white">
          <PlusCircleIcon className="h-5 w-5 ml-3" />
          <p>Create Playlist</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <HeartIcon className="h-5 w-5 ml-3" />
          <p>Liked Songs</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <RssIcon className="h-5 w-5 ml-3" />
          <p>Your Episodes</p>
        </button>
        <hr className="border-t-[0.1px] border-gray-900" />

        {/* Playlists.. */}
        {playlists.map((playlist) => (
          <button
            key={playlist.id}
            onClick={() => handleClick(playlist.id)}
            className={`flex items-center p-3 rounded-lg min-w-full cursor-pointer 
              ${
                activePlaylist == playlist.id && isPlaying
                  ? 'text-green-500'
                  : 'hover:text-white'
              } 
              ${
                playlistId == playlist.id
                  ? ` bg-gray-900 hover:bg-gray-800`
                  : 'hover:bg-gray-900'
              }
            `}
          >
            <Image
              className="h-8 w-8 mr-1 rounded-sm"
              src={playlist.images[0].url}
              alt="track"
              width={100}
              height={100}
            />
            <p>{playlist.name}</p>
            <span className="pl-2">
              {activePlaylist == playlist.id && isPlaying ? (
                <SpeakerWaveIcon className="w-4 h-4 text-green-500" />
              ) : (
                ' '
              )}
            </span>
          </button>
        ))}
        <hr className="border-t-[0.1px] border-gray-900 pb-36" />
      </div>
    </div>
  );
}

export default Sidebar;
