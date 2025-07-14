//frontend/app/chat-voice/page.tsx

'use client';

import { useState, useRef } from 'react';
import WakeWordListener from '@/components/WakeWordListener'; // ✅ Correct import
import styles from './ChatPage.module.css';
import { Button } from '@/components/button'

export default function ChatPage() {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks: Blob[] = [];

  const [lastAudioBase64, setLastAudioBase64] = useState('');
  const [lastAudioMime, setLastAudioMime] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const base64ToBlob = (base64: string, mime = 'audio/wav') => {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let i = 0; i < byteCharacters.length; i++) {
      byteArrays.push(byteCharacters.charCodeAt(i));
    }

    return new Blob([new Uint8Array(byteArrays)], { type: mime });
  };

  const playBase64Audio = (base64: string, mimeType = 'audio/wav') => {
    try {
      if (!base64 || base64.trim() === '') throw new Error('Empty audio string');

      const blob = base64ToBlob(base64, mimeType);
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;

      audio.onerror = (e) => console.error('❌ Audio playback failed', e);
      audio.onended = () => setIsAudioPlaying(false);

      setIsAudioPlaying(true);
      audio.play().catch((err) => {
        setIsAudioPlaying(false);
        console.error('❌ Could not play audio:', err);
      });
    } catch (err) {
      console.error('❌ Audio Playback Exception:', err);
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsAudioPlaying(false);
    }
  };

  const tryPlayAudio = (base64: string, mimeType = 'audio/wav') => {
    if (!base64 || base64.trim() === '') {
      console.warn('⚠️ No audio returned from server');
      return;
    }

    setLastAudioBase64(base64);
    setLastAudioMime(mimeType);
    playBase64Audio(base64, mimeType);
  };

  const sendTextMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    const formData = new FormData();
    formData.append('text', input);

    try {
      const res = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      const aiMsg = { sender: 'sakhi', text: data.ai_text };
      setMessages((prev) => [...prev, aiMsg]);
      tryPlayAudio(data.audio_base64, data.audio_mime);
    } catch (err) {
      console.error('❌ Error sending message:', err);
    }

    setIsLoading(false);
    setInput('');
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (e) => audioChunks.push(e.data);

      mediaRecorderRef.current.onstop = async () => {
        const blob = new Blob(audioChunks, { type: 'audio/wav' });
        audioChunks.length = 0;

        const formData = new FormData();
        formData.append('file', blob);

        setIsLoading(true);

        try {
          const res = await fetch('http://localhost:8000/api/chat', {
            method: 'POST',
            body: formData,
          });

          const data = await res.json();
          setMessages((prev) => [...prev, { sender: 'user', text: data.user_text }]);
          setMessages((prev) => [...prev, { sender: 'sakhi', text: data.ai_text }]);
          tryPlayAudio(data.audio_base64, data.audio_mime);
        } catch (err) {
          console.error('❌ Voice input error:', err);
        }

        setIsLoading(false);
      };

      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (err) {
      console.error('❌ Microphone access denied or error:', err);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  const safeStartRecording = () => {
    if (!recording) startRecording();
  };

  return (
    <>
      {/* Home Button */}
      <Button
        onClick={() => window.location.href = '/user-dashboard'}
        className="absolute top-4 right-4 bg-purple-500 text-white hover:bg-purple-600 px-4 py-2 text-sm rounded-full shadow-md transition-all z-50"
      >
        Home
      </Button>

      {/* Main Chat Section */}
      <main
        className="min-h-screen bg-cover bg-center p-6 flex items-center justify-center"
        style={{
          backgroundImage: "url('/chatbot.jpg')",
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          backgroundBlendMode: 'overlay',
        }}
      >
        <div className="max-w-3xl w-full">

          <WakeWordListener onWakeWord={safeStartRecording} wakeWord="saki" />

          <h1 className="text-4xl font-bold mb-6 text-center text-[#5C068C] tracking-wide drop-shadow-md">
            👩‍⚖️ Ask <span className="italic font-semibold">Sahaya Sakhi</span> <br />
            <span className="text-xl text-gray-600">Your AI Legal Companion</span>
          </h1>

          {/* Chat Box */}
          <div className={`backdrop-blur-md bg-white/80 border border-white/40 rounded-2xl p-6 h-96 overflow-y-auto mb-6 shadow-lg ${styles.chatScrollArea}`}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`mb-3 ${msg.sender === 'user' ? 'text-right' : 'text-left'} ${styles.messageEnter}`}
              >
                <span
                  className={`inline-block px-4 py-3 rounded-2xl shadow-sm text-sm max-w-[80%] whitespace-pre-wrap break-words ${
                    msg.sender === 'user' ? 'bg-blue-100 text-blue-900' : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <strong>{msg.sender === 'user' ? 'You' : 'Sakhi'}:</strong> {msg.text}
                </span>
              </div>
            ))}

            {recording && (
              <div className="text-center mt-4 text-green-600 animate-pulse font-semibold">
                🎧 Listening...
              </div>
            )}

            {isLoading && (
              <div className="text-center mt-4 text-gray-500 animate-pulse">
                Thinking...
              </div>
            )}
          </div>

          {/* Input & Controls */}
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 p-3 border rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Type your legal question..."
              onKeyDown={(e) => e.key === 'Enter' && sendTextMessage()}
              disabled={isLoading}
            />
            <button
              onClick={sendTextMessage}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-md"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send'}
            </button>
            <button
              onClick={recording ? stopRecording : startRecording}
              className={`px-4 py-2 rounded-2xl text-white shadow-md ${
                recording ? 'bg-red-500 hover:bg-red-600' : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {recording ? 'Stop 🎙️' : 'Speak'}
            </button>

            {isAudioPlaying && (
              <button
                onClick={stopAudio}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-2xl shadow-md"
              >
                ⏹️ Stop
              </button>
            )}

            {lastAudioBase64 && !isAudioPlaying && (
              <button
                onClick={() => tryPlayAudio(lastAudioBase64, lastAudioMime)}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-2xl shadow-md"
              >
                🔁 Replay
              </button>
            )}
          </div>
        </div>
      </main>
    </>
  );
}