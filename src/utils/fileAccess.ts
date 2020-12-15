import { File } from '@store/types';

export const openFileFromSystem = async (): Promise<Partial<File>> => {
  // @ts-ignore
  const [handle] = await window.showOpenFilePicker({
    types: [
      {
        description: 'Markdown Files',
        accept: {
          'text/markdown': ['.md'],
        },
      },
    ],
  });

  return await getFileFromHandle(handle);
};

export const getFileFromHandle = async (fileHandle): Promise<Partial<File>> => {
  if ((await verifyPermission(fileHandle, true)) === false) {
    alert('Permission denied');
    return;
  }

  const file = await fileHandle.getFile();
  const content = await file.text();
  return {
    title: file.name,
    content,
    savedContent: content,
    handle: fileHandle,
    handleLoaded: true,
  };
};

export const saveFileToSystem = async (
  toSave: File
): Promise<Partial<File>> => {
  let handle = toSave.handle;
  if (!handle) {
    // if no handle exists it must be a new file. So we create a new handle
    // @ts-ignore
    handle = await window.showSaveFilePicker({
      types: [
        {
          description: 'Markdown Files',
          accept: {
            'text/markdown': ['.md'],
          },
        },
      ],
    });
  }

  const writable = await handle.createWritable();
  await writable.write(toSave.content);
  const file = await handle.getFile();
  await writable.close();

  return {
    title: file.name,
    savedContent: toSave.content,
    handle,
  };
};

async function verifyPermission(fileHandle, withWrite) {
  const opts = withWrite
    ? {
        writable: true,
        mode: 'readwrite',
      }
    : {};

  // Check if we already have permission, if so, return true.
  if ((await fileHandle.queryPermission(opts)) === 'granted') {
    return true;
  }
  // Request permission to the file, if the user grants permission, return true.
  if ((await fileHandle.requestPermission(opts)) === 'granted') {
    return true;
  }
  // The user did nt grant permission, return false.
  return false;
}
