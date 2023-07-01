import React from 'react';
import { ClockIcon } from '@heroicons/react/24/outline';

/**
 * Renders the relevant Headings
 * @function TitleAlbumDateTime
 * @returns {JSX} Headings
 */
const TitleAlbumDateTime = () => {
  return (
    <>
      <span className="flex px-5 xs:px-0">
        <span>#</span>
        <span className="w-36 lg:w-64 pl-2">Title</span>
      </span>
      <span className="flex justify-end mdlg:justify-between ml-auto md:ml-0 pr-5 xs:pr-2">
        <span className="w-40 hidden mdlg:inline pr-1">Album</span>
        <span className="w-48 hidden mdlg:inline pr-1">Date Added</span>
        <span className="flex items-center">
          <ClockIcon className="h-5 w-5 pr-1" />
          <span>Time</span>
        </span>
      </span>
    </>
  );
};

export default TitleAlbumDateTime;
