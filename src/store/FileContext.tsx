import { useMatomo } from '@datapunt/matomo-tracker-react';
import React from 'react';

import { BROWSER_SUPPORT } from '@utils/constants.ts';
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

let windowInit = false;

export const FileContextProvider: React.FC<{
  children: React.ReactElement | Array<React.ReactElement>;
}> = ({ children }) => {
  const { trackEvent } = useMatomo();
  const [init, setInit] = React.useState<boolean>(false);

  const [files, setFiles] = React.useState<{
    fileList: Array<File>;
    activeFileIndex: ActiveFileIndex;
  }>({ fileList: [], activeFileIndex: 'new' });

  const setFromDB = async () => {
    const fileHandles = await settingsDB.get('files');
    if (fileHandles) {
      setFiles((files) => ({
        ...files,
        fileList: fileHandles.map((handle: FileSystemFileHandle) => ({
          ...EMPTY_FILE,
          handle,
          title: handle.name,
          handleLoaded: false,
        })),
      }));
    }
  };

  React.useEffect(() => {
    setFromDB().finally(() => {
      setInit(true);
      windowInit = true;
      if (window.location.hash === '#new-file') {
        createNewFile();
      }
    });
  }, []);

  const waitForInit = (): Promise<void> =>
    new Promise((resolve) => {
      const interval = window.setInterval(() => {
        if (windowInit) {
          clearInterval(interval);
          resolve();
        }
      }, 10);
    });

  React.useEffect(() => {
    if ('launchQueue' in window) {
      window.launchQueue.setConsumer(async (launchParams) => {
        if (launchParams.files.length) {
          await waitForInit();
          const fileHandle = launchParams.files[0];
          const file = await getFileFromHandle(fileHandle);
          trackEvent({ category: 'file-action', action: 'create-from-queue' });
          await createNewFile(file);
        }
      });
    }
  }, []);

  React.useEffect(() => {
    const changedFilesCount: number = files.fileList.filter(
      ({ content, savedContent }) => content !== savedContent
    ).length;

    if (changedFilesCount === 0) {
      BROWSER_SUPPORT.badging && navigator.clearAppBadge();
    } else {
      BROWSER_SUPPORT.badging && navigator.setAppBadge(changedFilesCount);
    }

    if (init) {
      settingsDB.set('activeFileIndex', files.activeFileIndex);
      settingsDB.set(
        'files',
        files.fileList.map(({ handle }) => handle).filter((handle) => !!handle)
      );
    }

    return () => {
      BROWSER_SUPPORT.badging && navigator.clearAppBadge();
    };
  }, [files]);

  const updateActiveFile = (updatedFile: Partial<File>) =>
    setFiles((files) => ({
      ...files,
      fileList: files.fileList.map((file, index) =>
        index === files.activeFileIndex
          ? {
              ...file,
              ...updatedFile,
            }
          : file
      ),
    }));

  const activeFile: File = React.useMemo(() => {
    if (files.activeFileIndex === 'new') {
      return EMPTY_FILE;
    }
    return files.fileList[files.activeFileIndex] || EMPTY_FILE;
  }, [files]);

  const createNewFile = async (newFilePartial: Partial<File> = {}) => {
    const newFile: File = { ...EMPTY_FILE, ...newFilePartial };
    setFiles(({ fileList }) => {
      const fileExistsIndex = !newFile.handle
        ? -1
        : fileList.findIndex((file) =>
            !file.handle
              ? false
              : // todo: this is not good. Should be isSameEntry(), but this is async.
                file.handle.kind === newFile.handle.kind &&
                file.handle.name === newFile.handle.name
          );

      const fileExists = fileExistsIndex !== -1;
      const newFileList = fileExists ? fileList : [...fileList, newFile];

      return {
        fileList: newFileList,
        activeFileIndex: fileExists ? fileExistsIndex : newFileList.length - 1,
      };
    });
  };

  const closeFileByIndex = (index: number) => {
    if (
      files.fileList[index].content !== files.fileList[index].savedContent &&
      !confirm(
        'Are you sure you want to close this file? Unsaved changes will be lost.'
      )
    ) {
      return;
    }
    setFiles((files) => ({
      ...files,
      fileList: files.fileList.filter((_file, i) => index !== i),
      activeFileIndex:
        index === files.activeFileIndex
          ? 'new'
          : Number(files.activeFileIndex) > index
          ? Number(files.activeFileIndex) - 1
          : files.activeFileIndex,
    }));
  };

  return (
    <fileContext.Provider
      value={{
        init,
        activeFileIndex: files.activeFileIndex,
        files: files.fileList,
        updateActiveFile,
        activeFile,
        createNewFile,
        setActiveFileIndex: (index) =>
          setFiles((files) => ({ ...files, activeFileIndex: index })),
        closeFileByIndex,
      }}
    >
      {children}
    </fileContext.Provider>
  );
};

export const useFileContext = (): FileContext =>
  React.useContext<FileContext>(fileContext);
