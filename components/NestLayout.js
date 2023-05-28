import React, { useEffect } from 'react';
import useSpotify from '@/hooks/useSpotify';
import { useRouter } from 'next/router';
// import state management recoil
import { useRecoilState, useSetRecoilState } from 'recoil';
import { errorState } from '@/atoms/errorAtom';
import {
  searchResultState,
  queryState,
  querySubmittedState,
  searchingState,
} from '@/atoms/searchAtom';
// import icons & components
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import SearchNav from './SearchNav';
import StatusSpinner from './StatusSpinner';

const NestedLayout = ({ children }) => {
  const spotifyApi = useSpotify();
  const setQueryResults = useSetRecoilState(searchResultState);
  const [query, setQuery] = useRecoilState(queryState);
  const setSubmitted = useSetRecoilState(querySubmittedState);
  const [isSearching, setIsSearching] = useRecoilState(searchingState);
  const [isError, setIsError] = useRecoilState(errorState);
  const router = useRouter();

  useEffect(() => {
    if (!query) {
      setIsError(false);
    }
  }, [query, setIsError]);

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
    if (e.target.value === '') {
      setSubmitted(false);
    }
  };

  /**
   * On submit fetch all data (album,artist,playlist,track,show,episode) according to the search string
   * provided by the user & put in global state
   * @function handleSubmit
   * @param {object} e
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const itemsPerPage = 50;
    if (query.length > 0) {
      setSubmitted(true);
      try {
        setIsError(false);
        setIsSearching(true);
        // Search for albums, artists, playlists, tracks, shows, and episodes
        const response = await spotifyApi.search(
          query,
          ['album', 'artist', 'playlist', 'track', 'show', 'episode'],
          { limit: itemsPerPage }
        );
        const data = response.body;
        setQueryResults(data);
        setIsSearching(false);
        router.push('/search/albums');
      } catch (err) {
        setIsSearching(false);
        setIsError(true);
        console.error('Search failed: ', err);
      } 
    }
  };

  return (
    <>
      <div className="flex flex-col w-full relative">
        <div className="sticky h-28">
          <div className="flex items-center">
            <form className="ml-8 mt-5" onSubmit={handleSubmit}>
              <label
                className="relative text-gray-500 hover:text-white"
                htmlFor="search"
              >
                <MagnifyingGlassIcon className="pointer-events-none w-5 h-6 absolute top-1/2 transform -translate-y-1/2 left-3" />
                <input
                  className="rounded-full bg-gray-900 hover:bg-gray-800 text-white text-sm sm:w-[15rem] lg:w-[16.5rem] cursor-pointer appearance-none block py-3 px-3 pl-10 placeholder-gray-500 hover:placeholder-white"
                  type="search"
                  id="search"
                  value={query}
                  placeholder="What to listen to ?"
                  maxLength={30}
                  onChange={(e) => handleText(e)}
                />
              </label>
            </form>
            {isSearching && <StatusSpinner />}
            {isError && <span className="text-white mt-5 ml-5">Error !</span>}
          </div>
          <SearchNav />
        </div>

        {children}
      </div>
    </>
  );
};

export default NestedLayout;
