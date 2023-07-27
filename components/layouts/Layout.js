import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
// import icon/images
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import noUserImage from '@/public/images/user_noImage.svg';
// import component
import Sidebar from '../navigation/Sidebar';
import Player from '../player/Player';
import NavigationButtons from '../navigation/navButtons';

/**
 * Renders the user picture & sidebar (for all pages) as part of the general layout.
 * All other components are rendered inside this.
 * @function Layout
 * @param {object} children components
 * @returns {JSX}
 */
const Layout = ({ children }) => {
  const { data: session } = useSession();

  return (
    <main className="bg-black h-screen overflow-hidden">
      <aside className="absolute top-5 right-5 z-[100]">
        <button
          className="flex items-center bg-gray-800 space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 text-white"
          onClick={signOut}
          aria-label="sign out"
        >
          <Image
            className="rounded-full w-9 h-9"
            src={session?.user?.image || noUserImage}
            alt=""
            width={100}
            height={100}
            style={{ objectFit: 'cover' }}
            priority
          />
          <p className={`hidden  isMdLg:inline`}>{session?.user?.name}</p>
          <ChevronDownIcon className={`h-5 w-5 hidden  isMdLg:inline`} />
        </button>
      </aside>
      <div className="flex">
        <Sidebar />
        <div className="relative w-full">
          <NavigationButtons />
          {children}
        </div>
      </div>

      <div className="sticky bottom-0 z-20">
        <Player />
      </div>
    </main>
  );
};

export default Layout;
