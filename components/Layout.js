import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import Image from 'next/image';
// import icon/images
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import noUserImage from '@/public/images/user_noImage.svg';
// import component
import Sidebar from './Sidebar';
import Player from './Player';

const Layout = ({ children }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const path = router?.asPath; // URL from router.

  const excludedPath = ['/search', '/search/albums', 'search/playlists'];
  const isExcluded = excludedPath.includes(path);

  return (
    <div className="bg-black  h-screen overflow-hidden">
      <header className="absolute top-5 right-8 z-10">
        <div
          className="flex items-center bg-gray-800 space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 sm:pr-2 text-white"
          onClick={signOut}
        >
          <Image
            className="rounded-full w-9 h-9"
            src={session?.user.image || noUserImage}
            alt="user"
            width={100}
            height={100}
            priority
          />
          <h2 className={`${isExcluded ? 'hidden sm:inline' : ''}`}>
            {session?.user.name}
          </h2>
          <ChevronDownIcon
            className={`h-5 w-5 ${isExcluded ? 'hidden sm:inline' : ''}`}
          />
        </div>
      </header>
      <main className="flex">
        <Sidebar />
        {children}
      </main>

      <div className="sticky bottom-0 z-20">
        <Player />
      </div>
    </div>
  );
};

export default Layout;