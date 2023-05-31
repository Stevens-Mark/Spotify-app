import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

/**
 * Renders 404 page
 * @function Error
 * @returns {JSX}
 */
function Error() {
  return (
    <div className="flex flex-col items-center bg-black min-h-screen w-full justify-center text-green-500 text-center">
      <Image
        className="w-52 mb-8"
        src="/images/Spotify_logo.svg"
        alt=""
        width={52}
        height={52}
        priority
      />
      <h1 className="text-7xl">404</h1>
      <h2 className="text-2xl sm:text-3xl md:text-4xl mb-3 p-5">
        Oops! It seems the page you are looking for doesn{"'"}t exist.
      </h2>
      <Link
        href="/"
        className="flex items-center m-3 text-lg md:text-3xl hover:text-white"
      >
        Click here to go back to the homepage...
      </Link>
    </div>
  );
}

export default Error;
