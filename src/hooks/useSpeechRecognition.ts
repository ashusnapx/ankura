"use client";
import { useState, useCallback, useRef } from "react";
import {
  isSpeechRecognitionSupported,
  createSpeechRecognition,
  calculatePronunciationAccuracy,
} from "@/lib/utils/speech";

interface SpeechState {
  isListening: boolean;
  transcript: string;
  accuracy: number;
  isSupported: boolean;
  error: string | null;
}

export function useSpeechRecognition() {
  const [state, setState] = useState<SpeechState>({
    isListening: false,
    transcript: "",
    accuracy: 0,
    isSupported: isSpeechRecognitionSupported(),
    error: null,
  });
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const startListening = useCallback(
    (expectedPhrase?: string, onResult?: (accuracy: number) => void) => {
      if (!isSpeechRecognitionSupported()) {
        setState((s) => ({
          ...s,
          error: "Speech recognition not supported in this browser",
        }));
        return;
      }

      const recognition = createSpeechRecognition();
      if (!recognition) return;

      recognitionRef.current = recognition;

      recognition.onstart = () => {
        setState((s) => ({
          ...s,
          isListening: true,
          error: null,
          transcript: "",
          accuracy: 0,
        }));
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        const confidence = event.results[0][0].confidence;
        const accuracy =
          expectedPhrase ?
            calculatePronunciationAccuracy(expectedPhrase, transcript)
          : Math.round(confidence * 100);

        if (onResult) {
          onResult(accuracy);
        }

        setState((s) => ({ ...s, transcript, accuracy, isListening: false }));
      };

      recognition.onerror = (event) => {
        setState((s) => ({ ...s, isListening: false, error: event.error }));
      };

      recognition.onend = () => {
        setState((s) => ({ ...s, isListening: false }));
      };

      recognition.start();
    },
    [],
  );

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setState((s) => ({ ...s, isListening: false }));
    }
  }, []);

  const reset = useCallback(() => {
    setState((s) => ({ ...s, transcript: "", accuracy: 0, error: null }));
  }, []);

  return { ...state, startListening, stopListening, reset };
}
