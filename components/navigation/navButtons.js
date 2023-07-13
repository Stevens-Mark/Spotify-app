import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
// import icon/images
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

/**
 * Renders navigation forward/backward buttons
 * @function NavigationButtons
 * @returns {JSX}
 */
function NavigationButtons() {
  const router = useRouter();
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(true);

  // still have not acheved full functionality (like on spotify)

  useEffect(() => {
    setCanGoBack(router.asPath !== '/');
  }, [router.asPath]);

  const handleGoBack = () => {
    if (canGoBack) {
      router.back();
    }
  };

  const handleGoForward = () => {
    window.history.forward();
  };

  return (
    <div className="absolute top-6 left-8 z-30 hidden xs:inline">
      <button
        className={`rounded-full mr-1 bg-gray-900 hover:bg-gray-800 text-pink-swan hover:text-white ${
          !canGoBack && 'cursor-not-allowed'
        }`}
        onClick={handleGoBack}
      >
        <ChevronLeftIcon className="p-1 w-8 h-8 pl-[1px]" />
      </button>

      {canGoForward && (
        <button
          className="rounded-full mx-1 bg-gray-900 hover:bg-gray-800 text-pink-swan hover:text-white"
          onClick={handleGoForward}
        >
          <ChevronRightIcon className="p-1 w-8 h-8 pr-[1px]" />
        </button>
      )}
    </div>
  );
}

export default NavigationButtons;
