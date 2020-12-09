import React from 'react';

import './CloseButton.css';

const CloseButton = ({
  className = '',
  onClick,
}: {
  className?: string;
  onClick: Function;
}) => (
  <button className={`close-button ${className}`} onClick={() => onClick()}>
    close
  </button>
);

export default CloseButton;
