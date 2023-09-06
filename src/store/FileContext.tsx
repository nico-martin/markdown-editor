import { useMatomo } from '@datapunt/matomo-tracker-react';
import React from 'react';

import { getFileFromHandle } from '@utils/fileAccess.ts';

import { EMPTY_FILE } from '@store/constants.ts';
import { settingsDB } from '@store/idb.ts';
import { File } from '@store/types';

type ActiveFileIndex = 'new' | number;

interface FileContext {
  init: boolean;
  activeFileIndex: ActiveFileIndex;
  files: Array<File>;
  activeFile: File;
  updateActiveFile: (updatedFile: Partial<File>) => void;
  createNewFile: (file?: Partial<File>) => void;
  setActiveFileIndex: (index: ActiveFileIndex) => void;
  closeFileByIndex: (index: number) => void;
}

const fileContext = React.createContext<FileContext>({
  init: false,
  activeFileIndex: null,
  files: [],
  activeFile: null,
  updateActiveFile: () => {},
  createNewFile: () => {},
  setActiveFileIndex: () => {},
  closeFileByIndex: () => {},
});

export const FileContextProvider: React.FC<{
  children: React.ReactElement | Array<React.ReactElement>;
}> = ({ children }) => {
  const { trackEvent } = useMatomo();
  const [init, setInit] = React.useState<boolean>(false);
  const [activeFileIndex, setActiveFileIndex] =
    React.useState<ActiveFileIndex>('new');
  const [files, setFiles] = React.useState<Array<File>>([]);

  const setFromDB = async () => {
    const fileHandles = await settingsDB.get('files');
    if (fileHandles) {
      setFiles(
        fileHandles.map((handle: FileSystemFileHandle) => ({
          ...EMPTY_FILE,
          handle,
          title: handle.name,
          handleLoaded: false,
        }))
      );
    }
  };

  React.useEffect(() => {
    setFromDB().finally(() => setInit(true));
  }, []);

  React.useEffect(() => {
    if ('launchQueue' in window) {
      window.launchQueue.setConsumer(async (launchParams) => {
        if (launchParams.files.length) {
          const fileHandle = launchParams.files[0];
          const file = await getFileFromHandle(fileHandle);
          trackEvent({ category: 'file-action', action: 'create-from-queue' });
          createNewFile(file);
        }
      });
    }
  }, []);

  React.useEffect(() => {
    if (init) {
      settingsDB.set('activeFileIndex', activeFileIndex);
      settingsDB.set(
        'files',
        files.map(({ handle }) => handle).filter((handle) => !!handle)
      );
    }
  }, [activeFileIndex, files]);

  const updateActiveFile = (updatedFile: Partial<File>) =>
    setFiles((files) =>
      files.map((file, index) =>
        index === activeFileIndex
          ? {
              ...file,
              ...updatedFile,
            }
          : file
      )
    );

  const activeFile: File = React.useMemo(() => {
    if (activeFileIndex === 'new') {
      return EMPTY_FILE;
    }
    return files[activeFileIndex] || EMPTY_FILE;
  }, [files, activeFileIndex]);

  const createNewFile = async (newFilePartial: Partial<File> = {}) => {
    const newFile: File = { ...EMPTY_FILE, ...newFilePartial };
    const fileExistsIndex = !newFile.handle
      ? files.findIndex(
          (file) =>
            file.handle === newFile.handle && file.content === newFile.content
        )
      : (
          await Promise.all(
            files.map((file) =>
              !file.handle ? false : file.handle.isSameEntry(newFile.handle)
            )
          )
        ).findIndex((same) => same);
    const fileExists = fileExistsIndex !== -1;

    setFiles(fileExists ? files : [...files, newFile]);
    setActiveFileIndex(fileExists ? fileExistsIndex : files.length);
  };

  const closeFileByIndex = (index: number) => {
    if (
      files[index].content !== files[index].savedContent &&
      !confirm(
        'Are you sure you want to close this file? Unsaved changes will be lost.'
      )
    ) {
      return;
    }
    setFiles((files) => files.filter((_file, i) => index !== i));
    setActiveFileIndex((activeFileIndex) =>
      index === activeFileIndex
        ? 'new'
        : Number(activeFileIndex) > index
        ? Number(activeFileIndex) - 1
        : activeFileIndex
    );
  };

  return (
    <fileContext.Provider
      value={{
        init,
        activeFileIndex,
        files,
        updateActiveFile,
        activeFile,
        createNewFile,
        setActiveFileIndex: (index) => setActiveFileIndex(index),
        closeFileByIndex,
      }}
    >
      {children}
    </fileContext.Provider>
  );
};

export const useFileContext = (): FileContext =>
  React.useContext<FileContext>(fileContext);
