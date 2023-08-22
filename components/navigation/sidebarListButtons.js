import React from 'react';
// import state management recoil
import { useRecoilState } from 'recoil';
import { listToShowState } from '@/atoms/otherAtoms';
// import icon/images
import { XMarkIcon } from '@heroicons/react/24/solid';

/**
 * Renders the playlist, album  buttons - to chose which list(s) in sidebar
 * @function SidebarListButton
 * @returns {JSX}
 */
function SidebarListButtons() {
  const [listToShow, setListToShow] = useRecoilState(listToShowState); // determine which list(s) to show in the sidebar
  return (
    <>
      <nav role="navigation" aria-label="choose a list" className="py-2">
        <ul className="px-2 space-x-2 space-y-2 flex items-center justify-start w-full">
          {(listToShow === 'playlists' || listToShow === 'albums') && (
            <li className="mt-2">
              <button
                onClick={() => setListToShow('all')}
                aria-label="Show all items"
                className={`text-sm p-1 rounded-full ${
                  listToShow === 'all'
                    ? 'bg-gray-300 text-gray-900 hover:bg-white focus:bg-white'
                    : 'bg-gray-900 text-white hover:bg-gray-800 focus:bg-gray-800'
                }`}
              >
                <XMarkIcon className=" w-5 h-5" />
              </button>
            </li>
          )}
          {(listToShow === 'playlists' || listToShow === 'all') && (
            <li className="mt-2">
              <button
                onClick={() => setListToShow('playlists')}
                aria-label="Show playlists"
                className={`text-sm py-1 px-2 rounded-full ${
                  listToShow === 'playlists'
                    ? 'bg-gray-300 text-gray-900 hover:bg-white focus:bg-white'
                    : 'bg-gray-900 text-white hover:bg-gray-800 focus:bg-gray-800'
                }`}
              >
                Playlists
              </button>
            </li>
          )}
          {(listToShow === 'albums' || listToShow === 'all') && (
            <li className="mt-2">
              <button
                onClick={() => setListToShow('albums')}
                aria-label="Show albums"
                className={`text-sm py-1 px-3 rounded-full ${
                  listToShow === 'albums'
                    ? 'bg-gray-300 text-gray-900 hover:bg-white focus:bg-white'
                    : 'bg-gray-900 text-white hover:bg-gray-800 focus:bg-gray-800'
                }`}
              >
                Albums
              </button>
            </li>
          )}
        </ul>
      </nav>
    </>
  );
}

export default SidebarListButtons;
