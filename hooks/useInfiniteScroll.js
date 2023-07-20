import { useEffect, useRef } from 'react';
import throttle from 'lodash/throttle';

/**
 * infinite scrolling functionality with throttling
 * @param {function} fetchMoreData to load more items on a page
 * @returns
 */
const useInfiniteScroll = (fetchMoreData) => {
  const containerRef = useRef(null);

  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

    // Check if the user has scrolled to the bottom
    if (scrollTop + clientHeight >= scrollHeight - 600) {
      fetchMoreData();
    }
  };

  // Use lodash throttle to throttle the handleScroll function
  const throttledHandleScroll = throttle(handleScroll, 2000); // Adjust the throttle time as needed (e.g., 2000ms)

  useEffect(() => {
    // Add event listener for scrolling
    const containerNode = containerRef.current;
    containerNode.addEventListener('scroll', throttledHandleScroll);

    return () => {
      // Cleanup: remove event listener when component unmounts
      containerNode.removeEventListener('scroll', throttledHandleScroll);
    };
  }, [throttledHandleScroll]);

  return containerRef;
};

export default useInfiniteScroll;

