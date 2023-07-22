import React from 'react';
import { ClockIcon, HeartIcon } from '@heroicons/react/24/outline';

/**
 * Renders the relevant Headings
 * @function TitleAlbumDateTime
 * @param {boolean} collection sets DUMMY space so headings align with heart in likedsongs list(see rendertracks.js)
 * @returns {JSX} Headings
 */
const TitleAlbumDateTime = ({ collection }) => {
  return (
    <>
      <span className="flex items-center px-5 space-x-4">
        <span className="w-10 lg:w-8 pl-2">#</span>
        <span className="w-full sm:w-72 mdlg:w-36 lg:w-60 xl:w-80 2xl:w-[30rem] pr-2">
          Title
        </span>
      </span>
      <span className="flex items-center justify-end mdlg:justify-between ml-auto md:ml-0 pr-5">
        <span className="w-80 hidden mdlg:inline pr-1">Album</span>
        <span className="w-48 hidden mdlg:inline pr-1">Date Added</span>
        <span className="flex items-center">
          {/* space added to help heading alignment for likedsongs list as there's a green heart */}
          {collection && <span className="w-5"></span>}
          <ClockIcon className="h-5 w-5 pr-1" />
          <span>Time</span>
        </span>
      </span>
    </>
  );
};

export default TitleAlbumDateTime;
