import { useEffect, useState, useRef } from 'react';
import { debounce } from 'lodash';

/**
 * Scroll to top button functionality
 */
const useScrollToTop = () => {
  const scrollableSectionRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const scrollableSection = scrollableSectionRef.current;

    // Debounce the handleScroll function with a delay of 500 milliseconds
    const debouncedHandleScroll = debounce(() => {
      const position = scrollableSection.scrollTop;
      setScrollPosition(position);
    }, 500);

    scrollableSection.addEventListener('scroll', debouncedHandleScroll);
    setScrollPosition(scrollableSection.scrollTop); // Initialize scrollPosition
    return () => {
      scrollableSection.removeEventListener('scroll', debouncedHandleScroll);
    };
  }, []);

  const scrollToTop = () => {
    scrollableSectionRef.current.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const showButton = scrollPosition > 1500;
  return {
    scrollableSectionRef,
    showButton,
    scrollToTop,
  };
};

export default useScrollToTop;
