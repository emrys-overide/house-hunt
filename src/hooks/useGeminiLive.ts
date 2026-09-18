import { useState, useRef, useCallback, useEffect } from 'react';
import { floatTo16BitPCM, arrayBufferToBase64, base64ToFloat32Array } from '../utils/audioUtils.ts';

export interface LiveTranscriptItem {
  id: string;
  sender: 'user' | 'model';
  text: string;
  timestamp: string;
}

export function useGeminiLive() {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isModelSpeaking, setIsModelSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcripts, setTranscripts] = useState<LiveTranscriptItem[]>([]);
  const [inputVolume, setInputVolume] = useState<number>(0);
  const [outputVolume, setOutputVolume] = useState<number>(0);

  const wsRef = useRef<WebSocket | null>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);

  // Playback queue & scheduling
  const nextStartTimeRef = useRef<number>(0);
  const activeSourcesRef = useRef<AudioBufferSourceNode[]>([]);
  const isMutedRef = useRef(false);
  isMutedRef.current = isMuted;

  // Clear queued audio when model is interrupted
  const stopAllActiveAudio = useCallback(() => {
    activeSourcesRef.current.forEach((source) => {
      try {
        source.stop();
      } catch (e) {
        // ignore already stopped sources
      }
    });
    activeSourcesRef.current = [];
    if (outputAudioCtxRef.current) {
      nextStartTimeRef.current = outputAudioCtxRef.current.currentTime;
    }
    setIsModelSpeaking(false);
    setOutputVolume(0);
  }, []);

  const disconnect = useCallback(() => {
    stopAllActiveAudio();

    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (sourceNodeRef.current) {
      sourceNodeRef.current.disconnect();
      sourceNodeRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (inputAudioCtxRef.current) {
      inputAudioCtxRef.current.close().catch(() => {});
      inputAudioCtxRef.current = null;
    }
    if (outputAudioCtxRef.current) {
      outputAudioCtxRef.current.close().catch(() => {});
      outputAudioCtxRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    setIsConnected(false);
    setIsConnecting(false);
    setIsModelSpeaking(false);
    setInputVolume(0);
    setOutputVolume(0);
  }, [stopAllActiveAudio]);

  const connect = useCallback(async () => {
    setError(null);
    setIsConnecting(true);

    try {
      // 1. Request microphone stream
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      mediaStreamRef.current = stream;

      // 2. Setup WebSocket to backend bridge
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/api/live`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      // 3. Setup 24kHz AudioContext for Gemini Live output
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const outputAudioCtx = new AudioCtx({ sampleRate: 24000 });
      outputAudioCtxRef.current = outputAudioCtx;
      nextStartTimeRef.current = outputAudioCtx.currentTime;

      // 4. Setup 16kHz AudioContext for microphone input
      const inputAudioCtx = new AudioCtx({ sampleRate: 16000 });
      inputAudioCtxRef.current = inputAudioCtx;
      const source = inputAudioCtx.createMediaStreamSource(stream);
      sourceNodeRef.current = source;

      // ScriptProcessor for 16kHz audio frames (4096 samples buffer)
      const processor = inputAudioCtx.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      processor.onaudioprocess = (e) => {
        if (isMutedRef.current || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
          return;
        }
        const inputData = e.inputBuffer.getChannelData(0);

        // Compute volume for visualizer
        let sum = 0;
        for (let i = 0; i < inputData.length; i++) {
          sum += inputData[i] * inputData[i];
        }
        const rms = Math.sqrt(sum / inputData.length);
        setInputVolume(Math.min(1, rms * 5));

        // Convert to 16-bit PCM little-endian
        const pcmBuffer = floatTo16BitPCM(inputData);
        const base64Audio = arrayBufferToBase64(pcmBuffer);

        wsRef.current.send(
          JSON.stringify({
            audio: base64Audio,
          })
        );
      };

      source.connect(processor);
      processor.connect(inputAudioCtx.destination);

      ws.onopen = () => {
        setIsConnected(true);
        setIsConnecting(false);
        setTranscripts((prev) => [
          ...prev,
          {
            id: `sys-${Date.now()}`,
            sender: 'model',
            text: 'Habari! I am SakaKeja Live Voice Agent (powered by gemini-3.8-live). Ask me anything about Nairobi rentals, water schedules, or broker fees!',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.error) {
            setError(data.error);
            return;
          }

          if (data.interrupted) {
            stopAllActiveAudio();
            return;
          }

          if (data.audio && outputAudioCtxRef.current) {
            setIsModelSpeaking(true);
            const float32Pcm = base64ToFloat32Array(data.audio);

            // Compute volume for visualizer
            let sum = 0;
            for (let i = 0; i < float32Pcm.length; i++) {
              sum += float32Pcm[i] * float32Pcm[i];
            }
            const rms = Math.sqrt(sum / float32Pcm.length);
            setOutputVolume(Math.min(1, rms * 4));

            const audioBuffer = outputAudioCtxRef.current.createBuffer(
              1,
              float32Pcm.length,
              24000
            );
            audioBuffer.getChannelData(0).set(float32Pcm);

            const sourceNode = outputAudioCtxRef.current.createBufferSource();
            sourceNode.buffer = audioBuffer;
            sourceNode.connect(outputAudioCtxRef.current.destination);

            const currentTime = outputAudioCtxRef.current.currentTime;
            const startTime = Math.max(currentTime, nextStartTimeRef.current);
            sourceNode.start(startTime);
            nextStartTimeRef.current = startTime + audioBuffer.duration;

            activeSourcesRef.current.push(sourceNode);
            sourceNode.onended = () => {
              activeSourcesRef.current = activeSourcesRef.current.filter((s) => s !== sourceNode);
              if (activeSourcesRef.current.length === 0) {
                setIsModelSpeaking(false);
                setOutputVolume(0);
              }
            };
          }

          if (data.text) {
            setTranscripts((prev) => [
              ...prev,
              {
                id: `model-${Date.now()}`,
                sender: 'model',
                text: data.text,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              },
            ]);
          }
        } catch (err) {
          console.warn('Live ws message parse error:', err);
        }
      };

      ws.onerror = (e) => {
        console.error('Live WebSocket error', e);
        setError('Voice connection error. Ensure your microphone is allowed.');
        setIsConnecting(false);
      };

      ws.onclose = () => {
        setIsConnected(false);
        setIsConnecting(false);
      };
    } catch (err: any) {
      console.error('Failed to start Live Voice session:', err);
      setError(err?.message || 'Failed to access microphone or connect to Gemini Live.');
      setIsConnecting(false);
      disconnect();
    }
  }, [disconnect, stopAllActiveAudio]);

  const sendTextMessage = useCallback((text: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ text }));
      setTranscripts((prev) => [
        ...prev,
        {
          id: `user-${Date.now()}`,
          sender: 'user',
          text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    isConnected,
    isConnecting,
    isMuted,
    isModelSpeaking,
    error,
    transcripts,
    inputVolume,
    outputVolume,
    connect,
    disconnect,
    toggleMute,
    sendTextMessage,
    stopAllActiveAudio,
  };
}
