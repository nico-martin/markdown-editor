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
  readonly changedHandle: FileSystemFileHandle;
  readonly relativePathComponents: ReadonlyArray<string>;
  readonly type: FileSystemChangeType;
  readonly relativePathMovedFrom?: ReadonlyArray<string>;
}

class FileSystemObserver {
  constructor(callback: FileSystemObserverCallback);
  observe(
    handle: FileSystemFileHandle,
    options?: FileSystemObserverObserveOptions
  ): Promise<void>;
  unobserve(handle: FileSystemFileHandle): void;
  disconnect(): void;
}
