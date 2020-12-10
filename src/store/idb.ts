import { openDB, DBSchema } from 'idb';

const dbName = 'mdpwa';

interface PWAdventDB extends DBSchema {
  files: {
    key: string;
    value: any;
  };
  settings: {
    key: string;
    value: any;
  };
}

const dbPromise = openDB<PWAdventDB>(dbName, 2, {
  upgrade(db, oldVersion) {
    if (oldVersion < 1) {
      db.createObjectStore('files');
      db.createObjectStore('settings');
    }
  },
});

export const filesDB = {
  get: async (key: string) => (await dbPromise).get('files', key),
  getAll: async () => (await dbPromise).getAll('files'),
  set: async (key: string, val: any) =>
    (await dbPromise).put('files', val, key),
  delete: async (key: string) => (await dbPromise).delete('files', key),
};

export const settingsDB = {
  get: async (key: string) => (await dbPromise).get('settings', key),
  set: async (key: string, val: any) =>
    (await dbPromise).put('settings', val, key),
  delete: async (key: string) => (await dbPromise).delete('settings', key),
};
