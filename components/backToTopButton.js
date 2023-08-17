import React from 'react';
import { ArrowUpCircleIcon } from '@heroicons/react/24/solid';

/**
 * Render the green back to top button
 * @function BackToTopButton
 * @returns {JSX}
 */
function BackToTopButton({scrollToTop}) {
  return (
    <button
      className="fixed bottom-28 isSm:bottom-24 right-2 isSm:right-4 rounded-full hover:scale-110 duration-150 ease-in-out z-[100]"
      onClick={scrollToTop}
      aria-label='scroll back to top'
    >
      <ArrowUpCircleIcon className="w-12 h-12 text-green-500" />
    </button>
  );
}

export default BackToTopButton;
