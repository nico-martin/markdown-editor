import React from 'react';

import { context } from './aiContext.ts';

const useAiSettings = () => React.useContext(context);

export default useAiSettings;
