import { useMediaQuery } from 'react-responsive';

const useNumOfItems = () => {
  const isX2LGlitch = useMediaQuery({
    minWidth: '1536px',
    maxWidth: '1680px',
  });

  const isXXXl = useMediaQuery({
    minWidth: '1681px',
    maxWidth: '3840px',
  });

  const isXXl = useMediaQuery({
    minWidth: '1280px',
    maxWidth: '1680px',
  });

  const isXl = useMediaQuery({
    minWidth: '1024px',
    maxWidth: '1280px',
  });
  const isLg = useMediaQuery({
    minWidth: '768px',
    maxWidth: '1024px',
  });
  const isMd = useMediaQuery({
    minWidth: '640px',
    maxWidth: '767px',
  });
  const isSm = useMediaQuery({
    minWidth: '525px',
    maxWidth: '690px',
  });

  let numOfItems = 7; // Default number of items

  switch (true) {
    case isXXXl:
    case isX2LGlitch:
      numOfItems = 7;
      break;
    case isXXl:
      numOfItems = 6;
      break;
    case isXl:
      numOfItems = 5;
      break;
    case isLg:
      numOfItems = 3;
      break;
    case isMd:
      numOfItems = 4;
      break;
    case isSm:
      numOfItems = 3;
      break;
    default:
      numOfItems = 2; // default minimum number of items 2
      break;
  }

  return numOfItems;
}

export default useNumOfItems;