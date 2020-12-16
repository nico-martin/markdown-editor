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
  handleLoaded: true,
};

const initialState: State = {
  offline: false,
  files: [],
  activeFileIndex: 'new',
  editorView: EDITOR_VIEWS.SPLIT,
};

export const actions = (store: Store<State>) => ({
  setOffline: (state, offline: boolean) => ({ offline }),
  setFiles: (state, files: Array<File>, index = 0) => ({
    files,
    activeFileIndex: index,
  }),
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
  closeFileByIndex: ({ files }, index) =>
    files[index].content !== files[index].savedContent &&
    !confirm(
      'Are you sure you want to close this file? Unsaved changes will be lost.'
    )
      ? {}
      : {
          files: files.filter((file, i) => index !== i),
          activeFileIndex: 'new',
        },
  setActiveFileIndex: async ({ files }, activeFileIndex) => {
    const activeFile = files[activeFileIndex];
    if (!activeFile) {
      return {};
    }

    return {
      activeFileIndex,
    };
  },
  createNewFile: ({ files }, newFile: Partial<File> = {}) => ({
    files: [...files, { ...defaultFile, ...newFile }],
    activeFileIndex: files.length,
  }),
  openFileSelect: state => ({
    activeFileIndex: 'new',
  }),
  setEditorView: (state, view) =>
    Object.values(EDITOR_VIEWS).indexOf(view) !== -1
      ? { editorView: view }
      : {},
});

export const store = isDev
  ? createStore(initialState)
  : devtools(createStore(initialState));
