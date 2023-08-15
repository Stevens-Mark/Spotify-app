import React from 'react';
import useSpotify from '@/hooks/useSpotify';
import { toast } from 'react-toastify';
// import state management recoil
import { useRecoilState } from 'recoil';
import { isLikedSongState } from '@/atoms/otherAtoms';
// import icon
import { HeartIcon } from '@heroicons/react/24/solid';
import { HeartIcon as HeartOuline } from '@heroicons/react/24/outline';

function AddRemoveLiked() {
  const spotifyApi = useSpotify();
  const [isLikedSong, setIsLikedSong] = useRecoilState(isLikedSongState);
  const collection = isLikedSong?.includes(song?.id);

  // Add track to liked songs list
  const handleAdd = () => {
    spotifyApi.addToMySavedTracks([song?.id]).then(
      function () {
        setIsLikedSong((prevLikedSongs) => [...prevLikedSongs, song?.id]); // Add song.id to the existing state array
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
    spotifyApi.removeFromMySavedTracks([song?.id]).then(
      function () {
        setIsLikedSong((prevLikedSongs) =>
          prevLikedSongs.filter((likedSongId) => likedSongId !== song?.id)
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
          className="text-green-500 h-5 w-5"
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
