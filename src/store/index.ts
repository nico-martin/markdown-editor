import { File, State } from './types';

import createStore, { Store } from 'unistore';
import devtools from 'unistore/devtools';

import { isDev } from '@utils/helpers';

export const defaultFile = {
  title: 'untitled',
  content: '',
  savedContent: '',
  handle: null,
  saved: false,
};

const initialState: State = {
  offline: false,
  files: [defaultFile],
  activeFileIndex: 0,
  editMode: null,
};

export const actions = (store: Store<State>) => ({
  setOffline: (state, offline: boolean) => ({ offline }),
  setFiles: (state, files, index = 0) => ({ files, activeFileIndex: index }),
  updateActiveFile: (state, updatedFile: Partial<File>) => ({
    files: state.files.map((file, index) =>
      index === state.activeFileIndex
        ? {
            ...state.files[index],
            ...updatedFile,
          }
        : file
    ),
  }),
  deleteFileByIndex: ({ files, activeFileIndex }, index) => ({
    files: files.filter((file, i) => index !== i),
    activeFileIndex:
      activeFileIndex === index
        ? index - 1
        : activeFileIndex > index
        ? activeFileIndex - 1
        : activeFileIndex,
  }),
  setActiveFileIndex: (state, index) => ({ activeFileIndex: index }),
  createNewFile: ({ files }, newFile: Partial<File> = {}) => ({
    files: [...files, { ...defaultFile, ...newFile }],
    activeFileIndex: files.length,
  }),
  setEditMode: (state, editMode) => ({ editMode }),
});

export const store = isDev
  ? createStore(initialState)
  : devtools(createStore(initialState));
