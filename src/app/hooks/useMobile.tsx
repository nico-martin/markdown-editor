import React from 'react';
import useWindowSize from './useWindowSize';

const styles = getComputedStyle(document.documentElement);
const BP = parseInt(styles.getPropertyValue('--bp-mobile'));

const useMobile = () => {
  const { width } = useWindowSize();
  const isMobile = React.useMemo(() => width < BP, [width]);
  return { isMobile };
};

export default useMobile;
