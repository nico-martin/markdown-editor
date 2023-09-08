interface LaunchParams {
  readonly files: Array<FileSystemFileHandle>;
  readonly targetURL: string;
}

export interface LaunchQueue {
  setConsumer: (callback: (launchParams: LaunchParams) => void) => void;
}

declare global {
  interface Window {
    launchQueue: LaunchQueue;
  }
}
