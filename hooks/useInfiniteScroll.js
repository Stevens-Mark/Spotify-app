import { useEffect, useRef, useState } from 'react';
import throttle from 'lodash/throttle';

/**
 * infinite scrolling functionality with throttling
 * @param {function} fetchMoreData to load more items on a page
 * @returns
 */
const useInfiniteScroll = (fetchMoreData) => {
  const containerRef = useRef(null);
  const [isFetching, setIsFetching] = useState(false);

  const handleScroll = () => {

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

    // Check if the user has scrolled to the bottom and is not currently fetching data
    if (scrollTop + clientHeight >= scrollHeight - 600 && !isFetching) {
      setIsFetching(true);
    }
  };

  // Use lodash throttle to throttle the handleScroll function
  const throttledHandleScroll = throttle(handleScroll, 2000); // Adjust the throttle time as needed (e.g., XXXXms)

  useEffect(() => {
    // Add event listener for scrolling
    const containerNode = containerRef.current;
    containerNode.addEventListener('scroll', throttledHandleScroll);

    return () => {
      // Cleanup: remove event listener when component unmounts
      containerNode.removeEventListener('scroll', throttledHandleScroll);
    };
  }, [throttledHandleScroll]);

  useEffect(() => {
    // Call the fetchMoreData function when isFetching is true
    if (isFetching) {
      fetchMoreData();
      setIsFetching(false); // Reset isFetching once the fetchMoreData function is called
    }
  }, [isFetching, fetchMoreData]);

  return containerRef;
};

export default useInfiniteScroll;
