import React from 'react';
import useSpotify from '@/hooks/useSpotify';
// import state management recoil
import { useRecoilState } from 'recoil';
import { searchResultState, queryState } from '@/atoms/searchAtom';
// import icons & components
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import SearchNav from './SearchNav';

const NestedLayout = ({ children }) => {
  const spotifyApi = useSpotify();
  const [queryResults, setQueryResults] = useRecoilState(searchResultState);
  const [query, setQuery] = useRecoilState(queryState);

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
    const itemsPerPage = 20;
    if (query.length > 0) {
      try {
        // Search for albums, artists, playlists, tracks, shows, and episodes
        const response = await spotifyApi.search(
          query,
          ['album', 'artist', 'playlist', 'track', 'show', 'episode'],
          { limit: itemsPerPage }
        );
        const data = response.body;
        setQueryResults(data);
      } catch (err) {
        console.error('Search failed: ', err);
      }
    }
  };

  return (
    <>
      <div className="flex flex-col w-full relative">
        <div className="sticky h-28">
          <form
            className="ml-8 mt-5"
            onChange={handleSubmit}
            onSubmit={handleSubmit}
          >
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
                maxLength={30}
                onChange={(e) => handleText(e)}
              />
            </label>
          </form>

          <SearchNav />
        </div>

        {children}
      </div>
    </>
  );
};

export default NestedLayout;
