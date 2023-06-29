import { useEffect, useState, useRef } from 'react';

/**
 * Scroll to top button functionality
 */
const useScrollToTop = () => {
  const scrollableSectionRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const scrollableSection = scrollableSectionRef.current;

    const handleScroll = () => {
      const position = scrollableSection.scrollTop;
      setScrollPosition(position);
    };

    scrollableSection.addEventListener('scroll', handleScroll);
    setScrollPosition(scrollableSection.scrollTop); // Initialize scrollPosition
    return () => {
      scrollableSection.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    scrollableSectionRef.current.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const showButton = scrollPosition > 2000;
  return {
    scrollableSectionRef,
    showButton,
    scrollToTop,
  };
};

export default useScrollToTop;
