import React from 'react';

import { context } from './translationsContext.ts';

const useTranslations = () => React.useContext(context);

export default useTranslations;
