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
      <span className="flex px-5">
        <span>#</span>
        <span className="w-36 lg:w-64 pl-2">Title</span>
      </span>
      <span className="flex justify-end ml-auto md:ml-0 pr-5">
        <span className="flex items-center">
          <ClockIcon className="h-5 w-5 pr-1" />
          <span>Time</span>
        </span>
      </span>
    </>
  );
};

export default TitleTime;
