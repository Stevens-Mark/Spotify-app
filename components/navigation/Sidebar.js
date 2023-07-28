import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { signOut, useSession } from 'next-auth/react';
import useSpotify from '@/hooks/useSpotify';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { querySubmittedState, queryState } from '@/atoms/searchAtom';
import {
  activePlaylistIdState,
  activePlaylistState,
} from '@/atoms/playListAtom';
import { currentTrackIdState, isPlayState } from '@/atoms/songAtom';
import { currentItemIdState, playerInfoTypeState } from '@/atoms/otherAtoms';
import { SpeakerWaveIcon, Bars3Icon } from '@heroicons/react/24/solid';
import {
  HomeIcon,
  BuildingLibraryIcon,
  MagnifyingGlassIcon,
  PlusCircleIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline';
import LikedButton from './likedSongsButton';
import noCoverImage from '@/public/images/noImageAvailable.svg';

function Sidebar() {
  const router = useRouter();
  const spotifyApi = useSpotify();
  const { data: session } = useSession();

  const [myPlaylists, setMyPlaylists] = useState([]);
  const [activePlaylistId, setActivePlaylistId] = useRecoilState(
    activePlaylistIdState
  );
  const setCurrentTrackId = useSetRecoilState(currentTrackIdState);
  const [activePlaylist, setActivePlaylist] =
    useRecoilState(activePlaylistState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayState);

  const setCurrentItemId = useSetRecoilState(currentItemIdState);
  const setPlayerInfoType = useSetRecoilState(playerInfoTypeState);
  const setSubmitted = useSetRecoilState(querySubmittedState);
  const setQuery = useSetRecoilState(queryState);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setActivePlaylistId((router?.asPath).split('/').pop());
  }, [router?.asPath, setActivePlaylistId]);

  useEffect(() => {
    const fetchCurrentTrack = async () => {
      try {
        if (spotifyApi.getAccessToken()) {
          const data = await spotifyApi.getMyCurrentPlayingTrack();
          console.log('sidebar ', data)
          const currentPlaylistId = data.body?.context?.uri.split(':').pop();
          setPlayerInfoType(data.body?.currently_playing_type);
          setIsPlaying(data.body?.is_playing);
          setCurrentTrackId(data.body?.item?.id);
          // setActivePlaylistId(currentPlaylistId);
          setActivePlaylist(currentPlaylistId);
          setCurrentItemId(currentPlaylistId);
        }
      } catch (err) {
        console.error('Failed to get current playing track / playlist ID');
      }
    };

    const fetchUserPlaylists = async () => {
      if (spotifyApi.getAccessToken()) {
        try {
          const userPlaylists = await spotifyApi.getUserPlaylists();
          setMyPlaylists(userPlaylists.body.items);
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
    setPlayerInfoType,
    setCurrentItemId,
    setIsPlaying,
    setActivePlaylistId,
  ]);

  const handleHome = () => {
    router.push('/');
    setSubmitted(false);
    setQuery('');
  };

  const handleClick = (id) => {
    router.push(`/playlist/${id}`);
  };

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {/* Menu buttons - General */}
      <button
        className="fixed top-5 left-5 z-[51] bg-gray-900 p-2 rounded-md text-white md:hidden"
        onClick={handleMenuToggle}
        aria-label="Hamburger Menu toggle"
      >
        <Bars3Icon className="h-6 w-6" />
      </button>
      <div
        className={`md:pt-7 pt-20 text-pink-swan p-5 pb-36 text-sm lg:text-base border-r border-gray-900 overflow-y-scroll h-screen scrollbar-hide ${
          isMenuOpen
            ? 'fixed top-0 left-0 w-screen h-screen bg-gray-900 z-50'
            : 'hidden '
        } md:inline md:relative min-w-[13rem] isMdLg:min-w-[16rem] lg:w-[21%]`}
      >
        <nav role="navigation" aria-label="Primary">
          <ul className="space-y-4 w-full">
            <li>
              <button
                className="flex items-center space-x-2 hover:text-white focus:text-white"
                onClick={handleHome}
                aria-label="Go to Home"
              >
                <HomeIcon className="h-5 w-5 ml-3" />
                <p>Home</p>
              </button>
            </li>

            <li>
              <Link
                href="/search"
                passHref
                className="flex items-center space-x-2 hover:text-white focus:text-white"
              >
                <MagnifyingGlassIcon className="h-5 w-5 ml-3" />
                <p>Search</p>
              </Link>
            </li>

            <li>
              <Link
                href="/recently"
                passHref
                className="flex items-center space-x-2 hover:text-white focus:text-white"
              >
                <BuildingLibraryIcon className="h-5 w-5 ml-3" />
                <p>Recently Played</p>
              </Link>
            </li>

            <li>
              <button
                aria-label="Create Playlist"
                className="flex items-center space-x-2 mb-4 hover:text-white focus:text-white"
              >
                <PlusCircleIcon className="h-5 w-5 ml-3" />
                <p>Create Playlist</p>
              </button>
            </li>
          </ul>
        </nav>

        <hr className="border-t-[0.1px] border-gray-900 " />

        <button
          className="flex items-center py-4 space-x-2 hover:text-white focus:text-white"
          onClick={() => signOut()}
          aria-label="Log out"
        >
          <ArrowLeftOnRectangleIcon className="h-5 w-5 ml-3" />
          <p>Logout</p>
        </button>

        <hr className="border-t-[0.1px] border-gray-900 mb-4" />

        {/* Menu button - Liked Songs */}
        <LikedButton
          activePlaylistId={activePlaylistId}
          activePlaylist={activePlaylist}
          isPlaying={isPlaying}
        />
        <hr className="border-t-[0.1px] border-gray-900" />

        <nav role="navigation" aria-label="Your Playlist menu">
          <ul>
            {/* Menu buttons - playlists */}
            {myPlaylists?.map((playlist) => (
              <li key={playlist?.id}>
                <button
                  aria-label="Go to playlist"
                  onClick={() => handleClick(playlist?.id)}
                  className={`flex items-center p-3 rounded-lg min-w-full cursor-pointer
              ${
                activePlaylist == playlist?.id && isPlaying
                  ? 'text-green-500'
                  : 'hover:text-white focus:text-white'
              } 
              ${
                activePlaylistId == playlist?.id
                  ? ` bg-gray-900 hover:bg-gray-800 focus:bg-gray-800`
                  : 'hover:bg-gray-900 focus:bg-gray-900'
              }
            `}
                >
                  <Image
                    className="h-8 w-8 mr-1 rounded-sm"
                    src={playlist?.images?.[0]?.url || noCoverImage}
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
          </ul>
        </nav>
        <hr className="border-t-[0.1px] border-gray-900 pb-36" />
      </div>
    </>
  );
}

export default Sidebar;
