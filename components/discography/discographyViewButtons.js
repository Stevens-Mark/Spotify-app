import React from 'react';
// import state management recoil
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  singlesDiscographyState,
  albumsDiscographyState,
  compilationDiscographyState,
  discographyToShowState,
} from '@/atoms/artistAtom';

// import icon/images
import { XMarkIcon } from '@heroicons/react/24/solid';

/**
 * Renders the playlist, album  buttons - to chose which list(s) in sidebar
 * @function DiscographyViewButtons
 * @returns {JSX}
 */
function DiscographyViewButtons() {
  const [discographyToShow, setDiscographyToShow] = useRecoilState(
    discographyToShowState
  ); // determine which records list to show
  const singlesOnly = useRecoilValue(singlesDiscographyState);
  const albumsOnly = useRecoilValue(albumsDiscographyState);
  const compilationOnly = useRecoilValue(compilationDiscographyState);

  return (
    <>
      <nav
        role="navigation"
        aria-label="show all, albums or singles"
        className="py-2"
      >
        <ul className="py-1 space-x-2 flex items-center ">
          {discographyToShow !== 'all' && (
            <li>
              <button
                onClick={() => {
                  setDiscographyToShow('all');
                }}
                aria-label="Show all the discography"
                className={`text-sm p-1 rounded-full ${
                  discographyToShow === 'all'
                    ? 'bg-gray-300 text-gray-900 hover:bg-white focus:bg-white'
                    : 'bg-gray-900 text-white hover:bg-gray-800 focus:bg-gray-800'
                }`}
              >
                <XMarkIcon className=" w-5 h-5" />
              </button>
            </li>
          )}

          <>
            <span className=" flex whitespace-nowrap space-x-2 py-1">
              {albumsOnly?.length > 0 && (
                <li>
                  <button
                    aria-label="Show albums"
                    className={`${
                      discographyToShow === 'album'
                        ? 'bg-white text-gray-900 focus:bg-white transition delay-100 duration-200 ease-in-out'
                        : 'bg-gray-900 text-white hover:bg-gray-800 focus:bg-gray-800'
                    } text-sm py-1 px-2 rounded-full`}
                    onClick={() =>
                      setDiscographyToShow(
                        discographyToShow === 'album' ? 'all' : 'album'
                      )
                    }
                  >
                    Albums
                  </button>
                </li>
              )}
              {singlesOnly?.length > 0 && (
                <li>
                  <button
                    aria-label="Show singles"
                    className={`${
                      discographyToShow === 'single'
                        ? 'bg-white text-gray-900  focus:bg-white transition delay-100 duration-200 ease-in-out'
                        : 'bg-gray-900 text-white hover:bg-gray-800 focus:bg-gray-800'
                    } text-sm py-1 px-2 rounded-full`}
                    onClick={() =>
                      setDiscographyToShow(
                        discographyToShow === 'single' ? 'all' : 'single'
                      )
                    }
                  >
                    Singles
                  </button>
                </li>
              )}
              {compilationOnly?.length > 0 && (
                <li>
                  <button
                    aria-label="Show compilations"
                    className={`${
                      discographyToShow === 'compilation'
                        ? 'bg-white text-gray-900  focus:bg-white transition delay-100 duration-200 ease-in-out'
                        : 'bg-gray-900 text-white hover:bg-gray-800 focus:bg-gray-800'
                    } text-sm py-1 px-2 rounded-full`}
                    onClick={() =>
                      setDiscographyToShow(
                        discographyToShow === 'compilation' ? 'all' : 'compilation'
                      )
                    }
                  >
                    Compilations
                  </button>
                </li>
              )}
            </span>
          </>
        </ul>
      </nav>
    </>
  );
}

export default DiscographyViewButtons;
