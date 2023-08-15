import React from 'react';
import useSpotify from '@/hooks/useSpotify';
import { toast } from 'react-toastify';
// import state management recoil
import { useRecoilState } from 'recoil';
import { isLikedSongState } from '@/atoms/otherAtoms';
// import icon
import { HeartIcon } from '@heroicons/react/24/solid';
import { HeartIcon as HeartOuline } from '@heroicons/react/24/outline';

/**
 * Handles the adding/removing tracks from lied song list
 * @function AddRemoveLiked
 * @param {string} songId ID of the song
 * @returns {JSX} liked add/remove button
 */
function AddRemoveLiked({ songId }) {
  const spotifyApi = useSpotify();
  const [isLikedSong, setIsLikedSong] = useRecoilState(isLikedSongState);
  const collection = isLikedSong?.includes(songId);

  // Add track to liked songs list
  const handleAdd = () => {
    spotifyApi.addToMySavedTracks([songId]).then(
      function () {
        // Add songId to the existing state array: causing rerender
        setIsLikedSong((prevLikedSongs) => [...prevLikedSongs, songId]);
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
        // Remove songId from existing state array: causing rerender
        setIsLikedSong((prevLikedSongs) =>
          prevLikedSongs.filter((likedSongId) => likedSongId !== songId)
        );
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
      {collection ? (
        <button
          className="text-green-500 h-5 w-5 hover:scale-110 focus:scale-110"
          onClick={() => {
            handleRemove();
          }}
        >
          <HeartIcon aria-label="Remove from Favorite" />
        </button>
      ) : (
        <button
          className="text-pink-swan h-5 w-5 opacity-0 group-hover:opacity-100 hover:text-white hover:scale-110  group-focus:opacity-100 focus:text-white focus:scale-110"
          onClick={() => {
            handleAdd();
          }}
        >
          <HeartOuline aria-label="Add to Favorite" />
        </button>
      )}
    </>
  );
}

export default AddRemoveLiked;
