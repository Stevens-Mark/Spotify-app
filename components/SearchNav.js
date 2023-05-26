import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
// import state management recoil
import { useRecoilValue } from 'recoil';
import { searchResultState, querySubmittedState} from '@/atoms/searchAtom';

function SearchNav() {
  const queryResults = useRecoilValue(searchResultState);
  const submitted = useRecoilValue(querySubmittedState);
  const router = useRouter();
  const path = router?.asPath; // URL from router.
 
  return (
    <div className="mt-1.5 py-[3px] px-8 absolute space-x-2">
    {queryResults.length !== 0 && submitted && (
      <>
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
      </>
    )}
  </div>
  )
}

export default SearchNav
