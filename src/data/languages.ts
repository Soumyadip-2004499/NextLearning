export interface Language {
  code: string;
  name: string;
  nativeName: string;
  speechCode: string; // BCP-47 code for Web Speech API
  direction: "ltr" | "rtl";
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: "en", name: "English", nativeName: "English", speechCode: "en-IN", direction: "ltr" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", speechCode: "hi-IN", direction: "ltr" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", speechCode: "ta-IN", direction: "ltr" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", speechCode: "te-IN", direction: "ltr" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", speechCode: "kn-IN", direction: "ltr" },
  { code: "mr", name: "Marathi", nativeName: "मराठी", speechCode: "mr-IN", direction: "ltr" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", speechCode: "bn-IN", direction: "ltr" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી", speechCode: "gu-IN", direction: "ltr" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം", speechCode: "ml-IN", direction: "ltr" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", speechCode: "pa-IN", direction: "ltr" },
  { code: "or", name: "Odia", nativeName: "ଓଡ଼ିଆ", speechCode: "or-IN", direction: "ltr" },
];

export function getLanguageByCode(code: string): Language | undefined {
  return SUPPORTED_LANGUAGES.find((l) => l.code === code);
}

export function getDefaultLanguage(): Language {
  return SUPPORTED_LANGUAGES[0]; // English
}

// Basic UI strings for critical paths (extensible per language)
export const UI_STRINGS: Record<string, Record<string, string>> = {
  en: {
    welcome: "Welcome to NextLearning",
    dashboard: "Dashboard",
    careers: "Discover Careers",
    roadmap: "My Roadmap",
    opportunities: "Opportunities",
    chat: "AI Assistant",
    profile: "Profile",
    settings: "Settings",
    signOut: "Sign Out",
    loading: "Loading...",
    error: "Something went wrong",
    offline: "You are offline",
    online: "You are back online",
    save: "Save",
    cancel: "Cancel",
    next: "Next",
    back: "Back",
    search: "Search",
    noResults: "No results found",
    sampleData: "Sample Data",
  },
  hi: {
    welcome: "उड़ान में आपका स्वागत है",
    dashboard: "डैशबोर्ड",
    careers: "करियर खोजें",
    roadmap: "मेरा रोडमैप",
    opportunities: "अवसर",
    chat: "AI सहायक",
    profile: "प्रोफ़ाइल",
    settings: "सेटिंग्स",
    signOut: "लॉग आउट",
    loading: "लोड हो रहा है...",
    error: "कुछ गलत हो गया",
    offline: "आप ऑफ़लाइन हैं",
    online: "आप वापस ऑनलाइन हैं",
    save: "सहेजें",
    cancel: "रद्द करें",
    next: "अगला",
    back: "पीछे",
    search: "खोजें",
    noResults: "कोई परिणाम नहीं मिला",
    sampleData: "नमूना डेटा",
  },
};

export function t(key: string, lang: string = "en"): string {
  return UI_STRINGS[lang]?.[key] || UI_STRINGS["en"]?.[key] || key;
}
