import React from 'react';
// import state management recoil
import { useRecoilState } from 'recoil';
import { listToShowState, playlistInUseState } from '@/atoms/otherAtoms';
// import icon/images
import { XMarkIcon } from '@heroicons/react/24/solid';

/**
 * Renders the playlist, album  buttons - to chose which list(s) in sidebar
 * @function SidebarListButton
 * @returns {JSX}
 */
function SidebarListButtons() {
  const [listToShow, setListToShow] = useRecoilState(listToShowState); // determine which list(s) to show in the sidebar
  const [playlistInUse, setPlaylistInUse] = useRecoilState(playlistInUseState);
  return (
    <>
      <nav role="navigation" aria-label="choose a list" className="py-2">
        <ul className="px-2 space-x-2  flex items-center justify-start w-full">
          {(listToShow === 'playlists' || listToShow === 'albums') && (
            <li>
              <button
                onClick={() => {
                  setListToShow('all');
                  setPlaylistInUse('all');
                }}
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
            <>
              <li className="relative z-10">
                <button
                  aria-label="Show all playlists"
                  className={`text-sm py-1 px-2 rounded-full ${
                    listToShow === 'playlists'
                      ? 'bg-gray-300 text-gray-900 hover:bg-white focus:bg-white'
                      : 'bg-gray-900 text-white hover:bg-gray-800 focus:bg-gray-800'
                  }`}
                  onClick={() => {
                    setListToShow(
                      listToShow === 'playlists' ? 'all' : 'playlists'
                    );
                    setPlaylistInUse('all');
                  }}
                >
                  Playlists
                </button>
              </li>
              {listToShow === 'playlists' && (
                <>
                  {(playlistInUse === 'user' || playlistInUse === 'all') && (
                    <li className="relative z-0">
                      <button
                        aria-label="Show playlists by you"
                        className={`${
                          playlistInUse === 'user'
                            ? 'bg-white text-gray-900  focus:bg-white -ml-8 pl-7 transition delay-100 duration-200 ease-in-out'
                            : 'bg-gray-900 text-white hover:bg-gray-800 focus:bg-gray-800'
                        } text-sm py-1 px-2 rounded-full`}
                        onClick={() =>
                          setPlaylistInUse(
                            playlistInUse === 'user' ? 'all' : 'user'
                          )
                        }
                      >
                        You
                      </button>
                    </li>
                  )}
                  {(playlistInUse === 'spotify' || playlistInUse === 'all') && (
                    <li className="relative z-0">
                      <button
                        aria-label="Show playlists by spotify"
                        className={`${
                          playlistInUse === 'spotify'
                            ? 'bg-white text-gray-900  focus:bg-white -ml-8 pl-7 transition delay-100 duration-200 ease-in-out'
                            : 'bg-gray-900 text-white hover:bg-gray-800 focus:bg-gray-800'
                        } text-sm py-1 px-2 rounded-full`}
                        onClick={() =>
                          setPlaylistInUse(
                            playlistInUse === 'spotify' ? 'all' : 'spotify'
                          )
                        }
                      >
                        Spotify
                      </button>
                    </li>
                  )}
                </>
              )}
            </>
          )}
          {(listToShow === 'albums' || listToShow === 'all') && (
            <li className="list">
              <button
                aria-label="Show albums"
                className={`text-sm py-1 px-2 rounded-full ${
                  listToShow === 'albums'
                    ? 'bg-gray-300 text-gray-900 hover:bg-white focus:bg-white'
                    : 'bg-gray-900 text-white hover:bg-gray-800 focus:bg-gray-800'
                }`}
                onClick={() =>
                  setListToShow(listToShow === 'albums' ? 'all' : 'albums')
                }
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
