type FileSystemObserverCallback = (
  records: FileSystemChangeRecord[],
  observer: FileSystemObserver
) => void;

interface FileSystemObserverObserveOptions {
  recursive?: boolean;
}

enum FileSystemChangeType {
  appeared = 'appeared',
  disappeared = 'disappeared',
  modified = 'modified',
  moved = 'moved',
  unknown = 'unknown',
  errored = 'errored',
}

interface FileSystemChangeRecord {
  readonly root: FileSystemHandle;
  readonly changedHandle: FileSystemHandle;
  readonly relativePathComponents: ReadonlyArray<string>;
  readonly type: FileSystemChangeType;
  readonly relativePathMovedFrom?: ReadonlyArray<string>;
}

class FileSystemObserver {
  constructor(callback: FileSystemObserverCallback);
  observe(
    handle: FileSystemHandle,
    options?: FileSystemObserverObserveOptions
  ): Promise<void>;
  unobserve(handle: FileSystemHandle): void;
  disconnect(): void;
}
