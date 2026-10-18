"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Mic,
  MicOff,
  Bot,
  User,
  RotateCcw,
  ExternalLink,
  Copy,
  Check,
  AlertCircle,
  Volume2,
  VolumeX,
  Key,
  X,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  DotMatrixDisplay,
  GlyphBar,
  VoiceSoundwave,
} from "@/components/ui/nothing-elements";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  sources?: Array<{
    title: string;
    url?: string;
    type?: string;
  }>;
}

export interface StudentProfileContext {
  id?: string;
  displayName?: string | null;
  educationLevel?: string | null;
  state?: string | null;
  district?: string | null;
  class10Marks?: string | null;
  class12Marks?: string | null;
  favoriteSubjects?: string[];
  interests?: string[];
  skills?: string[];
  careerAspirations?: string[];
  careerPreference?: string | null;
  academicPerformance?: string | null;
}

interface ChatInterfaceProps {
  initialMessages?: ChatMessage[];
  studentProfile?: StudentProfileContext;
  className?: string;
}

const SUGGESTED_QUESTIONS = [
  "Recommend courses matching my marks & interests",
  "Which careers match my interests?",
  "What courses should I take after Class 10/12?",
  "Tell me about Solar Rooftop Technician",
  "How to become an Agritech Drone Pilot?",
  "What skills should I learn?",
];

function extractSources(text: string) {
  const lower = text.toLowerCase();
  if (lower.includes("solar") || lower.includes("surya")) {
    return [
      { title: "PM Surya Ghar Official Portal", url: "https://pmsuryaghar.gov.in", type: "Govt Scheme" },
      { title: "National Institute of Solar Energy", url: "https://nise.res.in", type: "Training" },
    ];
  }
  if (lower.includes("diksha") || lower.includes("curriculum") || lower.includes("ncert")) {
    return [
      { title: "DIKSHA National Portal", url: "https://diksha.gov.in", type: "Education" },
      { title: "NCERT Official Curriculum", url: "https://ncert.nic.in", type: "Textbooks" },
    ];
  }
  if (lower.includes("drone") || lower.includes("agri")) {
    return [
      { title: "DGCA Drone Regulations & RPTO", url: "https://dgca.gov.in", type: "Certification" },
      { title: "Kisan Drone Scheme / Ministry of Agriculture", url: "https://agricoop.nic.in", type: "Govt Scheme" },
    ];
  }
  if (lower.includes("nurse") || lower.includes("health") || lower.includes("gda")) {
    return [
      { title: "Healthcare Sector Skill Council (HSSC)", url: "https://healthcare-ssc.in", type: "Accreditation" },
      { title: "Skill India Digital Healthcare Courses", url: "https://www.skillindiadigital.gov.in", type: "Courses" },
    ];
  }
  if (lower.includes("scholarship")) {
    return [
      { title: "National Scholarship Portal (NSP)", url: "https://scholarships.gov.in", type: "Scholarships" },
      { title: "PM-YASASVI Portal", url: "https://yet.nta.ac.in", type: "Financial Aid" },
    ];
  }
  if (lower.includes("code") || lower.includes("web") || lower.includes("software") || lower.includes("developer")) {
    return [
      { title: "freeCodeCamp Web Development", url: "https://www.freecodecamp.org", type: "Free Learning" },
      { title: "SWAYAM Computer Science", url: "https://swayam.gov.in", type: "Ministry of Education" },
    ];
  }
  return [
    { title: "Skill India Digital", url: "https://www.skillindiadigital.gov.in", type: "Official Portal" },
    { title: "National Career Service (NCS)", url: "https://www.ncs.gov.in", type: "Job Portal" },
  ];
}

export function ChatInterface({
  initialMessages = [],
  studentProfile,
  className,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (initialMessages.length > 0) return initialMessages;
    return [
      {
        id: "welcome-1",
        role: "assistant",
        content: `Namaste${
          studentProfile?.displayName ? ` ${studentProfile.displayName}` : ""
        }! 🙏 I am your **NextLearning AI Career Guide**.\n\nI can help you explore practical career paths, understand government schemes like PM Surya Ghar or PMKVY, choose between ITI, Polytechnic, or 11th-12th streams, and build step-by-step learning roadmaps.\n\nWhat would you like to explore today?`,
        timestamp: new Date(),
        sources: [
          { title: "Skill India Digital", url: "https://www.skillindiadigital.gov.in", type: "Official Portal" },
          { title: "PM Surya Ghar Yojana", url: "https://pmsuryaghar.gov.in", type: "Govt Scheme" },
        ],
      },
    ];
  });

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);

  // Text-To-Speech & Gemini API Key States
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [voiceAutoPlay, setVoiceAutoPlay] = useState(false);
  const [apiKey, setApiKey] = useState<string>("");
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [tempKey, setTempKey] = useState("");
  const wasVoiceInputRef = useRef(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load API Key from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("nextlearning_gemini_api_key");
      if (stored) {
        setApiKey(stored);
        setTempKey(stored);
      }
    }
  }, []);

  const scrollToBottom = useCallback((smooth = true) => {
    messagesEndRef.current?.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
    });
  }, []);

  useEffect(() => {
    scrollToBottom(true);
  }, [messages, isLoading, scrollToBottom]);

  // Adjust textarea height automatically
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        140
      )}px`;
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Text-to-Speech Engine
  const stopSpeaking = useCallback(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setSpeakingId(null);
  }, []);

  const speakMessage = useCallback((rawText: string, messageId: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    if (speakingId === messageId) {
      stopSpeaking();
      return;
    }

    // Clean markdown and emojis for clean, natural spoken audio
    const cleanText = rawText
      .replace(/```[\s\S]*?```/g, " ")
      .replace(/`.*?`/g, " ")
      .replace(/\[(.*?)\]\(.*?\)/g, "$1")
      .replace(/[*#_~>-]/g, " ")
      .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "")
      .replace(/\s+/g, " ")
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const isHindi = /[\u0900-\u097F]/.test(cleanText);
    utterance.lang = isHindi ? "hi-IN" : "en-IN";

    // Stable, recognizable voice selection (avoids random voice jumping)
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      const preferredVoice = isHindi
        ? voices.find((v) => v.lang.startsWith("hi"))
        : voices.find((v) => v.lang === "en-IN") ||
          voices.find((v) => v.lang.startsWith("en-GB")) ||
          voices.find((v) => v.lang.startsWith("en"));
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
    }

    // Subtle prosody variance (+/- 3%) so each spoken response has a natural cadence
    const rateVariation = 0.98 + (Math.random() * 0.06 - 0.03);
    const pitchVariation = 1.0 + (Math.random() * 0.04 - 0.02);
    utterance.rate = Math.round(rateVariation * 100) / 100;
    utterance.pitch = Math.round(pitchVariation * 100) / 100;

    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = (e) => {
      console.warn("TTS playback finished or canceled:", e);
      setSpeakingId(null);
    };

    setSpeakingId(messageId);
    window.speechSynthesis.speak(utterance);
  }, [speakingId, stopSpeaking]);

  // Global keyboard listener: pressing Escape interrupts and stops active speech playback
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && speakingId) {
        stopSpeaking();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [speakingId, stopSpeaking]);

  const handleVoiceToggle = () => {
    // Check for native SpeechRecognition
    const windowWithSpeech = window as unknown as {
      webkitSpeechRecognition?: new () => any;
      SpeechRecognition?: new () => any;
    };
    const SpeechRecognitionClass =
      windowWithSpeech.SpeechRecognition || windowWithSpeech.webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      setVoiceNotice("Speech recognition is not supported in this browser. Try Chrome or Edge!");
      setTimeout(() => setVoiceNotice(null), 4000);
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognitionClass();
      recognition.lang = "en-IN"; // Default to Indian English, handles common Hindi/Hinglish terms well
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      setIsListening(true);
      wasVoiceInputRef.current = true;
      setVoiceNotice("Listening... speak your question now");

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((r: any) => r[0].transcript)
          .join("");
        setInput(transcript);
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition error:", event.error);
        setIsListening(false);
        setVoiceNotice(`Voice input stopped (${event.error})`);
        setTimeout(() => setVoiceNotice(null), 3000);
      };

      recognition.onend = () => {
        setIsListening(false);
        setVoiceNotice(null);
      };

      recognition.start();
    } catch (err) {
      console.warn("Speech recognition initiation failed:", err);
      setIsListening(false);
      setVoiceNotice("Could not access microphone.");
      setTimeout(() => setVoiceNotice(null), 3000);
    }
  };

  const handleSaveApiKey = () => {
    const trimmed = tempKey.trim();
    setApiKey(trimmed);
    if (typeof window !== "undefined") {
      if (trimmed) {
        localStorage.setItem("nextlearning_gemini_api_key", trimmed);
      } else {
        localStorage.removeItem("nextlearning_gemini_api_key");
      }
    }
    setShowKeyModal(false);
  };

  const sendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    setErrorMessage(null);
    setInput("");
    stopSpeaking();
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    const userMessageId = `user-${Date.now()}`;
    const assistantMessageId = `assistant-${Date.now()}`;

    const newMessages: ChatMessage[] = [
      ...messages,
      {
        id: userMessageId,
        role: "user",
        content: text,
        timestamp: new Date(),
      },
    ];

    setMessages(newMessages);
    setIsLoading(true);

    // Prepare assistant placeholder message for streaming
    const assistantPlaceholder: ChatMessage = {
      id: assistantMessageId,
      role: "assistant",
      content: "",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, assistantPlaceholder]);

    try {
      const conversationHistory = newMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (apiKey) {
        headers["x-gemini-api-key"] = apiKey;
      }

      const res = await fetch("/api/chat", {
        method: "POST",
        headers,
        body: JSON.stringify({
          message: text,
          conversationHistory,
          studentProfile,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}: ${res.statusText}`);
      }

      if (!res.body) {
        throw new Error("No response body received from chat server.");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulatedText += chunk;

        // Update the assistant message in place
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMessageId
              ? {
                  ...m,
                  content: accumulatedText,
                  sources: extractSources(accumulatedText),
                }
              : m
          )
        );
      }

      // Auto-speak response if voice mode or microphone was used
      if (voiceAutoPlay || wasVoiceInputRef.current) {
        wasVoiceInputRef.current = false;
        speakMessage(accumulatedText, assistantMessageId);
      }
    } catch (err: unknown) {
      console.error("Chat error:", err);
      const errText = err instanceof Error ? err.message : "Failed to connect to AI assistant";
      setErrorMessage(errText);

      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMessageId
            ? {
                ...m,
                content:
                  "I had trouble connecting to the network. Please make sure your internet connection is active, or try asking your question again.",
              }
            : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    stopSpeaking();
    setMessages([
      {
        id: "welcome-cleared",
        role: "assistant",
        content: `Chat cleared. What career or education topic can I help you with now?`,
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div
      className={cn(
        "flex flex-col h-full w-full bg-card rounded-[30px] border border-border overflow-hidden shadow-2xl relative text-card-foreground",
        className
      )}
    >
      {/* Chat Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-border bg-card/90 backdrop-blur-xl">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-muted border border-border text-foreground shadow-sm">
              <Bot className="h-5 w-5 text-[#eb0028]" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-[#eb0028] border-2 border-background animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <DotMatrixDisplay text="NEXTLEARNING // AI.ORACLE" size="sm" dotRed className="text-foreground" />
              <Badge variant="dot" className="text-[10px] tracking-widest font-mono">
                {apiKey ? "GEMINI CLOUD" : "LOCAL AI HUD"}
              </Badge>
            </div>
            <p className="text-[11px] font-mono text-muted-foreground tracking-wide mt-0.5">
              {studentProfile?.displayName
                ? `PROFILE: ${studentProfile.displayName.toUpperCase()} // REGION: ${(studentProfile.state || "IN").toUpperCase()}`
                : "DATA-GROUNDED ADVISORY // VOICE HUD READY"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Voice Auto-Read Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const next = !voiceAutoPlay;
              setVoiceAutoPlay(next);
              if (!next) stopSpeaking();
            }}
            className={cn(
              "text-xs font-mono tracking-wider h-8 px-3 rounded-xl border-border transition-all",
              voiceAutoPlay
                ? "bg-[#eb0028] text-white border-[#eb0028] hover:bg-[#d00024]"
                : "text-muted-foreground hover:text-foreground bg-card"
            )}
            title={voiceAutoPlay ? "Voice readout active" : "Enable voice auto-read"}
          >
            {voiceAutoPlay ? <Volume2 className="h-3.5 w-3.5 mr-1.5" /> : <VolumeX className="h-3.5 w-3.5 mr-1.5" />}
            <span className="hidden sm:inline">VOICE HUD</span>
          </Button>

          {/* Gemini API Key Config Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setTempKey(apiKey);
              setShowKeyModal(true);
            }}
            className={cn(
              "text-xs font-mono tracking-wider h-8 px-3 rounded-xl border-border transition-all",
              apiKey
                ? "border-emerald-500/50 text-emerald-500 hover:bg-emerald-500/10"
                : "text-muted-foreground hover:text-foreground bg-card"
            )}
            title="Configure Google Gemini API Key"
          >
            <Key className="h-3 w-3 mr-1.5" />
            <span className="hidden sm:inline">{apiKey ? "API CONNECTED" : "SET API"}</span>
          </Button>

          <GlyphBar active color="red" className="w-8 sm:w-16 hidden lg:block" />

          <Button
            variant="outline"
            size="sm"
            onClick={clearChat}
            className="text-xs font-mono tracking-wider h-8 px-3 rounded-xl border-border hover:border-foreground/30 text-muted-foreground hover:text-foreground bg-card"
            title="Reset conversation"
          >
            <RotateCcw className="h-3 w-3 mr-1.5" />
            CLEAR
          </Button>
        </div>
      </div>

      {/* Suggested Questions Chips Bar */}
      <div className="px-4 py-2.5 bg-muted/40 border-b border-border overflow-x-auto no-scrollbar flex items-center gap-2">
        <span className="tape-label text-[9px] uppercase tracking-widest shrink-0">
          PROMPTS //
        </span>
        {SUGGESTED_QUESTIONS.map((question) => (
          <button
            key={question}
            type="button"
            onClick={() => sendMessage(question)}
            disabled={isLoading}
            className="shrink-0 text-xs font-mono px-3.5 py-1.5 rounded-full bg-card hover:bg-neutral-900 hover:text-white dark:hover:bg-white dark:hover:text-black border border-border text-foreground transition-all duration-200 active:scale-95 disabled:opacity-40 cursor-pointer"
          >
            {question}
          </button>
        ))}
      </div>

      {/* Error Alert if any */}
      {errorMessage && (
        <div className="mx-4 mt-3 p-3 bg-red-950/40 border border-[#eb0028]/40 rounded-2xl flex items-center justify-between text-xs text-red-200">
          <div className="flex items-center gap-2 font-mono">
            <AlertCircle className="h-4 w-4 shrink-0 text-[#eb0028]" />
            <span>[ERR: {errorMessage}]</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setErrorMessage(null)}
            className="h-6 px-2 text-xs font-mono text-red-300 hover:bg-red-900/50"
          >
            DISMISS
          </Button>
        </div>
      )}

      {/* Voice HUD Live State Banner */}
      <AnimatePresence>
        {(isListening || isLoading || speakingId || voiceNotice) && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -4 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -4 }}
            className="mx-4 mt-3 overflow-hidden"
          >
            <div
              className={cn(
                "p-3 rounded-2xl flex items-center justify-between text-xs font-mono border transition-all",
                speakingId
                  ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-300"
                  : isListening
                  ? "bg-red-950/20 border-[#eb0028]/30 text-red-300"
                  : isLoading
                  ? "bg-amber-950/20 border-amber-500/30 text-amber-300"
                  : "bg-card border-border text-foreground"
              )}
            >
              <div className="flex items-center gap-2.5">
                {isListening ? (
                  <Mic className="h-4 w-4 text-[#eb0028] animate-pulse" />
                ) : speakingId ? (
                  <Volume2 className="h-4 w-4 text-emerald-400 animate-pulse" />
                ) : isLoading ? (
                  <Sparkles className="h-4 w-4 text-amber-400 animate-spin" />
                ) : (
                  <Bot className="h-4 w-4 text-foreground" />
                )}
                <span className="tracking-wide">
                  {voiceNotice
                    ? voiceNotice
                    : isListening
                    ? "VOICE HUD // LISTENING... SPEAK YOUR QUESTION"
                    : isLoading
                    ? "AI ENGINE // GENERATING DIVERSE CONTEXTUAL GUIDANCE..."
                    : speakingId
                    ? "VOICE HUD // AUDIO PLAYBACK ACTIVE"
                    : "VOICE HUD READY"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <VoiceSoundwave isListening={isListening || !!speakingId} />
                {speakingId && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={stopSpeaking}
                    className="h-7 px-2.5 text-[11px] font-mono border-emerald-500/50 hover:bg-emerald-500/20 text-emerald-300 rounded-lg ml-2"
                  >
                    STOP AUDIO
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        <AnimatePresence initial={false}>
          {messages.map((message) => {
            const isUser = message.role === "user";
            const isSpeakingThis = speakingId === message.id;

            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "flex items-start gap-3 w-full",
                  isUser ? "flex-row-reverse" : "flex-row"
                )}
              >
                {/* Avatar Icon */}
                <div
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl shadow-sm mt-1",
                    isUser
                      ? "bg-neutral-900 text-white dark:bg-white dark:text-black border border-border"
                      : "bg-muted border border-border text-[#eb0028]"
                  )}
                >
                  {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={cn(
                    "group relative rounded-[24px] px-5 py-4 shadow-xl max-w-[88%] sm:max-w-[80%] leading-relaxed text-sm transition-all",
                    isUser
                      ? "bg-neutral-900 text-white dark:bg-white dark:text-black font-normal rounded-tr-sm shadow-[0_6px_25px_rgba(0,0,0,0.1)]"
                      : "bg-card border border-border text-foreground rounded-tl-sm backdrop-blur-xl"
                  )}
                >
                  {/* Top Header Tag */}
                  <div
                    className={cn(
                      "flex items-center justify-between gap-2 mb-2 pb-1.5 border-b font-mono text-[10px] tracking-widest uppercase",
                      isUser
                        ? "border-white/20 text-white/70 dark:border-black/10 dark:text-neutral-600"
                        : "border-border text-muted-foreground"
                    )}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className={cn("h-1.5 w-1.5 rounded-full", isUser ? "bg-[#00dc82]" : "bg-[#eb0028]")} />
                      <span>{isUser ? "USER // PROMPT" : "NEXTLEARNING OS // INTELLIGENCE"}</span>
                    </div>
                    <span>
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  {/* Message Content */}
                  <div className="whitespace-pre-wrap break-words leading-relaxed">
                    {message.content ? (
                      formatChatMarkdown(message.content)
                    ) : isLoading && !isUser ? (
                      <div className="flex items-center gap-3 py-2 font-mono text-xs text-muted-foreground">
                        <span className="red-dot animate-ping" />
                        <span className="font-dot text-xs tracking-widest text-[#eb0028]">
                          COMPUTING RESPONSE...
                        </span>
                      </div>
                    ) : null}
                  </div>

                  {/* Sources List if available */}
                  {message.sources && message.sources.length > 0 && (
                    <div className="mt-3.5 pt-2.5 border-t border-border">
                      <div className="text-[10px] font-mono tracking-widest uppercase text-muted-foreground mb-2">
                        // VERIFIED SOURCE CITATIONS
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {message.sources.map((src, idx) => (
                          <a
                            key={idx}
                            href={src.url || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1 rounded-full bg-muted hover:bg-card border border-border text-foreground transition-colors"
                          >
                            <span>{src.title}</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Message Footer (Voice Playback & Copy Buttons) */}
                  {!isUser && message.content && (
                    <div className="flex items-center justify-end gap-3 mt-2 pt-1 border-t border-border">
                      {/* Speak Message Button */}
                      <button
                        onClick={() => speakMessage(message.content, message.id)}
                        className={cn(
                          "opacity-75 hover:opacity-100 transition-opacity p-1 rounded flex items-center gap-1.5 font-mono text-[10px]",
                          isSpeakingThis ? "text-[#eb0028] font-bold" : "text-muted-foreground hover:text-foreground"
                        )}
                        title={isSpeakingThis ? "Stop speaking" : "Read message aloud"}
                      >
                        {isSpeakingThis ? (
                          <>
                            <VolumeX className="h-3.5 w-3.5 text-[#eb0028] animate-pulse" />
                            <span className="text-[#eb0028]">STOP</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="h-3.5 w-3.5" />
                            <span>LISTEN</span>
                          </>
                        )}
                      </button>

                      {/* Copy Button */}
                      <button
                        onClick={() => handleCopy(message.id, message.content)}
                        className="opacity-60 hover:opacity-100 transition-opacity p-1 text-muted-foreground hover:text-foreground rounded flex items-center gap-1.5 font-mono text-[10px]"
                        title="Copy text"
                      >
                        {copiedId === message.id ? (
                          <>
                            <Check className="h-3 w-3 text-[#00dc82]" />
                            <span className="text-[#00dc82]">COPIED</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            <span>COPY</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 sm:p-4 bg-card border-t border-border backdrop-blur-xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="relative flex items-end gap-2 bg-muted/50 border border-border focus-within:border-[#eb0028] focus-within:shadow-[0_0_25px_rgba(235,0,40,0.15)] rounded-[24px] p-2 transition-all"
        >
          {/* Voice Input Button */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleVoiceToggle}
            className={cn(
              "h-10 w-10 rounded-2xl shrink-0 transition-all cursor-pointer",
              isListening
                ? "bg-[#eb0028] text-white shadow-[0_0_18px_#eb0028] hover:bg-[#d00024]"
                : "bg-card text-muted-foreground hover:text-foreground hover:bg-muted border border-border"
            )}
            title={isListening ? "Stop listening" : "Speak question in English or Hindi"}
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder={
              isListening
                ? "Listening... speak now..."
                : "Ask about careers, after 10th/12th options, ITI, scholarships..."
            }
            rows={1}
            disabled={isLoading}
            className="flex-1 bg-transparent border-0 resize-none py-2.5 px-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0 leading-relaxed font-sans max-h-36"
          />

          {/* Send Button */}
          <Button
            type="submit"
            disabled={!input.trim() || isLoading}
            size="icon"
            className={cn(
              "h-10 w-10 rounded-2xl shrink-0 transition-all cursor-pointer",
              input.trim() && !isLoading
                ? "bg-neutral-900 text-white dark:bg-white dark:text-black hover:opacity-90 shadow-md"
                : "bg-muted text-muted-foreground opacity-40 cursor-not-allowed"
            )}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>

        <div className="flex items-center justify-between mt-2 px-3 text-[10px] font-mono text-muted-foreground">
          <span>NEXTLEARNING OS // VERBATIM VOICE HUD READY</span>
          <span>SHIFT + ENTER FOR NEW LINE</span>
        </div>
      </div>

      {/* Gemini API Key Configuration Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-card border border-border rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative text-card-foreground"
          >
            <button
              onClick={() => setShowKeyModal(false)}
              className="absolute top-5 right-5 text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-2xl bg-[#eb0028]/10 text-[#eb0028] border border-[#eb0028]/20">
                <Key className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg font-sans">Google Gemini AI Key</h3>
                <p className="text-xs text-muted-foreground font-mono">Connect live cloud generative model</p>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-muted-foreground mb-3 font-sans">
              Enter your Google Gemini API key to activate real-time Gemini generative AI responses. If left blank, NextLearning runs smoothly using our local human mentor engine.
            </p>
            <div className="mb-4 p-2.5 bg-muted/60 border border-border rounded-xl text-[11px] font-mono flex items-center justify-between">
              <span className="text-muted-foreground">Need a free API key?</span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#eb0028] hover:underline flex items-center gap-1 font-semibold"
              >
                Get Free Key (Google AI Studio) &rarr;
              </a>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-mono font-medium text-foreground block mb-1.5">
                  GEMINI_API_KEY
                </label>
                <input
                  type="password"
                  value={tempKey}
                  onChange={(e) => setTempKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full bg-muted border border-border rounded-xl px-3.5 py-2.5 text-xs font-mono text-foreground focus:outline-none focus:border-[#eb0028]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setTempKey("");
                    setApiKey("");
                    if (typeof window !== "undefined") {
                      localStorage.removeItem("nextlearning_gemini_api_key");
                    }
                    setShowKeyModal(false);
                  }}
                  className="text-xs font-mono rounded-xl"
                >
                  CLEAR KEY
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveApiKey}
                  className="text-xs font-mono rounded-xl bg-[#eb0028] text-white hover:bg-[#d00024]"
                >
                  SAVE & ACTIVATE
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

/**
 * Basic markdown parser for chat bubble text
 */
function formatChatMarkdown(content: string): React.ReactNode {
  const lines = content.split("\n");

  return lines.map((line, lineIndex) => {
    // Headers (### Header)
    if (line.trim().startsWith("### ")) {
      return (
        <h3 key={lineIndex} className="font-bold text-sm text-foreground mt-3 mb-1 font-mono uppercase tracking-wide">
          {line.trim().slice(4)}
        </h3>
      );
    }
    if (line.trim().startsWith("## ")) {
      return (
        <h2 key={lineIndex} className="font-bold text-base text-foreground mt-3 mb-1 font-mono uppercase tracking-wide">
          {line.trim().slice(3)}
        </h2>
      );
    }

    // Bullet points
    if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
      const bulletText = line.trim().slice(2);
      return (
        <div key={lineIndex} className="flex items-start gap-2 my-1 pl-1">
          <span className="h-1.5 w-1.5 rounded-full bg-[#eb0028] mt-2 shrink-0" />
          <span className="flex-1">{renderInlineFormatting(bulletText)}</span>
        </div>
      );
    }

    // Numbered lists (e.g. "1. ")
    const numMatch = line.trim().match(/^(\d+)\.\s+(.*)$/);
    if (numMatch) {
      return (
        <div key={lineIndex} className="flex items-start gap-2 my-1 pl-1">
          <span className="font-bold text-[#eb0028] shrink-0 text-xs mt-0.5 font-mono">
            {numMatch[1]}.
          </span>
          <span className="flex-1">{renderInlineFormatting(numMatch[2])}</span>
        </div>
      );
    }

    // Empty lines
    if (!line.trim()) {
      return <div key={lineIndex} className="h-2" />;
    }

    // Regular paragraph
    return (
      <p key={lineIndex} className="my-0.5">
        {renderInlineFormatting(line)}
      </p>
    );
  });
}

/**
 * Handles inline bolding (`**bold**`), italics (`*italic*`), and links (`[text](url)`).
 */
function renderInlineFormatting(text: string): React.ReactNode {
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|\[.*?\]\(.*?\))/g);

  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("*") && part.endsWith("*") && !part.startsWith("**")) {
      return (
        <em key={i} className="italic text-muted-foreground">
          {part.slice(1, -1)}
        </em>
      );
    }
    const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
    if (linkMatch) {
      return (
        <a
          key={i}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#eb0028] hover:underline inline-flex items-center gap-0.5 font-medium"
        >
          <span>{linkMatch[1]}</span>
          <ExternalLink className="h-2.5 w-2.5 inline" />
        </a>
      );
    }
    return part;
  });
}
