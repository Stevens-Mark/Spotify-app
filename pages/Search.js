import React from 'react';
import { useState } from 'react';
import useSpotify from '@/hooks/useSpotify';
// import state management recoil
import { useRecoilState } from 'recoil';
import { searchResultState } from '@/atoms/searchAtom';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

function Search() {
  const spotifyApi = useSpotify();
  const [queryResults, setQueryResults] = useRecoilState(searchResultState);
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

  console.log(query, queryResults)

  return (
    <>
    <div className="bg-red-800 sticky h-20 w-full">
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
    </>
  );
}

export default Search;
