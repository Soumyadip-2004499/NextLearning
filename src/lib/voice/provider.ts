/**
 * Voice Service Adapter
 * 
 * Provides a pluggable interface for speech-to-text and text-to-speech services.
 * Currently supports:
 * - Web Speech API (browser built-in, no credentials needed)
 * - Bhashini API (future, requires credentials)
 * 
 * The adapter pattern allows swapping providers without changing UI code.
 */

export interface VoiceProvider {
  name: string;
  supportedLanguages: string[];
  startListening(lang: string, onResult: (text: string) => void, onError: (error: string) => void): void;
  stopListening(): void;
  speak(text: string, lang: string): Promise<void>;
  isAvailable(): boolean;
}

/**
 * Web Speech API provider - works in most modern browsers
 */
export class WebSpeechProvider implements VoiceProvider {
  name = "Web Speech API";
  supportedLanguages = ["en-IN", "hi-IN", "ta-IN", "te-IN", "kn-IN", "mr-IN", "bn-IN", "gu-IN", "ml-IN", "pa-IN"];
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private recognition: any = null;

  isAvailable(): boolean {
    if (typeof window === "undefined") return false;
    return "SpeechRecognition" in window || "webkitSpeechRecognition" in window;
  }

  startListening(lang: string, onResult: (text: string) => void, onError: (error: string) => void): void {
    if (!this.isAvailable()) {
      onError("Speech recognition is not available in this browser.");
      return;
    }

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognitionAPI();
    this.recognition.lang = lang;
    this.recognition.continuous = false;
    this.recognition.interimResults = false;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.recognition.onresult = (event: any) => {
      const transcript = event.results[0]?.[0]?.transcript;
      if (transcript) {
        onResult(transcript);
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.recognition.onerror = (event: any) => {
      onError(`Speech recognition error: ${event.error}`);
    };

    this.recognition.start();
  }

  stopListening(): void {
    this.recognition?.stop();
    this.recognition = null;
  }

  async speak(text: string, lang: string): Promise<void> {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      throw new Error("Text-to-speech is not available in this browser.");
    }

    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.onend = () => resolve();
      utterance.onerror = (event) => reject(new Error(`TTS error: ${event.error}`));
      window.speechSynthesis.speak(utterance);
    });
  }
}

/**
 * Bhashini API provider - placeholder for future integration
 * Requires BHASHINI_API_KEY and BHASHINI_USER_ID credentials
 */
export class BhashiniProvider implements VoiceProvider {
  name = "Bhashini";
  supportedLanguages = ["hi", "ta", "te", "kn", "mr", "bn", "gu", "ml", "pa", "or", "as"];

  isAvailable(): boolean {
    // TODO: Check for Bhashini API credentials via server endpoint
    return false;
  }

  startListening(_lang: string, _onResult: (text: string) => void, onError: (error: string) => void): void {
    onError("Bhashini voice service requires API credentials. Please configure BHASHINI_API_KEY in your environment.");
  }

  stopListening(): void {
    // No-op
  }

  async speak(_text: string, _lang: string): Promise<void> {
    throw new Error("Bhashini TTS requires API credentials. Please configure BHASHINI_API_KEY.");
  }
}

/**
 * Get the best available voice provider
 */
export function getVoiceProvider(): VoiceProvider {
  const webSpeech = new WebSpeechProvider();
  if (webSpeech.isAvailable()) {
    return webSpeech;
  }
  // Return a provider that reports unavailability
  return {
    name: "None",
    supportedLanguages: [],
    isAvailable: () => false,
    startListening: (_lang, _onResult, onError) => onError("No voice service available. Please use text input."),
    stopListening: () => {},
    speak: async () => { throw new Error("No voice service available."); },
  };
}

// Extend Window for TypeScript
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    SpeechRecognition: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    webkitSpeechRecognition: any;
  }
}
