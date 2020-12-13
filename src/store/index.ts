import { File, State } from './types';

import createStore, { Store } from 'unistore';
import devtools from 'unistore/devtools';

import { isDev } from '@utils/helpers';
import { EDITOR_VIEWS } from '@utils/constants';

export const defaultFile = {
  title: 'untitled',
  content: '',
  savedContent: '',
  handle: null,
};

const initialState: State = {
  offline: false,
  files: [defaultFile],
  activeFileIndex: 0,
  editorView: EDITOR_VIEWS.SPLIT,
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
  setEditorView: (state, view) =>
    Object.values(EDITOR_VIEWS).indexOf(view) !== -1
      ? { editorView: view }
      : {},
});

export const store = isDev
  ? createStore(initialState)
  : devtools(createStore(initialState));
