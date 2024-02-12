/*
export const featureCheck: boolean =
  'showOpenFilePicker' in window &&
  'showSaveFilePicker' in window &&
  'showDirectoryPicker' in window;

export const fontAccessAPI: boolean = 'queryLocalFonts' in window;
*/
import { AUDIO_SAMPLING_RATE } from '@utils/constants.ts';

export const formatBytes = (bytes: number, decimals: number = 2): string => {
  if (!+bytes) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

export const getFirstXChars = (str: string, x: number): string => {
  return str.slice(0, x);
};

export const removeBracketsAndWordsInside = (str: string): string => {
  return str.replace(/ *\([^)]*\) */g, '');
};

export const getLastElementOfPath = (path: string): string => {
  return path.split('/').pop();
};

const padTime = (time: number): string => String(time).padStart(2, '0');

export const formatAudioTimestamp = (time: number): string => {
  const hours = (time / (60 * 60)) | 0;
  time -= hours * (60 * 60);
  const minutes = (time / 60) | 0;
  time -= minutes * 60;
  const seconds = time | 0;
  return `${hours ? padTime(hours) + ':' : ''}${padTime(minutes)}:${padTime(
    seconds
  )}`;
};

export const getAudioFromRecording = async (
  data: Blob
): Promise<{ buffer: AudioBuffer; url: string; mimeType: string }> =>
  new Promise((resolve) => {
    const blobUrl = URL.createObjectURL(data);
    const fileReader = new FileReader();
    fileReader.onloadend = async () => {
      const audioCTX = new AudioContext({
        sampleRate: AUDIO_SAMPLING_RATE,
      });
      const arrayBuffer = fileReader.result as ArrayBuffer;
      const decoded = await audioCTX.decodeAudioData(arrayBuffer);
      resolve({
        buffer: decoded,
        url: blobUrl,
        mimeType: data.type,
      });
    };
    fileReader.readAsArrayBuffer(data);
  });

export const getFloat32FromAudioBuffer = (
  buffer: AudioBuffer
): Float32Array => {
  let audio;
  if (buffer.numberOfChannels === 2) {
    const SCALING_FACTOR = Math.sqrt(2);
    const left = buffer.getChannelData(0);
    const right = buffer.getChannelData(1);

    audio = new Float32Array(left.length);
    for (let i = 0; i < buffer.length; ++i) {
      audio[i] = (SCALING_FACTOR * (left[i] + right[i])) / 2;
    }
  } else {
    // If the audio is not stereo, we can just use the first channel:
    audio = buffer.getChannelData(0);
  }
  return audio;
};
