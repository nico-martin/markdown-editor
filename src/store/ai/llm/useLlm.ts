import React from 'react';

import { context } from './llmContext';

const useLlm = () => React.useContext(context);

export default useLlm;
