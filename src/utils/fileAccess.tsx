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

  const file = await handle.getFile();

  const content = await file.text();

  return {
    title: file.name,
    content,
    savedContent: content,
    handle,
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
    saved: true,
  };
};
