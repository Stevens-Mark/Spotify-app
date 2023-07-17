import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { signOut, useSession } from 'next-auth/react';
import useSpotify from '@/hooks/useSpotify';
// import state management recoil
import { useRecoilState, useSetRecoilState, useRecoilValue } from 'recoil';
import { querySubmittedState, queryState } from '@/atoms/searchAtom';
import { myPlaylistIdState, activePlaylistState } from '@/atoms/playListAtom';
import { currentTrackIdState, isPlayState } from '@/atoms/songAtom';
// import { albumIdState } from '@/atoms/albumAtom';
import { currentItemIdState, playerInfoTypeState } from '@/atoms/otherAtoms';
// please vist https://heroicons.com/ for icon details
import { SpeakerWaveIcon } from '@heroicons/react/24/solid';
import {
  HomeIcon,
  BuildingLibraryIcon,
  MagnifyingGlassIcon,
  HeartIcon,
  PlusCircleIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline';

/**
 * Renders Sidebar for navigation
 * @function Sidebar
 * @returns {JSX}
 */
function Sidebar() {
  const router = useRouter();
  const spotifyApi = useSpotify();
  const { data: session } = useSession();

  const [myPlaylists, setMyPlaylists] = useState([]);
  const [myPlaylistId, setMyPlaylistId] = useRecoilState(myPlaylistIdState);
  const setCurrentTrackId = useSetRecoilState(currentTrackIdState);
  const [activePlaylist, setActivePlaylist] =
    useRecoilState(activePlaylistState);
  // const isPlaying = useRecoilValue(isPlayState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayState);

  const setCurrentItemId = useSetRecoilState(currentItemIdState);
  // const setCurrentAlbumId = useSetRecoilState(albumIdState);

  // used to determine what type of info to load
  const setPlayerInfoType = useSetRecoilState(playerInfoTypeState);
  // needed to reset search when user changes pages
  const setSubmitted = useSetRecoilState(querySubmittedState);
  const setQuery = useSetRecoilState(queryState);

  useEffect(() => {
    /**
     * set player info & active playlist (if applicable)
     * @function fetchCurrentTrack
     */
    const fetchCurrentTrack = async () => {
      try {
        if (spotifyApi.getAccessToken()) {
          const data = await spotifyApi.getMyCurrentPlayingTrack();
          const currentPlaylistId = data.body?.context?.uri.split(':').pop(); // get playlist id (if applicable)
          setPlayerInfoType(data.body?.currently_playing_type);
          setIsPlaying(data.body?.is_playing);
          setCurrentTrackId(data.body?.item?.id); // set track for player info
          setMyPlaylistId(currentPlaylistId); // set current playlist in use
          setActivePlaylist(currentPlaylistId);
          setCurrentItemId(currentPlaylistId);
        }
      } catch (err) {
        console.error('Failed to get current playing track / playlist ID');
      }
    };

    /**
     * ensures the user playlist loads whatever the playback state
     * @function fetchUserPlaylists
     */
    const fetchUserPlaylists = async () => {
      if (spotifyApi.getAccessToken()) {
        try {
          const userPlaylists = await spotifyApi.getUserPlaylists();
          setMyPlaylists(userPlaylists.body.items); // load user playlists
        } catch (err) {
          console.error('Failed to get user playlists');
          toast.error('Playlists Retrieval failed !', {
            theme: 'colored',
          });
        }
      }
    };
    fetchUserPlaylists();
    fetchCurrentTrack();
  }, [
    spotifyApi,
    session,
    setCurrentTrackId,
    setActivePlaylist,
    setMyPlaylistId,
    setPlayerInfoType,
    setCurrentItemId,
    setIsPlaying,
  ]);

  /**
   * navigates back to homepage & reset
   * @function handleHome
   */
  const handleHome = () => {
    setSubmitted(false);
    setQuery('');
    // setCurrentItemId(null); // reset these 2 states from search page that may have been set previously ???
    // setCurrentAlbumId(null); // otherwise playpause icon not deactivated for that search ??
    router.push('/');
  };

  /**
   * navigates to chosen playlist
   * @function handleClick
   * @param {string} id of playlist
   */
  const handleClick = (id) => {
    router.push(`/playlist/${id}`);
  };

  return (
    <nav
      role="navigation"
      aria-label="Playlist menu"
      className="text-pink-swan p-5 pb-36 text-sm lg:text-base border-r border-gray-900 overflow-y-scroll h-screen scrollbar-hide hidden md:inline min-w-[13rem] isMdLg:min-w-[16rem] lg:w-[21%]"
    >
      <ul className="space-y-4 w-full">
        <li>
          <button
            className="flex items-center space-x-2 hover:text-white"
            onClick={() => handleHome()}
          >
            <HomeIcon className="h-5 w-5 ml-3" />
            <p>Home</p>
          </button>
        </li>

        <li>
          <Link
            href="/search"
            passHref
            className="flex items-center space-x-2 hover:text-white"
          >
            <MagnifyingGlassIcon className="h-5 w-5 ml-3" />
            <p>Search</p>
          </Link>
        </li>

        <li>
          <button className="flex items-center space-x-2 hover:text-white">
            <BuildingLibraryIcon className="h-5 w-5 ml-3" />
            <p>Your Library</p>
          </button>
        </li>
        <hr className="border-t-[0.1px] border-gray-900" />

        <li>
          <button className="flex items-center space-x-2 hover:text-white">
            <PlusCircleIcon className="h-5 w-5 ml-3" />
            <p>Create Playlist</p>
          </button>
        </li>
        <li>
          {' '}
          <button className="flex items-center space-x-2 hover:text-white">
            <HeartIcon className="h-5 w-5 ml-3" />
            <p>Liked Songs</p>
          </button>
        </li>
        <li>
          <button
            className="flex items-center space-x-2 hover:text-white"
            onClick={() => signOut()}
          >
            <ArrowLeftOnRectangleIcon className="h-5 w-5 ml-3" />
            <p>Logout</p>
          </button>
        </li>
        <hr className="border-t-[0.1px] border-gray-900" />

        {/* Playlists.. */}
        {myPlaylists?.map((playlist) => (
          <li key={playlist?.id}>
            <button
              onClick={() => handleClick(playlist?.id)}
              className={`flex items-center p-3 rounded-lg min-w-full cursor-pointer
              ${
                activePlaylist == playlist?.id && isPlaying
                  ? 'text-green-500'
                  : 'hover:text-white'
              } 
              ${
                myPlaylistId == playlist?.id
                  ? ` bg-gray-900 hover:bg-gray-800`
                  : 'hover:bg-gray-900'
              }
            `}
            >
              <Image
                className="h-8 w-8 mr-1 rounded-sm"
                src={playlist?.images?.[0].url}
                alt=""
                width={100}
                height={100}
                style={{ objectFit: 'cover' }}
              />
              <p className="line-clamp-1">{playlist?.name}</p>
              <span className="pl-2">
                {activePlaylist == playlist?.id && isPlaying ? (
                  <SpeakerWaveIcon className="w-4 h-4 text-green-500" />
                ) : (
                  ' '
                )}
              </span>
            </button>
          </li>
        ))}
        <hr className="border-t-[0.1px] border-gray-900 pb-36" />
      </ul>
    </nav>
  );
}

export default Sidebar;
