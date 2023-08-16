import React, { useState } from 'react';
import useSpotify from '@/hooks/useSpotify';
import { toast } from 'react-toastify';
// import state management recoil
import { useRecoilValue } from 'recoil';
import { originIdState } from '@/atoms/otherAtoms';
import { onlyUsersPlaylistState } from '@/atoms/playListAtom';
// import icon
import { ChevronLeftIcon } from '@heroicons/react/24/solid';

function PlaylistAddButton({ songUri, openMenu }) {
  const spotifyApi = useSpotify();
  const originId = useRecoilValue(originIdState);
  const [isPlaylistSubMenuVisible, setPlaylistSubMenuVisible] = useState(false);
  const userCreatedPlaylists = useRecoilValue(onlyUsersPlaylistState); // list users created playlists ONLY

  // check if current playlist displayed is one of the user's created playlists
  const isOriginIdInPlaylists = userCreatedPlaylists.some(
    (playlist) => playlist.id === originId
  );

  // to avoid the user being able to add duplicate track to the same playlist
  const possiblePlaylists = userCreatedPlaylists.filter(
    (playlist) => playlist.id !== originId
  );

  // add choosen track to choosen playlist
  const addToPlaylist = (playlistId) => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi.addTracksToPlaylist(playlistId, [songUri]).catch((err) => {
        // console.log('Adding track failed!', err);
        toast.error('Adding track failed!', {
          theme: 'colored',
        });
      });
      openMenu(false);
    }
  };

  // remove choosen track from playlist
  const removeFromPlaylist = (playlistId) => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi
        .removeTracksFromPlaylist(playlistId, [{ uri: songUri }])
        .catch((err) => {
          // console.log('Removing track failed!', err);
          toast.error('Removing track failed!', {
            theme: 'colored',
          });
        });
      openMenu(false);
    }
  };

  return (
    <div className="absolute z-10 top-8 right-0 w-56 rounded-md p-2 bg-gray-800 text-left">
      <button
        className={`w-full p-1 rounded-md text-white flex items-center hover:bg-gray-700 ${
          isPlaylistSubMenuVisible ? 'bg-gray-700' : 'bg-gray-800'
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
          className="p-1 rounded-md text-white hover:bg-gray-700"
          onClick={() => {
            removeFromPlaylist(originId);
          }}
        >
          <span className="pl-5  text-sm xs:text-base">
            Remove from this Playlist
          </span>
        </button>
      )}

      {isPlaylistSubMenuVisible && (
        <div
          className={`absolute ${
            isOriginIdInPlaylists ? 'top-20' : 'top-12'
          }  xs:top-2 right-8 xs:right-56 `}
        >
          <div className="p-4 xs:p-2 bg-gray-800 text-white rounded-md w-48">
            {/* user's created playlist menu items */}
            <div className="flex flex-col ">
              {possiblePlaylists?.map((playlist) => (
                <button
                  key={playlist?.id}
                  className="rounded-md text-left cursor-pointer hover:bg-gray-700 truncate px-2 py-2 xs:py-1 text-sm xs:text-base"
                  onClick={() => {
                    addToPlaylist(playlist?.id);
                  }}
                >
                  {playlist?.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlaylistAddButton;
