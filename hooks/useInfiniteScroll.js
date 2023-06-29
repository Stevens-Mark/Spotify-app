import { useEffect, useRef } from 'react';

/**
 * infinite scrolling functionality
 * @param {function} fetchMoreData to laod more items on a page
 * @returns 
 */
const useInfiniteScroll = (fetchMoreData) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

      // Check if the user has scrolled to the bottom
      if (scrollTop + clientHeight >= scrollHeight) {
        // Fetch more data
        fetchMoreData();
      }
    };

    // Add event listener for scrolling
    const containerNode = containerRef.current;
    containerNode.addEventListener('scroll', handleScroll);

    return () => {
      // Cleanup: remove event listener when component unmounts
      containerNode.removeEventListener('scroll', handleScroll);
    };
  }, [fetchMoreData]);

  return containerRef;
};

export default useInfiniteScroll;
