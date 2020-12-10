import { ActiveFile, State } from './types';

import createStore, { Store } from 'unistore';
import devtools from 'unistore/devtools';

import { isDev } from '@utils/helpers';
import { filesDB } from '@store/idb';

const initialState: State = {
  offline: false,
  recentFiles: {},
  activeFile: {
    title: '',
    path: '',
    content: '',
  },
};

export const actions = (store: Store<State>) => ({
  setOffline: (state, offline: boolean) => ({ offline }),
  loadRecentFiles: async () => await filesDB.getAll(),
  setActiveFile: ({ activeFile }, newActiveDay: Partial<ActiveFile>) => ({
    activeFile: {
      ...activeFile,
      ...newActiveDay,
    },
  }),
});

export const store = isDev
  ? createStore(initialState)
  : devtools(createStore(initialState));
