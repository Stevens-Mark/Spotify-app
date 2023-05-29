import React, { useEffect, useState } from 'react';
import { searchResultState } from '@/atoms/searchAtom';
import Image from 'next/image';
import Link from 'next/link';
import { useRecoilValue } from 'recoil';
import { PlayCircleIcon, XMarkIcon } from '@heroicons/react/24/solid';
import  noImage from '@/public/images/noImageAvailable.svg';

const PreviousSearches = () => {
  const queryResults = useRecoilValue(searchResultState); // Get the queryResults from Recoil
  const [recent, setRecent] = useState('');

  useEffect(() => {
    if (queryResults.albums?.items.length > 0) {
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

    // Filter out the item with the matching itemId
    previousSearches = previousSearches.filter((album) => album.id !== itemId);

    localStorage.setItem('previousSearches', JSON.stringify(previousSearches));

    // Update the recent state with the updated previous searches
    setRecent(previousSearches);
  };

  return (
    <>
      {recent.length !== 0 && (
        <div className="bg-black pb-4">
          {/* recent search list here */}
          <h1 className="text-white mb-5 text-2xl md:text-3xl 2xl:text-4xl">
            Recent searches
          </h1>
          <div className="grid xxs:grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-6">
            {recent.map((item, i) => (
              <Link
                href=""
                key={`${item.id}-${i}`}
                className={`group relative rounded-lg cursor-pointer bg-gray-900 hover:bg-gray-800 transition delay-100 duration-300 ease-in-out pb-8`}
              >
                <button
                  className="text.white absolute top-1 z-10 right-1"
                  onClick={(e) => removeFromLocalStorage(e, item.id)}
                >
                  <XMarkIcon className="relative z-100 p-[3px] w-7 h-7 rounded-full  bg-gray-800" />
                </button>
                <div className="relative p-2 sm:p-2 md:p-3 xl:p-4">
                  <Image
                    className="aspect-square w-full rounded-md shadow-image"
                    src={item.images?.[0]?.url || noImage}
                    alt="cover"
                    width={100}
                    height={100}
                  />

                  <button className="absolute bottom-24 right-7 bg-black rounded-full opacity-0 shadow-3xl text-green-500 group-hover:-translate-y-2 transition delay-100 duration-300 ease-in-out group-hover:opacity-100 hover:scale-110">
                    <PlayCircleIcon className="w-12 h-12 -m-2" />
                  </button>

                  <h2 className="text-white capitalize mt-2 line-clamp-1">
                    {item.name.replace('/', ' & ')}
                  </h2>
                  <span className="flex flex-wrap text-pink-swan mt-2 h-10">
                    <span>{item.release_date.slice(0, 4)}&nbsp;•&nbsp;</span>

                    {item.artists.slice(0, 2).map((item) => (
                      <span className="truncate" key={item.id}>
                        {item.name}.&nbsp;
                      </span>
                    ))}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default PreviousSearches;
