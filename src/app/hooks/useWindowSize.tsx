import React from 'react';

const useWindowSize = (): { width: number; height: number } => {
  const [windowSize, setWindowSize] = React.useState({
    width: null,
    height: null,
  });

  React.useEffect(() => {
    const handleResize = () =>
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    window.setTimeout(() => handleResize(), 1000);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return windowSize;
};

export default useWindowSize;
