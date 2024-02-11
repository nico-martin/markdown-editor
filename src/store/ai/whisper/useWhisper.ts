import React from 'react';

import { context } from './whisperContext.ts';

const useWhisper = () => React.useContext(context);

export default useWhisper;
