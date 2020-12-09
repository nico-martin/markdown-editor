import React from 'react';

import './Loader.css';

const Loader = ({ className = '' }: { className?: string }) => (
  <div className={`loader ${className}`} />
);

export default Loader;
