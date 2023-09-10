import { File } from '@store/types';

export const openFileFromSystem = async (): Promise<Partial<File>> => {
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

export const getFileFromHandle = async (
  fileHandle: FileSystemFileHandle
): Promise<Partial<File>> => {
  const verify = await verifyPermission(fileHandle, false);
  if (!verify) {
    alert('Permission denied');
    return;
  }

  try {
    const file = await fileHandle.getFile();
    const content = await file.text();
    return {
      title: file.name,
      content,
      savedContent: content,
      handle: fileHandle,
      handleLoaded: true,
    };
  } catch (e) {
    alert('The file could not be read. Please make sure that it still exists.');
    return;
  }
};

export const saveFileToSystem = async (
  toSave: File
): Promise<Partial<File>> => {
  let handle = toSave.handle;
  if (!handle) {
    // if no handle exists it must be a new file. So we create a new handle
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

async function verifyPermission(
  fileHandle: FileSystemFileHandle,
  withWrite: boolean
) {
  const opts: FileSystemHandlePermissionDescriptor = withWrite
    ? {
        mode: 'readwrite',
      }
    : {};

  const permission = await fileHandle.queryPermission(opts);
  if (permission === 'granted') {
    return true;
  }

  const request = await fileHandle.requestPermission(opts);
  return request === 'granted';
}
