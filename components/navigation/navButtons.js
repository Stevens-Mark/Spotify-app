import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
// import icon/images
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

function NavigationButtons() {
  const router = useRouter();
  const [canGoBack, setCanGoBack] = useState(true);
  const [canGoForward, setCanGoForward] = useState(true);

  // needs improving to mimic brower navigatyion controls

  const handleGoBack = () => {
    router.back();
  };

  const handleGoForward = () => {
    window.history.forward();
  };

  return (
    <div className="absolute top-6 left-8 z-30 hidden xs:inline">
      {canGoBack && (
        <button
          className="rounded-full mr-1 bg-gray-900 hover:bg-gray-800 text-pink-swan hover:text-white"
          onClick={handleGoBack}
        >
          <ChevronLeftIcon className="p-1 w-8 h-8 pl-[1px]" />
        </button>
      )}

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
