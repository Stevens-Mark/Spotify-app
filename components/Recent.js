import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import useSpotify from '@/hooks/useSpotify';
import { searchResultState } from '@/atoms/searchAtom';
import { useRecoilValue } from 'recoil';
import useNumOfItems from '@/hooks/useNumberOfItems'; //control number of cards shown depending on screen width
import { XMarkIcon } from '@heroicons/react/24/solid';
import Card from './cards/card';

/**
 * Fetches recent searches from local storage to be displayed &
 * handles deletion of a recent search also
 * @function PreviousSearches
 * @returns {JSX}
 */
const PreviousSearches = () => {
  const spotifyApi = useSpotify();
  const { data: session } = useSession();
  const numOfItems = useNumOfItems();
  const queryResults = useRecoilValue(searchResultState); // Get the queryResults from Recoil
  const [recent, setRecent] = useState('');

  useEffect(() => {
    if (queryResults.albums?.items?.length > 0) {
      const firstAlbum = queryResults.albums.items[0]; // Get the first album from queryResults

      // Retrieve previous searches from local storage
      const storedSearches = localStorage.getItem('previousSearches');
      let previousSearches = storedSearches ? JSON.parse(storedSearches) : [];

      // Check if the album already exists in previous searches
      const albumExists = previousSearches.some(
        (album) => album.id === firstAlbum.id
      );

      // If the album doesn't exist, add it to previous searches
      if (!albumExists) {
        previousSearches = [firstAlbum, ...previousSearches];
        localStorage.setItem(
          'previousSearches',
          JSON.stringify(previousSearches)
        );
      }
      setRecent(previousSearches);
    }
  }, [queryResults.albums?.items]);

  useEffect(() => {
    // Retrieve previous searches from local storage to display on page
    const storedSearches = localStorage.getItem('previousSearches');
    const previousSearches = storedSearches ? JSON.parse(storedSearches) : [];
    setRecent(previousSearches);
  }, []);

  const removeFromLocalStorage = (event, itemId) => {
    event.preventDefault(); // to prevent the default link behavior
    event.stopPropagation(); // to stop the event from propagating to parent elements.

    const storedSearches = localStorage.getItem('previousSearches');
    let previousSearches = storedSearches ? JSON.parse(storedSearches) : [];

    // Filter out the item with the matching itemId (ie, delete item)
    previousSearches = previousSearches.filter((album) => album.id !== itemId);

    localStorage.setItem('previousSearches', JSON.stringify(previousSearches));

    // Update the recent state with the updated previous searches
    setRecent(previousSearches);
  };

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        if (spotifyApi.getAccessToken()) {
          const data = await spotifyApi.getMyRecentlyPlayedTracks();
          console.log('the data returned ', data?.body?.items);
        }
      } catch (err) {
        console.error('something went wrong', err);
      }
    };
    fetchRecent();
  }, [spotifyApi]);

  return (
    <>
      {recent?.length !== 0 && (
        <section className="bg-black pb-4">
          <h2 className="text-white mb-5 text-2xl md:text-3xl 2xl:text-4xl">
            Recent searches
          </h2>
          <div className="grid grid-cols-1 xxs:grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-6">
            {/* recent search list here */}
            {recent?.slice(0, numOfItems).map((item, i) => (
              <div
                className="relative rounded-lg bg-gray-900 hover:bg-gray-800 transition delay-100 duration-300 ease-in-out pb-8"
                key={`${item?.id}-${i}`}
              >
                <button
                  className="text.white absolute top-1 z-10 right-1"
                  onClick={(e) => removeFromLocalStorage(e, item?.id)}
                >
                  <XMarkIcon className="relative z-100 p-[3px] w-7 h-7 rounded-full  bg-gray-800 hover:scale-125 duration-150 ease-in-out" />
                </button>
                <Card item={item} />
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
};

export default PreviousSearches;
