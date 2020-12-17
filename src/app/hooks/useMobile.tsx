import React from 'react';
import useWindowSize from './useWindowSize';

const styles = getComputedStyle(document.documentElement);
const BP = parseInt(styles.getPropertyValue('--bp-mobile'));

const useMobile = () => {
  const { width, height } = useWindowSize();
  const isMobile = React.useMemo(() => width < BP, [width]);
  const landscape = React.useMemo(() => width >= height, [width, height]);

  return { isMobile, landscape, portrait: !landscape };
};

export default useMobile;
