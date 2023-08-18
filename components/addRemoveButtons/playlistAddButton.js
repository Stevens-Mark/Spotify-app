import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
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
import ConfirmationModal from './confirmationModal';

/**
 * Handles the adding/removing tracks from playlists
 * @function PlaylistAddRemoveButton
 * @param {object} song song data
 * @param {string} order index of song in list
 * @returns {JSX} add/remove menu
 */
function PlaylistAddRemoveButton({ song, order }) {
  const playlistMenuRef = useRef(null);
  const spotifyApi = useSpotify();
  const [showModal, setShowModal] = useState(false);
  const originId = useRecoilValue(originIdState);
  const [isPlaylistMenuVisible, setPlaylistMenuVisible] = useState(false);
  const [isPlaylistSubMenuVisible, setPlaylistSubMenuVisible] = useState(false);
  const [chosenPlaylist, setChosenPlaylist] = useState('');
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

  // Add an event listener to close the playlist menu when clicking/press keyboard button outside add playlist menu
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        isPlaylistMenuVisible &&
        playlistMenuRef.current &&
        !playlistMenuRef.current.contains(event.target)
      ) {
        setPlaylistMenuVisible(false);
      }
    };

    const handleKeyPress = (event) => {
      if (
        isPlaylistMenuVisible &&
        event.key !== 'Tab' &&
        event.key !== 'Enter' &&
        !event.key.startsWith('Arrow') &&
        event.key !== 'Shift'
      ) {
        setPlaylistMenuVisible(false);
      }
    };

    window.addEventListener('click', handleOutsideClick);
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('click', handleOutsideClick);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [isPlaylistMenuVisible]);

  // add track to choosen playlist as not duplicate or confirmed to by user
  const addTrack = async (playlistId) => {
    // add to Spotify playlist
    if (spotifyApi.getAccessToken()) {
      try {
        await spotifyApi.addTracksToPlaylist(playlistId, [song?.uri]);

        if (playlistId === originId) {
          // add to locally stored copy to trigger list rerender (if on playlist page where track added)
          // CURRENTLY NOT NEEDED AS I HAVE FILTERED OUT (SEE 'possiblePlaylists')
          const addedTrack = {
            added_at: new Date().toISOString(), // Current timestamp
            // Fill this with appropriate data missing from song
            added_by: playlistTracklist?.tracks?.items?.[0].added_by,
            is_local: false,
            primary_color: null,
            track: song, // song data
          };

          setPlaylistTracklist((prevState) => ({
            ...prevState,
            tracks: {
              ...prevState.tracks,
              items: [...prevState?.tracks?.items, addedTrack],
            },
          }));
        }
        setPlaylistMenuVisible(false);
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
  };

  // cancel adding duplicate to playlist
  const cancelAdd = () => {
    setShowModal(false);
    setPlaylistMenuVisible(false);
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

        // Start the cooldown
        setTimeout(() => {
          setCooldown(false);
        }, 2500); // Set the cooldown time (in milliseconds)
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
        className="mt-2 ml-3 w-7 h-7 text-pink-swan md:text-black group-hover:text-pink-swan focus:text-pink-swan transition delay-100 duration-300 ease-in-out"
        onClick={() => setPlaylistMenuVisible(!isPlaylistMenuVisible)}
      >
        <EllipsisHorizontalIcon aria-label="Add or remove tracks to or from playlist" />
      </button>
      {isPlaylistMenuVisible && (
        <div className="absolute z-10 top-14 right-0 w-56 rounded-md p-2 bg-gray-900 text-left">
          <button
            className={`w-full p-1 rounded-md text-white flex items-center hover:bg-gray-800 focus:bg-gray-800 ${
              isPlaylistSubMenuVisible ? 'bg-gray-800' : 'bg-gray-900'
            } `}
            onClick={() => {
              setPlaylistSubMenuVisible((prevState) => !prevState);
            }}
          >
            <ChevronLeftIcon className="h-4 w-4 text-white" />
            <span className="pl-1 text-sm xs:text-base">Add to Playlist</span>
          </button>
          {/* If a user's playlist add option to delete a track */}
          {isOriginIdInPlaylists && (
            <button
              className="p-1 rounded-md text-white hover:bg-gray-800 focus:bg-gray-800"
              onClick={() => {
                removeFromPlaylist(originId, order);
              }}
              disabled={cooldown}
            >
              <span className="pl-5  text-sm xs:text-base">
                Remove from this Playlist
              </span>
            </button>
          )}

          {isPlaylistSubMenuVisible && (
            <div
              className={`absolute ${
                isOriginIdInPlaylists ? 'top-20' : 'top-11'
              }  xs:top-2 right-8 xs:right-56 `}
            >
              <div className="p-4 xs:p-2 bg-gray-900 text-white rounded-md w-48">
                {/* user's created playlist menu items */}
                <div className="flex flex-col ">
                  {possiblePlaylists?.length > 0 ? (
                    possiblePlaylists.map((playlist) => (
                      <button
                        key={playlist?.id}
                        className="rounded-md text-left cursor-pointer hover:bg-gray-800 focus:bg-gray-800 truncate px-2 py-2 xs:py-1 text-sm xs:text-base"
                        onClick={() => {
                          checkDuplicatesBeforeAddTrack(playlist, song?.id);
                        }}
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
            onConfirm={confirmAdd}
            onCancel={cancelAdd}
            chosenPlaylist={chosenPlaylist}
          />,
          document.body
        )}
    </div>
  );
}

export default PlaylistAddRemoveButton;
