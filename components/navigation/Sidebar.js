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
import {
  activePlaylistIdState,
  activePlaylistState,
  myPlaylistState,
  onlyUsersPlaylistState,
  spotifyPlaylistState,
} from '@/atoms/playListAtom';
import { mySavedAlbumsState } from '@/atoms/albumAtom';
import { currentTrackIdState, isPlayState } from '@/atoms/songAtom';
import {
  currentItemIdState,
  playerInfoTypeState,
  listToShowState,
  playlistInUseState,
} from '@/atoms/otherAtoms';
// import functions
import { capitalize } from '@/lib/capitalize';
// import icon/images
import { SpeakerWaveIcon, Bars3Icon } from '@heroicons/react/24/solid';
import {
  HomeIcon,
  BuildingLibraryIcon,
  MagnifyingGlassIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline';
import noCoverImage from '@/public/images/noImageAvailable.svg';
// import component
import LikedButton from './likedSongsButton';
import SidebarListButtons from './sidebarListButtons';

function Sidebar() {
  const router = useRouter();
  const spotifyApi = useSpotify();
  const { data: session } = useSession();
  const listToShow = useRecoilValue(listToShowState); // determine either playlist or album to show in the sidebar
  const playlistInUse = useRecoilValue(playlistInUseState); // determine which playlist to show in the sidebar (owner or spotify)
  const [myPlaylists, setMyPlaylists] = useRecoilState(activePlaylistIdState);
  const [mySavedAlbums, setMySavedAlbums] = useRecoilState(mySavedAlbumsState);
  const [userCreatedPlaylists, setUserCreatedPlaylists] = useRecoilState(
    onlyUsersPlaylistState
  );
  const [spotifyPlaylists, setSpotifyPlaylists] =
    useRecoilState(spotifyPlaylistState);
  const [activePlaylistId, setActivePlaylistId] =
    useRecoilState(myPlaylistState);
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
    // Function to handle window resize event
    const handleResize = () => {
      // Close the menu automatically for mobile landscape sizes galaxy s20 ultra & below (e.g., width less than 916px)
      if (window.innerWidth < 916 && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    setActivePlaylistId((router?.asPath).split('/').pop());
  }, [router?.asPath, setActivePlaylistId]);

  useEffect(() => {
    const fetchCurrentTrack = async () => {
      try {
        if (spotifyApi.getAccessToken()) {
          const data = await spotifyApi.getMyCurrentPlayingTrack();
          const currentPlaylistId = data.body?.context?.uri.split(':').pop();
          setPlayerInfoType(data.body?.currently_playing_type);
          setIsPlaying(data.body?.is_playing);
          setCurrentTrackId(data.body?.item?.id);
          // setActivePlaylistId(currentPlaylistId);
          // setActivePlaylist(currentPlaylistId);
          if (currentPlaylistId !== undefined) {
            setCurrentItemId(currentPlaylistId);
            setActivePlaylist(currentPlaylistId);
          }
        }
      } catch (err) {
        console.error('Failed to get current playing track / playlist ID');
      }
    };
    fetchCurrentTrack();
  }, [
    session,
    setActivePlaylist,
    setCurrentItemId,
    setCurrentTrackId,
    setIsPlaying,
    setPlayerInfoType,
    spotifyApi,
  ]);

  // fetch playlists
  useEffect(() => {
    const fetchUserPlaylists = async () => {
      if (myPlaylists === null) {
        if (spotifyApi.getAccessToken()) {
          try {
            const userPlaylists = await spotifyApi.getUserPlaylists({
              limit: 50,
              offset: 0,
            });
            setMyPlaylists(
              userPlaylists?.body?.items.sort((a, b) =>
                a.name < b.name ? -1 : 1
              )
            );

            const users = userPlaylists?.body?.items.filter(
              (playlist) => playlist.owner.display_name === session?.user?.name
            );

            const spotify = userPlaylists?.body?.items.filter(
              (playlist) => playlist.owner.id === 'spotify'
            );
            setSpotifyPlaylists(spotify);
            setUserCreatedPlaylists(users);
          } catch (err) {
            console.error('Failed to get user playlists');
            toast.error('Playlists Retrieval failed !', {
              theme: 'colored',
            });
          }
        }
      }
    };
    fetchUserPlaylists();
  }, [
    spotifyApi,
    session,
    myPlaylists,
    setMyPlaylists,
    setUserCreatedPlaylists,
    setSpotifyPlaylists,
  ]);

  // fetch user saved albums
  useEffect(() => {
    const fetchUserSavedlbums = async () => {
      if (mySavedAlbums === null) {
        if (spotifyApi.getAccessToken()) {
          try {
            const userSavedlbums = await spotifyApi.getMySavedAlbums({
              limit: 50,
              offset: 0,
            });
            setMySavedAlbums(
              userSavedlbums?.body?.items.sort((a, b) =>
                a.album.name < b.album.name ? -1 : 1
              )
            );
          } catch (err) {
            console.error('Failed to get user saved albums');
            toast.error('Albums Retrieval failed !', {
              theme: 'colored',
            });
          }
        }
      }
    };
    fetchUserSavedlbums();
  }, [spotifyApi, session, mySavedAlbums, setMySavedAlbums]);

  const handleHome = () => {
    router.push('/');
    setSubmitted(false);
    setQuery('');
  };

  const handlePlaylistClick = (id) => {
    router.push(`/playlist/${id}`);
  };
  const handleAlbumClick = (id) => {
    router.push(`/album/${id}`);
  };

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const playlistToUse =
    playlistInUse == 'user'
      ? userCreatedPlaylists
      : playlistInUse === 'spotify'
      ? spotifyPlaylists
      : myPlaylists;

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
        className={`md:pt-7 pt-20 text-pink-swan p-2 mb-96 text-sm lg:text-base border-r border-gray-900 normalbar overflow-y-scroll scrollbar-hide ${
          isMenuOpen
            ? 'fixed top-0 left-0 w-screen h-screen bg-gray-900 z-50'
            : 'hidden'
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
          </ul>
        </nav>

        <button
          className="flex items-center py-4 space-x-2 hover:text-white focus:text-white"
          onClick={() => signOut()}
          aria-label="Log out"
        >
          <ArrowLeftOnRectangleIcon className="h-5 w-5 ml-3" />
          <p>Logout</p>
        </button>

        <hr className="border-t-[0.1px] border-gray-900" />
        {/* playlist, album to chose which lis(s) in sidebar  */}
        {(mySavedAlbums?.length !== 0 ||
          userCreatedPlaylists?.length !== 0 ||
          spotifyPlaylists?.length !== 0) && <SidebarListButtons />}
        <div className="mobilebar galaxyS20:overflow-y-scroll h-screen scrollbar-hide ">
          {playlistInUse === 'all' && listToShow !== 'albums' && (
            <>
              {/* Menu button - Liked Songs */}
              <LikedButton
                activePlaylistId={activePlaylistId}
                activePlaylist={activePlaylist}
                isPlaying={isPlaying}
              />
              <hr className="border-t-[0.1px] border-gray-900" />{' '}
            </>
          )}

          {listToShow !== 'albums' && (
            <>
              <nav role="navigation" aria-label="Your Playlist menu">
                <ul>
                  {/* Menu buttons - playlists */}
                  {playlistToUse?.map((playlist) => (
                    <li key={playlist?.id}>
                      <button
                        aria-label="Go to playlist"
                        onClick={() => handlePlaylistClick(playlist?.id)}
                        className={`group flex items-center p-3 rounded-lg min-w-full ${
                          activePlaylistId == playlist?.id
                            ? `bg-gray-900 hover:bg-gray-800 focus:bg-gray-800`
                            : 'hover:bg-gray-900 focus:bg-gray-900'
                        }`}
                      >
                        <Image
                          className="h-10 w-10 mr-2 rounded-sm"
                          src={playlist?.images?.[0]?.url || noCoverImage}
                          alt=""
                          width={100}
                          height={100}
                          style={{ objectFit: 'cover' }}
                        />
                        <div className="flex flex-col text-left w-full">
                          <span
                            className={`line-clamp-1 ${
                              activePlaylist == playlist?.id && isPlaying
                                ? 'text-green-500'
                                : 'group-hover:text-white group-focus:text-white'
                            } `}
                          >
                            {playlist?.name}
                          </span>

                          <span className="flex text-[13px]">
                            <span>{capitalize(playlist?.type)}</span>
                            &nbsp;•&nbsp;
                            <span className="line-clamp-1">
                              {capitalize(playlist?.owner?.display_name)}
                            </span>
                          </span>
                        </div>

                        <span className="pl-2 justify-end">
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
              <hr className="border-t-[0.1px] border-gray-900" />
            </>
          )}
          {(listToShow === 'albums' || listToShow === 'all') && (
            <>
              <nav role="navigation" aria-label="Your user saved album menu">
                <ul>
                  {/* Menu buttons - user saved albums */}
                  {mySavedAlbums?.map((item) => (
                    <li key={item?.album?.id}>
                      <button
                        aria-label="Go to album"
                        onClick={() => handleAlbumClick(item?.album?.id)}
                        className={`group flex items-center p-3 rounded-lg min-w-full ${
                          activePlaylistId == item?.album?.id
                            ? `bg-gray-900 hover:bg-gray-800 focus:bg-gray-800`
                            : 'hover:bg-gray-900 focus:bg-gray-900'
                        }`}
                      >
                        <Image
                          className="h-10 w-10 mr-2 rounded-sm"
                          src={item?.album?.images?.[0]?.url || noCoverImage}
                          alt=""
                          width={100}
                          height={100}
                          style={{ objectFit: 'cover' }}
                        />
                        <div className="flex flex-col text-left w-full">
                          <span
                            className={`line-clamp-1 ${
                              activePlaylist == item?.album?.id && isPlaying
                                ? 'text-green-500'
                                : 'group-hover:text-white group-focus:text-white'
                            } `}
                          >
                            {item?.album?.name}
                          </span>
                          <span className="flex text-[13px]">
                            <span>{capitalize(item?.album?.type)}</span>
                            &nbsp;•&nbsp;
                            <span className="line-clamp-1">
                              {capitalize(item?.album?.artists?.[0]?.name)}
                            </span>
                          </span>
                        </div>

                        <span className="pl-2 justify-end">
                          {activePlaylist == item?.album?.id && isPlaying ? (
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
              <hr className="border-t-[0.1px] border-gray-900" />
            </>
          )}
          <hr className="border-t-[0.1px] border-gray-900 md:pb-[22rem]" />
        </div>
      </div>
    </>
  );
}

export default Sidebar;
