import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/router';
import useSpotify from '@/hooks/useSpotify';
import { toast } from 'react-toastify';
// import state management recoil
import { useRecoilState, useRecoilValue } from 'recoil';
import { originIdState, cooldownState } from '@/atoms/otherAtoms';
import {
  onlyUsersPlaylistState,
  playlistTrackListState,
} from '@/atoms/playListAtom';
// import icon
import {
  EllipsisHorizontalIcon,
  ChevronLeftIcon,
} from '@heroicons/react/24/solid';
// import components
import ConfirmationModal from './confirmationModal';

/**
 * Handles the adding/removing tracks from playlists & other navigation
 * @function TrackOptionsMenu
 * @param {object} song song data
 * @param {string} order index of song in list
 * @param {string} linkAddress to album
 * @returns {JSX} options menu for track
 */
function TrackOptionsMenu({ song, order, linkAddress }) {
  const router = useRouter();
  const showAlbumLink = !(router?.asPath).includes('album');

  const address = linkAddress ? linkAddress : `/album/${song?.album?.id}`;

  const playlistMenuRef = useRef(null);
  const lastFocusedElementRef = useRef(null); // Ref to store the last focused element
  const activeOrderRef = useRef(null); // Ref to store the order of the active component
  const spotifyApi = useSpotify();
  const [showModal, setShowModal] = useState(false);

  const [showMainOptionsMenu, setShowMainOptionsMenu] = useState(false);
  const [showPlaylistSubMenu, setShowPlaylistSubMenu] = useState(false);
  const [showArtistsSubMenu, setShowArtistsSubMenu] = useState(false);
  const [chosenPlaylist, setChosenPlaylist] = useState('');

  const originId = useRecoilValue(originIdState);
  const userCreatedPlaylists = useRecoilValue(onlyUsersPlaylistState); // list: users created playlists ONLY
  const [cooldown, setCooldown] = useRecoilState(cooldownState); // to limit how often the user can press remove from playlist so the server has time to process each request
  const [playlistTracklist, setPlaylistTracklist] = useRecoilState(
    playlistTrackListState
  );

  // check if current playlist displayed is one of the user's created playlists
  const isOriginIdInPlaylists = userCreatedPlaylists?.some(
    (playlist) => playlist.id === originId
  );

  // to try to avoid the user being able to add duplicate track to the same playlist
  const possiblePlaylists = userCreatedPlaylists?.filter(
    (playlist) => playlist.id !== originId
  );

  // filter out artist to be displayed in dropdown menu from list when on their artist page
  const artistsToDisplay = song?.artists?.filter(
    (artist) => artist?.id !== originId
  );

  // Add an event listener to close the playlist menu when clicking/press keyboard button outside add playlist menu
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        showMainOptionsMenu &&
        playlistMenuRef.current &&
        !playlistMenuRef.current.contains(event.target)
      ) {
        setShowMainOptionsMenu(false);
      }
    };

    const handleKeyPress = (event) => {
      if (
        showMainOptionsMenu &&
        event.key !== 'Tab' &&
        event.key !== 'Enter' &&
        !event.key.startsWith('Arrow') &&
        event.key !== 'Shift'
      ) {
        setShowMainOptionsMenu(false);
      }
    };

    window.addEventListener('click', handleOutsideClick);
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('click', handleOutsideClick);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [showMainOptionsMenu]);

  const storeLastFocusedElement = () => {
    lastFocusedElementRef.current = document.activeElement;
    activeOrderRef.current = order;
  };

  // Restore the last focused element
  const restoreLastFocusedElement = () => {
    if (
      lastFocusedElementRef.current &&
      lastFocusedElementRef.current.focus &&
      activeOrderRef.current === order
    ) {
      lastFocusedElementRef.current.focus();
    }
  };

  // add track to choosen playlist as not duplicate or confirmed to add by user
  const addTrack = async (playlistId) => {
    // add to Spotify playlist
    if (spotifyApi.getAccessToken()) {
      try {
        setCooldown(true);
        await spotifyApi.addTracksToPlaylist(playlistId, [song?.uri]);

        // add to locally stored copy to trigger list rerender (if on playlist page where track added)
        // CURRENTLY NOT NEEDED AS I HAVE FILTERED OUT (SEE 'possiblePlaylists')
        // if (playlistId === originId) {
        //   const addedTrack = {
        //     added_at: new Date().toISOString(), // Current timestamp
        //     // Fill this with appropriate data missing from song
        //     added_by: playlistTracklist?.tracks?.items?.[0].added_by,
        //     is_local: false,
        //     primary_color: null,
        //     track: song, // song data
        //   };

        //   setPlaylistTracklist((prevState) => ({
        //     ...prevState,
        //     tracks: {
        //       ...prevState.tracks,
        //       items: [...prevState?.tracks?.items, addedTrack],
        //     },
        //   }));
        // }
        setShowMainOptionsMenu(false);
        setTimeout(function () {
          document.getElementById(`elipsis-${order}`)?.focus?.();
        }, 0);
        // Start the cooldown
        setTimeout(() => {
          setCooldown(false);
        }, 2000); // Set the cooldown time (in milliseconds)
      } catch (err) {
        console.log('Adding track failed!', err);
        toast.error('Adding track failed!', {
          theme: 'colored',
        });
      }
    }
  };

  // confirm to add duplicate to playlist
  const confirmAdd = () => {
    addTrack(chosenPlaylist?.id);
    setShowModal(false);
    setTimeout(function () {
      document.getElementById(`elipsis-${order}`)?.focus?.();
    }, 0);
  };

  // cancel adding duplicate to playlist
  const cancelAdd = () => {
    setShowModal(false);
    setShowMainOptionsMenu(false);
    setTimeout(function () {
      document.getElementById(`elipsis-${order}`)?.focus?.();
    }, 0);
  };

  // check for duplicates before adding choosen track to choosen playlist
  const checkDuplicatesBeforeAddTrack = (playlist, songId) => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi.getPlaylist(playlist.id).then(
        function (data) {
          const isSongInPlaylist = data.body?.tracks?.items?.some(
            (item) => item.track.id === songId
          );
          if (isSongInPlaylist) {
            setChosenPlaylist(playlist);
            setShowModal(true); // duplicates - open modal for confirmation
          } else {
            addTrack(playlist.id); // no duplicates so add track directly
          }
        },
        function (err) {
          console.log('Adding track failed!', err);
          toast.error('Adding track failed!', {
            theme: 'colored',
          });
        }
      );
    }
  };

  // remove choosen track from playlist
  const removeFromPlaylist = async (playlistId, index) => {
    if (spotifyApi.getAccessToken() && !cooldown) {
      try {
        setCooldown(true);
        // remove from Spotify playlist - use index to remove correct one if duplicates
        await spotifyApi.removeTracksFromPlaylistByPosition(
          playlistId,
          [index],
          playlistTracklist.snapshot_id
        );

        // Remove from locally stored copy to trigger list rerender
        const updatedTracks = playlistTracklist?.tracks?.items?.filter(
          (item, idx) => idx !== index
        );

        setPlaylistTracklist({
          ...playlistTracklist,
          tracks: {
            ...playlistTracklist?.tracks,
            items: updatedTracks,
          },
        });

        setTimeout(function () {
          document.getElementById(`elipsis-${order}`)?.focus?.();
        }, 0);

        // Start the cooldown
        setTimeout(() => {
          setCooldown(false);
        }, 2000); // Set the cooldown time (in milliseconds)
      } catch (err) {
        console.log('Removing track failed!', err);
        toast.error('Removing track failed!', {
          theme: 'colored',
        });
      }
    }
  };

  return (
    <div className="relative inline-block" ref={playlistMenuRef}>
      <button
        aria-label="options"
        id={`elipsis-${order}`}
        className="mt-2 ml-3 w-7 h-7 text-pink-swan md:text-black group-hover:text-pink-swan focus:text-pink-swan transition delay-100 duration-300 ease-in-out"
        onClick={() => {
          storeLastFocusedElement();
          setShowMainOptionsMenu(!showMainOptionsMenu);
        }}
      >
        <EllipsisHorizontalIcon />
      </button>

      {/* MAIN OPTIONS MENU LIST  */}
      {showMainOptionsMenu && (
        <div className="absolute z-10 top-14 right-0 w-56 rounded-md p-2 bg-gray-900 text-left border-[1px] border-gray-800 shadow-elipsisMenu">
          {/* PRINCIPAL MENU - ADD TRACK */}
          <button
            aria-label="Add track to playlist"
            className={`w-full p-1 rounded-md text-white flex items-center hover:bg-gray-800 focus:bg-gray-800 ${
              showPlaylistSubMenu ? 'bg-gray-800' : 'bg-gray-900'
            } `}
            onClick={() => {
              setShowPlaylistSubMenu((prevState) => !prevState);
              setShowArtistsSubMenu(false);
            }}
          >
            <ChevronLeftIcon className="h-4 w-4 text-white" />
            <span className="pl-1 text-sm xs:text-base">Add to Playlist</span>
          </button>

          {/* PRINCIPAL MENU - REMOVE TRACK */}
          {/* If a user's created playlist - add option to delete a track */}
          {isOriginIdInPlaylists && (
            <button
              aria-label="remove track from playlist"
              className={`w-full text-left p-1 rounded-md text-white hover:bg-gray-800 focus:bg-gray-800 ${
                cooldown ? 'cursor-not-allowed' : ''
              } `}
              onClick={() => {
                removeFromPlaylist(originId, order);
              }}
              disabled={cooldown}
            >
              <span className="pl-5 text-sm xs:text-base">
                Remove from this Playlist
              </span>
            </button>
          )}

          {/* PRINCIPAL MENU - GO TO ALBUM */}
          {/* show go to album link if not on album page  */}
          {showAlbumLink && (
            <Link
              href={address}
              aria-label="Go to album"
              className={`relative w-full inline-block text-left p-1  rounded-md text-white hover:bg-gray-800 focus:bg-gray-800`}
            >
              <span className="pl-5 text-sm xs:text-base ">Go to album</span>
            </Link>
          )}

          {/* PRINCIPAL MENU - GO TO ARTIST */}
          <div className="relative">
            {song?.artists?.length < 2 && artistsToDisplay?.length !== 0 ? (
              <Link
                href={`/artist/${song?.artists?.[0].id}`}
                aria-label="Go to artist"
                className={`w-full inline-block text-left p-1 rounded-md text-white hover:bg-gray-800 focus:bg-gray-800 mt-[3px]`}
              >
                <span className="pl-5 text-sm xs:text-base ">Go to artist</span>
              </Link>
            ) : (
              <>
                {artistsToDisplay?.length !== 0 && (
                  <button
                    aria-label="open artist list"
                    className={`w-full p-1 rounded-md text-white flex items-center hover:bg-gray-800 focus:bg-gray-800 mt-[3px] ${
                      showArtistsSubMenu ? 'bg-gray-800' : 'bg-gray-900'
                    } `}
                    onClick={() => {
                      setShowArtistsSubMenu((prevState) => !prevState);
                      setShowPlaylistSubMenu(false);
                    }}
                  >
                    <ChevronLeftIcon className="h-4 w-4 text-white" />
                    <span className="pl-1 text-sm xs:text-base">
                      Go to artists
                    </span>
                  </button>
                )}
              </>
            )}

            {/* SUB-MENU - GO TO ARTIST */}
            {showArtistsSubMenu && (
              <div
                className={`absolute top-9 xs:top-2 right-10 xs:right-[13.5rem] 
                `}
              >
                <div className="p-2 bg-gray-900 text-white rounded-md w-48 border-[1px] border-gray-800 shadow-elipsisMenu">
                  <div>
                    {artistsToDisplay?.map((artist, index) => (
                      <Link
                        href={`/artist/${artist?.id}`}
                        key={artist?.id}
                        className={`w-full inline-block p-1 rounded-md text-white hover:bg-gray-800 focus:bg-gray-800`}
                      >
                        <span className="text-sm xs:text-base ">
                          {artist?.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SUB-MENU - PLAYLIST OPTIONS TO ADD TRACK TO */}
          {showPlaylistSubMenu && (
            <div
              className={`absolute ${
                isOriginIdInPlaylists &&
                showAlbumLink &&
                artistsToDisplay?.length !== 0
                  ? 'top-[8.9rem]'
                  : !isOriginIdInPlaylists &&
                    showAlbumLink &&
                    artistsToDisplay?.length !== 0
                  ? 'top-[6.8rem]'
                  : 'top-[4.8rem]'
              }  xs:top-2 right-12 xs:right-56 `}
            >
              {/* user's created playlist menu items*/}
              <div className="flex flex-col max-h-48 h-fit shadow-elipsisMenu rounded-md py-3 bg-gray-900 border-[1px] border-gray-800">
                <div className="p-2 bg-gray-900 text-white w-48 overflow-y-scroll custom-scrollbar">
                  {possiblePlaylists?.length > 0 ? (
                    possiblePlaylists.map((playlist) => (
                      <button
                        key={playlist?.id}
                        className={`rounded-md text-left w-full hover:bg-gray-800 focus:bg-gray-800 truncate px-2 py-2 xs:py-1 text-sm xs:text-base ${
                          cooldown ? 'cursor-not-allowed' : ''
                        } `}
                        onClick={() => {
                          checkDuplicatesBeforeAddTrack(playlist, song?.id);
                        }}
                        disabled={cooldown}
                      >
                        {playlist?.name}
                      </button>
                    ))
                  ) : (
                    <p className="text-white rounded-md text-left px-2 py-1 bg-gray-800 truncate">
                      No playlists available
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      {showModal &&
        createPortal(
          <ConfirmationModal
            onConfirm={() => {
              confirmAdd();
              restoreLastFocusedElement();
            }}
            onCancel={() => {
              cancelAdd();
              restoreLastFocusedElement();
            }}
            chosenPlaylist={chosenPlaylist}
          />,
          document.body
        )}
    </div>
  );
}

export default TrackOptionsMenu;
