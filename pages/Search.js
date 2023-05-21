import React from 'react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import useSpotify from '@/hooks/useSpotify';
// import state management recoil
import { useRecoilState } from 'recoil';
import { searchResultState } from '@/atoms/searchAtom';
import { genreState } from '@/atoms/genreAtom';
// import icons & components
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Layout from '@/components/Layout';
import { bgColors } from '@/styles/colors';

function Search() {
  const spotifyApi = useSpotify();
  const [queryResults, setQueryResults] = useRecoilState(searchResultState);
  const [genres, setGenres] = useRecoilState(genreState);
  const [query, setQuery] = useState('');

  /**
   * Restricts what the user can enter in the TEXT search field & saves to local state
   * @function handleText
   * @param {object} e
   */
  const handleText = (e) => {
    setQuery(
      // permits alphanumeric
      e.target.value.replace(/[^0-9a-zA-ZÀ-ÿ-.\s]/g, '').trimStart()
    );
  };

  /**
   * On submit fetch all data (album,artist,playlist,track,show,episode) according to the search string
   * provided by the user & put in global state
   * @function handleSubmit
   * @param {object} e
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (query.length > 0) {
      try {
        const res = await fetch(
          `https://api.spotify.com/v1/search?q=${query}&type=album,artist,playlist,track,show,episode`,
          {
            headers: {
              Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
            },
          }
        );
        const data = await res.json();
        setQueryResults(data);
      } catch (err) {
        console.error('Search failed: ', err);
      }
    }
  };

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi
        .getCategories({
          limit: 50,
          offset: 0,
          country: 'US', // FR, US, GB
          locale: 'en_US', // fr_FR, en_US, en_GB
        })
        .then(
          function (data) {
            setGenres(data.body);
          },
          function (err) {
            console.log('Failed to get genres!', err);
          }
        );

      // spotifyApi.getAvailableGenreSeeds().then(
      //   function (data) {
      //     let genreSeeds = data.body;
      //     console.log("genreSeeds ",genreSeeds);
      //   },
      //   function (err) {
      //     console.log('Something went wrong!', err);
      //   }
      // );
    }
  }, [setGenres, spotifyApi]);

  console.log(query, queryResults);
  console.log('categories: ', genres);

  return (
    <>
      <div className="flex flex-col w-full">
        <div className="sticky h-20">
          <form className="ml-8 mt-5" onSubmit={handleSubmit}>
            <label
              className="relative text-gray-500 hover:text-white"
              htmlFor="search"
            >
              <MagnifyingGlassIcon className="pointer-events-none w-5 h-6 absolute top-1/2 transform -translate-y-1/2 left-3" />
              <input
                className="rounded-full bg-gray-900 hover:bg-gray-800 text-white text-sm sm:w-[15rem] lg:w-[16.5rem] cursor-pointer appearance-none block py-3 px-4 pl-10 placeholder-gray-500 hover:placeholder-white"
                type="search"
                id="search"
                value={query}
                placeholder="What do you want to listen to ?"
                // required={true}
                maxLength={30}
                onChange={(e) => handleText(e)}
              />
            </label>
          </form>
        </div>
        <div className="overflow-y-scroll h-screen text-white scrollbar-hide p-8 pb-48">
          {/* song playlist here */}
          <div className="grid xxs:grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-6">
            {genres?.categories.items.map((genre, i) => (
              <div
                key={`${genre.id}-${i}`}
                className={`relative overflow-hidden rounded-lg ${
                  bgColors[Math.floor(Math.random() * bgColors.length)]
                } aspect-square`}
              >
                <h2 className="relative z-10 capitalize px-3 py-4 text-xl md:text-2xl2xl:text-3xl">
                  {genre.name.replace('/', ' & ')}
                </h2>
                <Image
                  className="absolute bottom-3 right-0 origin-bottom-left rotate-[30deg] w-3/4 h-3/4"
                  src={genre.icons[0].url}
                  alt="user"
                  width={100}
                  height={100}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Search;

Search.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
