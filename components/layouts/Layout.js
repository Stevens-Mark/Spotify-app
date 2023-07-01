import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import Image from 'next/image';
// import icon/images
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import noUserImage from '@/public/images/user_noImage.svg';
// import component
import Sidebar from '../Sidebar';
import Player from '../player/Player';
import NavigationButtons from '../navButtons';

/**
 * Renders the user picture & sidebar (for all pages) as part of the general layout.
 * All other components are rendered inside this.
 * @function Layout
 * @param {object} children components
 * @returns {JSX}
 */
const Layout = ({ children }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const path = router?.asPath; // URL from router.

  const excludedPath = [
    // used to trigger the collapsing of the user info top right on mobile screens
    '/search',
    '/search/all',
    '/search/albums',
    '/search/artists',
    '/search/episodes',
    '/search/playlists',
    '/search/shows',
    '/search/podcastAndEpisodes',
  ];
  const isExcluded = excludedPath.includes(path);

  return (
    <div className="bg-black h-screen overflow-hidden">
      <aside className="absolute top-5 right-8 z-10">
        <div
          className="flex items-center bg-gray-800 space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 sm:pr-2 text-white"
          onClick={signOut}
        >
          <Image
            className="rounded-full w-9 h-9"
            src={session?.user.image || noUserImage}
            alt=""
            width={100}
            height={100}
            priority
          />
          <p className={`${isExcluded ? 'hidden  isMdLg:inline' : ''}`}>
            {session?.user.name}
          </p>
          <ChevronDownIcon
            className={`h-5 w-5 ${isExcluded ? 'hidden  isMdLg:inline' : ''}`}
          />
        </div>
      </aside>
      <main className="flex">
        <Sidebar />
        <div className='relative w-full'>
          <NavigationButtons />
          {children}
        </div>
      </main>

      <footer className="sticky bottom-0 z-20">
        <Player />
      </footer>
    </div>
  );
};

export default Layout;
