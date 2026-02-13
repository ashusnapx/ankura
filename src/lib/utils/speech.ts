// ═══════════════════════════════════════════
// WEB SPEECH API WRAPPER
// Graceful degradation when unavailable
// ═══════════════════════════════════════════

export interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
}

export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === "undefined") return false;
  return !!(
    window.SpeechRecognition ||
    (window as unknown as { webkitSpeechRecognition: unknown })
      .webkitSpeechRecognition
  );
}

export function isSpeechSynthesisSupported(): boolean {
  if (typeof window === "undefined") return false;
  return !!window.speechSynthesis;
}

export function createSpeechRecognition(): SpeechRecognition | null {
  if (typeof window === "undefined") return null;

  const SpeechRecognitionAPI =
    window.SpeechRecognition ||
    (
      window as unknown as {
        webkitSpeechRecognition: SpeechRecognitionStatic;
      }
    ).webkitSpeechRecognition;

  if (!SpeechRecognitionAPI) return null;

  const recognition = new SpeechRecognitionAPI();
  recognition.lang = "kn-IN"; // Kannada
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.maxAlternatives = 3;

  return recognition;
}

export function speakText(text: string, lang: string = "kn-IN"): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!isSpeechSynthesisSupported()) {
      reject(new Error("Speech synthesis not supported"));
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.8; // Slightly slower for learning
    utterance.pitch = 1;

    utterance.onend = () => resolve();
    utterance.onerror = (e) => reject(e);

    window.speechSynthesis.cancel(); // Cancel any ongoing speech
    window.speechSynthesis.speak(utterance);
  });
}

export function calculatePronunciationAccuracy(
  expected: string,
  actual: string,
): number {
  if (!expected || !actual) return 0;

  const expectedLower = expected.toLowerCase().trim();
  const actualLower = actual.toLowerCase().trim();

  if (expectedLower === actualLower) return 100;

  // Simple Levenshtein-based accuracy
  const distance = levenshteinDistance(expectedLower, actualLower);
  const maxLen = Math.max(expectedLower.length, actualLower.length);
  const accuracy = Math.max(0, Math.round((1 - distance / maxLen) * 100));

  return accuracy;
}

function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1,
        );
      }
    }
  }

  return matrix[b.length][a.length];
}
