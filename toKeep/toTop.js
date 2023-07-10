import { useEffect, useState, useRef } from 'react';

// A GO TO TOP BUTTON COMPONENT (NOT IN USE)

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

  const shouldRenderButton = scrollPosition > 0;

  return {
    scrollableSectionRef,
    shouldRenderButton,
    scrollToTop,
  };
};

const Scroll = ({ children }) => {
  const { scrollableSectionRef, shouldRenderButton, scrollToTop } =
    useScrollToTop();

  return (
    <span
      ref={scrollableSectionRef}
      className="bg-black overflow-y-scroll h-screen scrollbar-hide py-4 px-5 xs:px-8 pt-2 pb-24"
    >
      {children}
      {shouldRenderButton && (
        <button
          className="fixed bottom-24 right-4 bg-white p-2 rounded"
          onClick={scrollToTop}
        >
          Go to Top
        </button>
      )}
    </span>
  );
};

export default Scroll;
