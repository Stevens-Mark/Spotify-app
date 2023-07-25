import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
// import state management recoil
import { useRecoilState } from 'recoil';
import { navIndexState } from '@/atoms/otherAtoms';
// import icon/images
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

/**
 * Renders navigation forward/backward buttons
 * (NOT PERFECT BUT OK)
 * @function NavigationButtons
 * @returns {JSX}
 */
function NavigationButtons() {
  const router = useRouter();
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [navIndex, setNnavIndex] = useRecoilState(navIndexState);

  useEffect(() => {
    // Check if the current URL is '/' (when local server) or contains the "code" query parameter (when deployed)
    const isRootPath = router.asPath === '/';
    const hasCodeQueryParam = router.asPath.includes('?code=');

    // If the current URL is '/' or contains the "code" query parameter, the user cannot go back
    setCanGoBack(!(isRootPath || hasCodeQueryParam));

    setCanGoForward(navIndex < window.history.length - 1);
  }, [navIndex, router.asPath]);

  const handleGoBack = () => {
    if (canGoBack) {
      router.back();
      setNnavIndex((prevState) => prevState - 1);
    }
  };

  const handleGoForward = () => {
    if (canGoForward) {
      window.history.forward();
      setNnavIndex((prevState) => prevState + 1);
    }
  };

  return (
    <div className="absolute top-6 left-20 md:left-8 z-30 hidden md:inline">
      <button
        className={`rounded-full mr-1 bg-gray-900 hover:bg-gray-800 text-pink-swan hover:text-white ${
          !canGoBack && 'cursor-not-allowed'
        }`}
        onClick={handleGoBack}
        aria-label="Go back a page"
      >
        <ChevronLeftIcon className="p-1 w-8 h-8 pl-[1px]" />
      </button>

      <button
        className={`rounded-full mx-1 bg-gray-900 hover:bg-gray-800 text-pink-swan hover:text-white ${
          !canGoForward && 'cursor-not-allowed'
        }`}
        onClick={handleGoForward}
        aria-label="Go forward a page"
      >
        <ChevronRightIcon className="p-1 w-8 h-8 pr-[1px]" />
      </button>
    </div>
  );
}

export default NavigationButtons;
