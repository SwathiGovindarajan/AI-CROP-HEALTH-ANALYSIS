import React, { useState, useRef, useEffect } from 'react';
import { DiagnosisRecord } from '../data/agroData';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  detectedDisease?: {
    name: string;
    scientificName: string;
    severity: 'High Severity' | 'Moderate Severity' | 'Critical Severity';
    confidence: string;
  };
}

interface ChatbotWidgetProps {
  activeParcel: string;
  onLogDiagnosisFromChat: (record: Omit<DiagnosisRecord, 'id' | 'timestamp' | 'dateFormatted'>) => void;
  onNavigateToAnalysis: (symptomQuery?: string) => void;
}

const SYMPTOM_CHIPS = [
  { label: '🍂 Brown concentric rings on tomato leaves', query: 'My tomato leaves have concentric brown target rings and yellowing lower leaves.' },
  { label: '🌽 Cinnamon rust pustules on corn', query: 'I see cinnamon-brown elongated rust pustules on the upper corn leaves.' },
  { label: '❄️ White powdery dust on leaves', query: 'Leaves are covered in white talcum-like powdery patches and curling upward.' },
  { label: '💧 Dark water-soaked potato lesions', query: 'Potato leaves have dark water-soaked blotches and white fuzz underneath.' },
  { label: '⏰ Optimal fungicide spray window?', query: 'When is the best time to spray fungicides under current parcel conditions?' },
  { label: '🐞 Organic aphid control?', query: 'What is the best organic aphid control protocol?' },
];

export const ChatbotWidget: React.FC<ChatbotWidgetProps> = ({
  activeParcel,
  onLogDiagnosisFromChat,
  onNavigateToAnalysis,
}) => {
  // Mode: 'expanded' (full chat panel) vs 'icon' (minimized chatbot icon)
  const [isMinimizedIcon, setIsMinimizedIcon] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: `Greetings! I'm monitoring ${activeParcel}. Detected Alternaria solani on tomato specimens. Describe any plant symptoms you observe (e.g., leaf spots, yellowing, wilting, powdery patches) and I will analyze your plant's health and identify the disease!`,
      timestamp: 'Just now',
      detectedDisease: {
        name: 'Tomato Early Blight',
        scientificName: 'Alternaria solani',
        severity: 'High Severity',
        confidence: '98.4%',
      },
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [symptomCheckMode, setSymptomCheckMode] = useState(false);
  const [doubleClickHintVisible, setDoubleClickHintVisible] = useState(true);

  const clickTimerRef = useRef<number | null>(null);
  const clickCountRef = useRef<number>(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMinimizedIcon) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isMinimizedIcon]);

  // Requirement 1: "When the user clicks the chatbot twice, it should minimize and change into a chatbot icon."
  const handleChatbotContainerClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    // Do not intercept clicks inside text inputs or buttons with explicit actions
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.closest('[data-no-dbl-minimize="true"]')
    ) {
      return;
    }

    clickCountRef.current += 1;

    if (clickCountRef.current === 1) {
      clickTimerRef.current = window.setTimeout(() => {
        clickCountRef.current = 0;
      }, 380);
    } else if (clickCountRef.current >= 2) {
      if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current);
      }
      clickCountRef.current = 0;
      setIsMinimizedIcon(true);
      setDoubleClickHintVisible(false);
    }
  };

  const detectDiseaseMetadata = (text: string) => {
    const lower = text.toLowerCase();
    if (lower.includes('early blight') || lower.includes('alternaria')) {
      return {
        name: 'Tomato Early Blight',
        scientificName: 'Alternaria solani',
        severity: 'High Severity' as const,
        confidence: '98.4%',
      };
    }
    if (lower.includes('late blight') || lower.includes('phytophthora')) {
      return {
        name: 'Late Blight',
        scientificName: 'Phytophthora infestans',
        severity: 'Critical Severity' as const,
        confidence: '99.2%',
      };
    }
    if (lower.includes('rust') || lower.includes('puccinia')) {
      return {
        name: 'Common Leaf Rust',
        scientificName: 'Puccinia sorghi',
        severity: 'Moderate Severity' as const,
        confidence: '96.1%',
      };
    }
    if (lower.includes('powdery mildew') || lower.includes('podosphaera') || lower.includes('erysiph')) {
      return {
        name: 'Powdery Mildew',
        scientificName: 'Podosphaera xanthii',
        severity: 'Moderate Severity' as const,
        confidence: '95.8%',
      };
    }
    if (lower.includes('fusarium') || lower.includes('verticillium') || lower.includes('vascular wilt')) {
      return {
        name: 'Fusarium Vascular Wilt',
        scientificName: 'Fusarium oxysporum',
        severity: 'High Severity' as const,
        confidence: '94.2%',
      };
    }
    if (lower.includes('aphid')) {
      return {
        name: 'Aphid Foliar Colonization',
        scientificName: 'Aphidoidea complex',
        severity: 'Moderate Severity' as const,
        confidence: '95.0%',
      };
    }
    return undefined;
  };

  const sendMessage = async (overrideText?: string) => {
    const text = (overrideText !== undefined ? overrideText : inputValue).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (overrideText === undefined) {
      setInputValue('');
    }
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.map((m) => ({ sender: m.sender, text: m.text })),
          activeParcel,
        }),
      });
      const data = await response.json();
      const replyText =
        data.reply ||
        'Based on your described symptoms, inspect the abaxial leaf surface for fungal sporulation and apply Copper Octanoate or Bacillus subtilis bio-fungicide during the early morning spray window.';

      const detected = detectDiseaseMetadata(replyText);

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        detectedDisease: detected,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      const fallbackMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: 'Diagnosis Analysis: Your reported symptoms align with foliar fungal stress (Alternaria / Erysiphales). Isolate affected plants, avoid overhead leaf wetting, and apply Copper Octanoate Bio-Spray (45ml/gal).',
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Minimized Chatbot Icon State (when user double-clicks the chatbot or clicks minimize)
  if (isMinimizedIcon) {
    return (
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
        <button
          type="button"
          onClick={() => setIsMinimizedIcon(false)}
          title="Click to expand AgroAI Copilot Chatbot"
          aria-label="Open AgroAI Copilot Chatbot"
          className="relative w-16 h-16 rounded-full bg-gradient-to-br from-primary via-primary-container to-secondary text-on-primary shadow-[0_12px_32px_rgba(0,59,27,0.38)] flex items-center justify-center hover:scale-105 active:scale-95 transition-all group border-2 border-secondary-fixed/60"
        >
          <span className="material-symbols-outlined text-3xl group-hover:rotate-6 transition-transform">
            smart_toy
          </span>
          <span className="w-3.5 h-3.5 rounded-full bg-secondary-fixed absolute top-0.5 right-0.5 border-2 border-primary animate-pulse"></span>
          <span className="absolute -left-40 bg-inverse-surface text-inverse-on-surface font-label-sm text-[11px] px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md">
            AgroAI Plant Doctor • LIVE
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-5 right-5 z-40 max-w-sm w-[92vw] sm:w-[395px] flex flex-col items-end">
      {/* Expanded Modern Chatbot Panel (Double-click anywhere on header/body to minimize into chatbot icon) */}
      <div
        onClick={handleChatbotContainerClick}
        onDoubleClick={() => setIsMinimizedIcon(true)}
        className="w-full bg-surface-container-lowest rounded-2xl shadow-[0_20px_50px_rgba(19,27,46,0.22)] border border-primary/15 flex flex-col overflow-hidden mb-3 transition-all duration-300 select-none"
        id="agroChatPanel"
      >
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-primary via-primary-container to-primary px-4 py-3 text-on-primary flex items-center justify-between cursor-pointer">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <span className="w-9 h-9 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-xs shadow-inner">
                <span className="material-symbols-outlined text-lg">psychiatry</span>
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-secondary-fixed absolute -bottom-0.5 -right-0.5 border-2 border-primary"></span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-headline-sm text-sm font-bold leading-none">AgroAI Copilot</span>
                <span className="font-label-sm text-[10px] bg-secondary-fixed text-on-secondary-fixed px-1.5 py-0.5 rounded-full font-bold">
                  AI PATHOLOGIST
                </span>
              </div>
              <span className="font-label-sm text-[10px] text-on-primary-container leading-none mt-1">
                Double-click anywhere to minimize to icon
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1" data-no-dbl-minimize="true">
            <button
              type="button"
              onClick={() => setSymptomCheckMode(!symptomCheckMode)}
              title="Toggle Symptom Diagnostic Mode"
              className={`px-2 py-1 rounded-lg font-label-sm text-[10px] transition-colors flex items-center gap-1 ${
                symptomCheckMode ? 'bg-secondary-fixed text-on-secondary-fixed font-bold' : 'bg-white/10 text-on-primary hover:bg-white/20'
              }`}
            >
              <span className="material-symbols-outlined text-xs">stethoscope</span>
              Symptom Check
            </button>
            <button
              type="button"
              onClick={() => setIsMinimizedIcon(true)}
              title="Minimize to Chatbot Icon"
              className="text-on-primary hover:bg-white/15 p-1 rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined text-base">minimize</span>
            </button>
          </div>
        </div>

        {/* Interactive Double-Click Instruction Banner */}
        {doubleClickHintVisible && (
          <div
            data-no-dbl-minimize="true"
            className="bg-primary-fixed/50 px-3 py-1.5 flex items-center justify-between border-b border-primary/10"
          >
            <span className="font-label-sm text-[11px] text-on-primary-fixed flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-secondary">touch_app</span>
              Tip: Click chatbot twice (double-click) to minimize into an icon
            </span>
            <button
              type="button"
              onClick={() => setDoubleClickHintVisible(false)}
              className="text-on-primary-fixed-variant hover:text-primary text-xs font-bold px-1"
            >
              ×
            </button>
          </div>
        )}

        {/* Quick Symptom & Agronomy Prompt Pills */}
        <div
          data-no-dbl-minimize="true"
          className="p-2.5 bg-surface-container-low flex items-center gap-1.5 overflow-x-auto border-b border-surface-container"
        >
          {SYMPTOM_CHIPS.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => sendMessage(chip.query)}
              className="text-left text-xs bg-surface-container-lowest text-primary px-2.5 py-1 rounded-full font-label-sm text-[11px] hover:bg-primary hover:text-on-primary transition-colors whitespace-nowrap flex-shrink-0 shadow-2xs border border-primary/10"
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Guided Symptom Entry Drawer inside Chatbot when toggled */}
        {symptomCheckMode && (
          <div
            data-no-dbl-minimize="true"
            className="p-3 bg-secondary-fixed/25 border-b border-secondary/20 flex flex-col gap-2"
          >
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-[11px] text-primary font-bold uppercase">
                Describe Plant Symptoms for AI Diagnosis
              </span>
              <button
                type="button"
                onClick={() => onNavigateToAnalysis()}
                className="font-label-sm text-[10px] text-secondary underline hover:text-primary"
              >
                Open Full Analysis Page →
              </button>
            </div>
            <div className="flex flex-wrap gap-1">
              {[
                'Yellow leaf halo',
                'Concentric brown rings',
                'White powdery coating',
                'Wilting lower branches',
                'Black stem base',
                'Orange rust pustules',
              ].map((sym) => (
                <button
                  key={sym}
                  type="button"
                  onClick={() =>
                    setInputValue((prev) =>
                      prev ? `${prev}, ${sym.toLowerCase()}` : `My plant has ${sym.toLowerCase()}`
                    )
                  }
                  className="px-2 py-0.5 rounded bg-surface-container-lowest text-on-surface font-label-sm text-[10px] hover:bg-secondary hover:text-on-secondary transition-colors border border-secondary/20"
                >
                  + {sym}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages Transcript Feed */}
        <div
          className="p-3.5 h-72 overflow-y-auto flex flex-col gap-3 font-body-sm text-body-sm bg-surface-bright select-text"
          id="chatMessages"
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 max-w-[88%] ${
                msg.sender === 'user' ? 'self-end flex-row-reverse' : 'self-start'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold mt-0.5 ${
                  msg.sender === 'user'
                    ? 'bg-secondary text-on-secondary'
                    : 'bg-primary text-on-primary'
                }`}
              >
                {msg.sender === 'user' ? 'ME' : 'AI'}
              </div>
              <div
                className={`p-3 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                  msg.sender === 'user'
                    ? 'bg-primary text-on-primary rounded-tr-sm'
                    : 'bg-surface-container-low text-on-surface rounded-tl-sm border border-primary/5'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>

                {/* Actionable Disease Card when AI identifies a disease */}
                {msg.detectedDisease && (
                  <div
                    data-no-dbl-minimize="true"
                    className="mt-2.5 pt-2 border-t border-primary/10 flex flex-col gap-1.5 bg-surface-container-lowest p-2 rounded-lg"
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-label-sm text-[10px] font-bold text-primary">
                        {msg.detectedDisease.name}
                      </span>
                      <span className="font-label-sm text-[10px] bg-error-container text-on-error-container px-1.5 py-0.5 rounded font-semibold">
                        {msg.detectedDisease.confidence}
                      </span>
                    </div>
                    <span className="font-body-sm text-[11px] italic text-on-surface-variant">
                      {msg.detectedDisease.scientificName}
                    </span>
                    <div className="flex items-center gap-1.5 pt-1">
                      <button
                        type="button"
                        onClick={() =>
                          onLogDiagnosisFromChat({
                            parcelName: activeParcel.split(' - ')[0] || activeParcel,
                            lotCode: 'GV-CHAT-01',
                            gps: '38.541°N, 121.782°W',
                            cropName: activeParcel.split(' - ')[1] || 'Field Specimen',
                            diseaseName: msg.detectedDisease!.name,
                            scientificName: msg.detectedDisease!.scientificName,
                            confidence: msg.detectedDisease!.confidence,
                            severity: msg.detectedDisease!.severity,
                            status: 'Active Treatment',
                            symptoms: ['Identified via conversational symptom analysis in AgroAI Copilot'],
                            recommendedAction: 'Targeted organic/chemical protocol prescribed in Copilot transcript.',
                            imageUrl:
                              'https://lh3.googleusercontent.com/aida-public/AB6AXuDhxssnix2_wXEq6Eo7a3eQL7pNbtXgCtmVy9nspWCWQftYfEqYSemJR1UaribgecUoUaaSJ03VyrjFzpwOU-XT9QPlj0KnTuNMZJIjvychhzsyf9_m474rlYBHhYBBoo8DR-oywhXKhKJg3RHbcRkqjPxHitcrY_jQrtii8q1DBW2Bo_tRLBBQT42iOO7kLIrZ7KFb_kI9Q24qo4qJOyabqbUP3vpSt8WVWALIB9DB-d24myu9aNYS',
                            analyzedBy: 'AgroAI Copilot Engine',
                            method: 'Copilot Triage',
                          })
                        }
                        className="flex-1 py-1 px-2 rounded bg-secondary/15 text-primary hover:bg-secondary hover:text-on-secondary font-label-sm text-[10px] font-semibold transition-colors flex items-center justify-center gap-1"
                      >
                        <span className="material-symbols-outlined text-xs">bookmark_add</span>
                        Log to History
                      </button>
                      <button
                        type="button"
                        onClick={() => onNavigateToAnalysis(msg.detectedDisease!.name)}
                        className="py-1 px-2 rounded bg-surface-container text-on-surface hover:bg-surface-container-high font-label-sm text-[10px] font-semibold transition-colors"
                      >
                        Full Guide
                      </button>
                    </div>
                  </div>
                )}

                <span
                  className={`font-label-sm text-[10px] block mt-1.5 ${
                    msg.sender === 'user' ? 'text-on-primary-container text-right' : 'text-on-surface-variant'
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start gap-2.5 max-w-[85%] self-start">
              <div className="w-6 h-6 rounded-full bg-primary text-on-primary flex-shrink-0 flex items-center justify-center text-[10px] font-bold mt-0.5">
                AI
              </div>
              <div className="bg-surface-container-low p-3 rounded-2xl rounded-tl-sm text-on-surface flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-secondary animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-secondary animate-bounce [animation-delay:150ms]"></span>
                <span className="w-2 h-2 rounded-full bg-secondary animate-bounce [animation-delay:300ms]"></span>
                <span className="font-label-sm text-[11px] text-on-surface-variant ml-1">
                  Analyzing plant pathology...
                </span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input Field */}
        <div
          data-no-dbl-minimize="true"
          className="p-3 bg-surface-container-lowest border-t border-surface-container flex items-center gap-2"
        >
          <input
            className="flex-1 bg-surface-container-low text-on-surface font-body-sm text-xs px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
            id="chatInput"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') sendMessage();
            }}
            placeholder="Describe plant symptoms or ask AgroAI..."
            type="text"
          />
          <button
            type="button"
            onClick={() => sendMessage()}
            disabled={isLoading}
            aria-label="Send message"
            className="p-2.5 bg-primary text-on-primary rounded-lg hover:bg-secondary transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-base leading-none">send</span>
          </button>
        </div>
      </div>

      {/* Bottom Floating Pill Bar (Single click toggles, Double click minimizes into compact Chatbot Icon) */}
      <button
        type="button"
        onClick={() => setIsMinimizedIcon(true)}
        title="Click to minimize into Chatbot Icon"
        className="px-4 py-3 bg-primary text-on-primary rounded-full shadow-lg flex items-center gap-2.5 hover:bg-secondary transition-transform active:scale-95 group"
        id="agroChatTrigger"
      >
        <div className="relative flex items-center">
          <span className="material-symbols-outlined text-xl">smart_toy</span>
          <span className="w-2.5 h-2.5 rounded-full bg-secondary-fixed absolute -top-1 -right-1"></span>
        </div>
        <span className="font-headline-sm text-sm font-semibold">Ask AgroAI Expert</span>
        <span className="font-label-sm text-[11px] bg-secondary px-2 py-0.5 rounded-full text-on-primary font-bold">
          LIVE
        </span>
      </button>
    </div>
  );
};
