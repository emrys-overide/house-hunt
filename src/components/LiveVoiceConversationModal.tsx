import React, { useState } from 'react';
import {
  Mic,
  MicOff,
  PhoneOff,
  Sparkles,
  Volume2,
  VolumeX,
  Radio,
  AlertCircle,
  HelpCircle,
  X,
  MessageSquare,
  RefreshCw,
} from 'lucide-react';
import { useGeminiLive } from '../hooks/useGeminiLive.ts';

interface LiveVoiceConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTopic?: string;
}

export const LiveVoiceConversationModal: React.FC<LiveVoiceConversationModalProps> = ({
  isOpen,
  onClose,
  initialTopic,
}) => {
  const {
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
  } = useGeminiLive();

  const [textPrompt, setTextPrompt] = useState('');

  if (!isOpen) return null;

  const quickQuestions = [
    'Is water rationing severe in Roysambu right now?',
    'What is the true move-in cost for a 1-bedroom in Ruaka?',
    'How do I avoid broker viewing fees in Zimmerman?',
    'Explain the difference between KPLC tokens and shared submeters',
  ];

  const handleStartCall = () => {
    connect();
  };

  const handleEndCall = () => {
    disconnect();
    onClose();
  };

  const handleSendPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textPrompt.trim() || !isConnected) return;
    sendTextMessage(textPrompt.trim());
    setTextPrompt('');
  };

  // Generate 12 visualizer bars based on activity
  const activeVolume = isModelSpeaking ? outputVolume : isConnected && !isMuted ? inputVolume : 0.05;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Radio className={`w-5 h-5 ${isConnected ? 'animate-pulse text-emerald-400' : 'text-slate-400'}`} />
              {isConnected && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white tracking-tight">SakaKeja Live Voice Agent</h3>
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  gemini-3.8-live
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Real-time low-latency voice conversation • Voice: Zephyr • Bi-directional audio
              </p>
            </div>
          </div>
          <button
            onClick={handleEndCall}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-2 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Central Voice Stage */}
          <div className="flex flex-col items-center justify-center py-6 px-4 rounded-2xl bg-gradient-to-b from-slate-800/40 to-slate-950/60 border border-slate-800 relative">
            {/* Pulsing Visualizer Circle */}
            <div className="relative my-4 flex items-center justify-center">
              <div
                className={`absolute rounded-full transition-all duration-300 ${
                  isModelSpeaking
                    ? 'bg-emerald-500/20 blur-xl'
                    : isConnected && !isMuted
                    ? 'bg-cyan-500/20 blur-lg'
                    : 'bg-slate-800/20'
                }`}
                style={{
                  width: `${140 + activeVolume * 120}px`,
                  height: `${140 + activeVolume * 120}px`,
                }}
              />
              <div
                className={`w-28 h-28 rounded-full flex flex-col items-center justify-center border transition-all duration-200 z-10 ${
                  isModelSpeaking
                    ? 'bg-emerald-600/30 border-emerald-400/80 shadow-[0_0_30px_rgba(16,185,129,0.35)]'
                    : isConnected && !isMuted
                    ? 'bg-cyan-600/20 border-cyan-400/60'
                    : 'bg-slate-800 border-slate-700'
                }`}
              >
                {isModelSpeaking ? (
                  <Volume2 className="w-10 h-10 text-emerald-300 animate-pulse" />
                ) : isConnected && isMuted ? (
                  <MicOff className="w-10 h-10 text-amber-400" />
                ) : isConnected ? (
                  <Mic className="w-10 h-10 text-cyan-300" />
                ) : (
                  <Sparkles className="w-10 h-10 text-slate-500" />
                )}
              </div>
            </div>

            {/* Audio Waveform Bars */}
            <div className="flex items-center gap-1.5 h-10 my-2">
              {[...Array(16)].map((_, i) => {
                const heightMult = Math.sin((i / 15) * Math.PI);
                const height = Math.max(6, Math.min(36, activeVolume * 70 * heightMult + (isConnected ? 8 : 4)));
                return (
                  <div
                    key={i}
                    className={`w-1 rounded-full transition-all duration-75 ${
                      isModelSpeaking
                        ? 'bg-emerald-400'
                        : isConnected && !isMuted
                        ? 'bg-cyan-400'
                        : 'bg-slate-700'
                    }`}
                    style={{ height: `${height}px` }}
                  />
                );
              })}
            </div>

            {/* Status Text */}
            <div className="text-center mt-2">
              <p className="text-sm font-semibold text-slate-200">
                {!isConnected && !isConnecting && 'Ready to connect live voice call'}
                {isConnecting && 'Establishing real-time connection to gemini-3.8-live...'}
                {isConnected && isModelSpeaking && 'SakaKeja is speaking (24kHz Live Audio)...'}
                {isConnected && !isModelSpeaking && !isMuted && 'Listening... Speak naturally in English, Swahili, or Sheng'}
                {isConnected && isMuted && 'Microphone muted'}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {isConnected ? 'Continuous bi-directional streaming via WebSocket' : 'Direct full-duplex voice stream'}
              </p>
            </div>

            {/* Connect / Disconnect Action buttons */}
            <div className="flex items-center gap-3 mt-6">
              {!isConnected ? (
                <button
                  onClick={handleStartCall}
                  disabled={isConnecting}
                  className="flex items-center gap-2.5 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                >
                  {isConnecting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Connecting...</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4" />
                      <span>Start Live Voice Conversation</span>
                    </>
                  )}
                </button>
              ) : (
                <>
                  <button
                    onClick={toggleMute}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                      isMuted
                        ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {isMuted ? <MicOff className="w-4 h-4 text-amber-400" /> : <Mic className="w-4 h-4" />}
                    <span>{isMuted ? 'Unmute Mic' : 'Mute Mic'}</span>
                  </button>

                  {isModelSpeaking && (
                    <button
                      onClick={stopAllActiveAudio}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30"
                      title="Interrupt the model speaking"
                    >
                      <VolumeX className="w-4 h-4" />
                      <span>Interrupt</span>
                    </button>
                  )}

                  <button
                    onClick={disconnect}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-rose-500/20 border border-rose-500/40 text-rose-300 hover:bg-rose-500/30 transition-all"
                  >
                    <PhoneOff className="w-4 h-4 text-rose-400" />
                    <span>End Call</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Quick Prompt Chips */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Suggested questions you can speak or tap:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (isConnected) {
                      sendTextMessage(q);
                    } else {
                      connect();
                    }
                  }}
                  className="text-xs px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 transition-colors text-left"
                >
                  "{q}"
                </button>
              ))}
            </div>
          </div>

          {/* Live Transcript / Logs */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
              <span className="flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Live Conversation Transcript</span>
              </span>
              <span className="text-[11px] text-slate-500">{transcripts.length} exchanges</span>
            </div>
            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl max-h-48 overflow-y-auto space-y-2.5 text-xs">
              {transcripts.length === 0 ? (
                <p className="text-slate-500 text-center py-4 italic">
                  Start the call and speak into your mic. The Live API responds in real-time.
                </p>
              ) : (
                transcripts.map((item) => (
                  <div
                    key={item.id}
                    className={`flex flex-col ${item.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] px-3 py-2 rounded-xl ${
                        item.sender === 'user'
                          ? 'bg-cyan-600/30 border border-cyan-500/30 text-cyan-100 rounded-br-none'
                          : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-bl-none'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-[10px] uppercase tracking-wider text-slate-400">
                          {item.sender === 'user' ? 'You (Voice/Text)' : 'SakaKeja Live AI (Zephyr)'}
                        </span>
                        <span className="text-[9px] text-slate-500">{item.timestamp}</span>
                      </div>
                      <p className="leading-relaxed">{item.text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Optional Text input fallback while connected */}
          {isConnected && (
            <form onSubmit={handleSendPrompt} className="flex gap-2">
              <input
                type="text"
                value={textPrompt}
                onChange={(e) => setTextPrompt(e.target.value)}
                placeholder="Or type a message to the Live API agent..."
                className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                disabled={!textPrompt.trim()}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl disabled:opacity-50 transition-colors"
              >
                Send
              </button>
            </form>
          )}
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Model: <strong className="text-emerald-400">gemini-3.8-live</strong></span>
          <span>Sample Rate: <strong>16kHz In / 24kHz Out</strong></span>
          <span>Nairobi Neighborhood Intelligence</span>
        </div>
      </div>
    </div>
  );
};
