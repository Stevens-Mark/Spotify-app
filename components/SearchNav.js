import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
// import state management recoil
import { useRecoilValue } from 'recoil';
import { errorState } from '@/atoms/errorAtom';
import { querySubmittedState, searchingState } from '@/atoms/searchAtom';

/**
 * Renders album, playlist, artists etc under search input when results found
 * (used to navigate between search results)
 * @function SearchNav
 * @returns {JSX}
 */
function SearchNav() {
  const submitted = useRecoilValue(querySubmittedState);
  const isSearching = useRecoilValue(searchingState);
  const isError = useRecoilValue(errorState);
  const router = useRouter();
  const path = router?.asPath; // URL from router.

  return (
    <>
      {submitted && !isSearching && !isError && (
        <nav
          role="navigation"
          aria-label="Search menu"
          className="mt-1.5 py-[3px]"
        >
          <ul className="px-8 space-x-2 flex justify-center xs:justify-start w-full">
            <li>
              <Link
                href="/search/artists"
                className={`text-sm py-1 px-3 rounded-full ${
                  path === '/search/artists'
                    ? 'bg-gray-300 text-gray-900 hover:bg-white'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
              >
                Artists
              </Link>
            </li>
            <li>
              <Link
                href="/search/playlists"
                className={`text-sm py-1 px-3 rounded-full ${
                  path === '/search/playlists'
                    ? 'bg-gray-300 text-gray-900 hover:bg-white'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
              >
                Playlists
              </Link>
            </li>
            <li>
              <Link
                href="/search/albums"
                className={`text-sm py-1 px-3 rounded-full ${
                  path === '/search/albums'
                    ? 'bg-gray-300 text-gray-900 hover:bg-white'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
              >
                Albums
              </Link>
            </li>
            <li>
              <Link
                href="/search/podcastAndEpisodes"
                className={`text-sm py-1 px-3 rounded-full ${
                  path === '/search/podcastAndEpisodes'
                    ? 'bg-gray-300 text-gray-900 hover:bg-white'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
              >
                Shows
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </>
  );
}

export default SearchNav;
