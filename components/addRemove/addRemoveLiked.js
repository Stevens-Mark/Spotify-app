import React from 'react';
import useSpotify from '@/hooks/useSpotify';
import { toast } from 'react-toastify';
// import state management recoil
import { useRecoilState, useSetRecoilState } from 'recoil';
import {
  isLikedSongState,
  updatetriggerLikedSongState,
} from '@/atoms/songAtom';
// import icon
import { HeartIcon } from '@heroicons/react/24/solid';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';

/**
 * Handles the adding/removing tracks from liked song list
 * @function AddRemoveLiked
 * @param {string} songId ID of the song
 * @returns {JSX} liked add/remove button
 */
function AddRemoveLiked({ songId }) {
  const spotifyApi = useSpotify();
  const [isLikedSong, setIsLikedSong] = useRecoilState(isLikedSongState);
  const setTriggerUpdate = useSetRecoilState(updatetriggerLikedSongState); // used to trigger update of likedsongs
  const inLikedSongsList = isLikedSong?.includes(songId); // check if song in likedsongs list

  // Add track to liked songs list
  const handleAdd = () => {
    spotifyApi.addToMySavedTracks([songId]).then(
      function () {
        // Add songId to the existing state array & trigger list update causing rerender
        setIsLikedSong((prevLikedSongs) => [...prevLikedSongs, songId]);
        setTriggerUpdate(true);
      },
      function (err) {
        toast.error('Adding track failed !', {
          theme: 'colored',
        });
      }
    );
  };

  // Remove track from liked songs list
  const handleRemove = () => {
    spotifyApi.removeFromMySavedTracks([songId]).then(
      function () {
        // Remove songId from existing state array & trigger list update causing rerender
        setIsLikedSong((prevLikedSongs) =>
          prevLikedSongs.filter((likedSongId) => likedSongId !== songId)
        );
        setTriggerUpdate(true);
      },
      function (err) {
        toast.error('Removing track failed !', {
          theme: 'colored',
        });
      }
    );
  };

  return (
    <>
      {inLikedSongsList ? (
        <button
          aria-label="Remove from Favorite"
          className="text-green-500 h-5 w-5 hover:scale-125 focus:scale-125 transition delay-100 duration-300 ease-in-out mr-3"
          onClick={() => {
            handleRemove();
          }}
        >
          <HeartIcon className="fade-in" />
        </button>
      ) : (
        <button
          aria-label="Add to Favorite"
          className="text-black h-5 w-5 group-hover:text-pink-swan hover:scale-125 focus:text-pink-swan focus:scale-125 transition delay-100 duration-300 ease-in-out mr-3"
          onClick={() => {
            handleAdd();
          }}
        >
          <HeartOutline className="fade-in" />
        </button>
      )}
    </>
  );
}

export default AddRemoveLiked;
