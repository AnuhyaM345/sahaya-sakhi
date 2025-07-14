'use client';

import { useEffect, useRef, useState } from 'react';

type Props = {
  onWakeWord: () => void;
  wakeWord?: string; // Default: "sakhi"
  lang?: 'en-US' | 'hi-IN' | 'te-IN'; // Optional language prop
};

export default function WakeWordListener({
  onWakeWord,
  wakeWord = 'saki',
  lang = 'hi-IN', // Defaulting to Hindi
}: Props) {
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [lastDetectionTime, setLastDetectionTime] = useState<number>(0);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error('🚫 Web Speech API not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = lang;

    const phoneticVariants = [
      wakeWord.toLowerCase(),
      'saki',
      'sakhi',
      'sakee',
      'सखी',   // Hindi
      'సఖి',   // Telugu
    ];

    recognition.onresult = (event) => {
      const speechEvent = event as SpeechRecognitionEvent & {
        resultIndex: number;
        results: SpeechRecognitionResultList;
      };

      for (let i = speechEvent.resultIndex; i < speechEvent.results.length; i++) {
        const result = speechEvent.results[i];
        if (!result || !result[0]) continue;

        const transcript = result[0].transcript.trim().toLowerCase();
        const now = Date.now();

        if (now - lastDetectionTime < 3000) continue;

        const matched = phoneticVariants.some((variant) =>
          transcript.includes(variant)
        );

        if (matched) {
          console.log(`🎤 Wake word "${wakeWord}" detected!`);
          setLastDetectionTime(now);
          onWakeWord();
          break;
        }
      }
    };

    recognition.onerror = (e) => {
      console.log('❌ Speech Recognition Error:', e.error);
    };

    recognition.onend = () => {
      console.log('🔁 Speech recognition ended. Restarting...');
      try {
        recognition.start();
      } catch (err) {
        console.log('❌ Failed to restart recognition:', err);
      }
    };

    try {
      recognition.start();
      console.log(`✅ Wake word listener active [lang: ${lang}]...`);
    } catch (err) {
      console.error('❌ Failed to start recognition:', err);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.stop();
        console.log('🛑 Wake word listener stopped');
      }
    };
  }, [wakeWord, onWakeWord, lastDetectionTime, lang]);

  return null;
}
