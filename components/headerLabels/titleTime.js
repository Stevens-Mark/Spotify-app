import React from 'react';
import { ClockIcon } from '@heroicons/react/24/outline';

/**
 * Renders the relevant Headings
 * @function TitleTime
 * @returns {JSX} Headings
 */
const TitleTime = () => {
  return (
    <>
      <span className="flex items-center px-3 isSm:px-2 lg:px-4">
        <span className="w-14 lg:w-12 flex flex-shrink-0 justify-center">#</span>
        <span className="w-full sm:w-72 mdlg:w-36 lg:w-60 xl:w-80 2xl:w-[30rem] pr-2">Title</span>
      </span>
      <span className="flex justify-end ml-auto md:ml-0 pr-14">
        <span className="flex items-center">
          <ClockIcon className="h-5 w-5 pr-1" />
          <span>Time</span>
        </span>
      </span>
    </>
  );
};

export default TitleTime;
