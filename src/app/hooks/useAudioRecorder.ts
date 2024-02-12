import React from 'react';

import { webmFixDuration } from '@utils/blobFix.ts';

const getMimeType = () => {
  const types = [
    'audio/webm',
    'audio/mp4',
    'audio/ogg',
    'audio/wav',
    'audio/aac',
  ];
  for (let i = 0; i < types.length; i++) {
    if (MediaRecorder.isTypeSupported(types[i])) {
      return types[i];
    }
  }
  return undefined;
};

const useAudioRecorder = (): {
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  recording: boolean;
  duration: number;
  recordedBlob: Blob;
  clear: () => void;
} => {
  const [recording, setRecording] = React.useState<boolean>(false);
  const [duration, setDuration] = React.useState<number>(0);
  const [recordedBlob, setRecordedBlob] = React.useState<Blob>(null);

  const streamRef = React.useRef<MediaStream>(null);
  const mediaRecorderRef = React.useRef<MediaRecorder>(null);
  const chunksRef = React.useRef<Blob[]>([]);

  const clear = () => {
    setRecordedBlob(null);
  };

  const startRecording = async () => {
    // Reset recording (if any)
    setRecordedBlob(null);

    const startTime: number = Date.now();
    if (!streamRef.current) {
      streamRef.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
    }

    const mimeType = getMimeType();
    const mediaRecorder = new MediaRecorder(streamRef.current, {
      mimeType,
    });

    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.addEventListener('dataavailable', async (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
      if (mediaRecorder.state === 'inactive') {
        const duration = Date.now() - startTime;

        // Received a stop event
        let blob = new Blob(chunksRef.current, { type: mimeType });

        if (mimeType === 'audio/webm') {
          blob = await webmFixDuration(blob, duration, blob.type);
        }

        setRecordedBlob(blob);

        chunksRef.current = [];
      }
    });
    mediaRecorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === 'recording'
    ) {
      mediaRecorderRef.current.stop(); // set state to inactive
      setDuration(0);
      setRecording(false);
    }
  };

  React.useEffect(() => {
    const stream: MediaStream | null = null;

    if (recording) {
      const timer = setInterval(() => {
        setDuration((prevDuration) => prevDuration + 1);
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [recording]);

  return {
    startRecording,
    stopRecording,
    recording,
    duration,
    recordedBlob,
    clear,
  };
};

export default useAudioRecorder;
