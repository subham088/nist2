import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Language, User } from '../App';
import { Mic, MicOff, Send, Play, Square, Volume2, Loader2, StopCircle } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
}

export function AiAssistant({ language, user }: { language: Language, user: User }) {
  const [activeMode, setActiveMode] = useState<'chat' | 'voice-text' | 'text-voice'>('chat');
  
  // Chat State
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'model', text: `Hello ${user.name}! I am your NIST Academic Assistant. How can I help you today? (I will respond in ${language})` }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Voice State
  const [isListening, setIsListening] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // APIs
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendChat = async () => {
    if (!inputText.trim()) return;
    
    const userMsg = inputText.trim();
    const newMessages = [...messages, { id: Date.now().toString(), role: 'user' as const, text: userMsg }];
    setMessages(newMessages);
    setInputText('');
    setIsTyping(true);

    const systemPrompt = `You are an AI Academic Assistant for the NIST Student Portal.

Student Context:
- Name: ${user.name}
- Roll Number: ${user.rollNo}
- Reg Number: ${user.regNo}

Your role is to help students with:
- Attendance queries
- Exam results and schedules
- Internship information
- Academic doubts and subjects
- General college-related questions

Core Behavior:
- Always respond in a clear, short, and helpful way.
- Be polite, smart, and student-friendly. Address the student by their name.
- If the user asks something unclear, ask a follow-up question.
- If data is not available contextually, say: "Sorry, I don't have access to that information right now."
- Do NOT give wrong or fake data.
- Do NOT guess student-specific details. Always guide the user step-by-step if needed.

Multi-Language Support:
- Detect the user's language automatically from their message.
- Support English, Hindi, Odia, Bengali, Tamil, and Hinglish.
- Always reply in the same language the user uses. The selected UI language is ${language}.

Voice Features:
- Responses should be easy to speak (for text-to-speech).
- Avoid very long sentences.
- Use natural conversational tone.

Context Awareness:
- If the user asks about attendance, ask for subject if needed (you know their roll number: ${user.rollNo}).
- If the user asks about results, ask for semester or details.
- If the user asks about internships, suggest relevant opportunities or ask for their interest.

Personality:
- Friendly but professional.
- Not too casual, not too robotic.
- Acts like a helpful college assistant.`;

    try {
      const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY || 'fake-key-for-mock';
      
      // Since Anthropic doesn't support CORS from browser typically, and we are in a sandbox without backend,
      // we mock the response if it's a fake key to prevent fetch errors, but use actual fetch if a key is provided
      if (apiKey === 'fake-key-for-mock') {
        await new Promise(r => setTimeout(r, 1000));
        
        let mockResponse = `(Mock Response in ${language}): Hello ${user.name}, I can help you with exams, internships, and academics. How can I assist you today?`;
        const lowerMsg = userMsg.toLowerCase();
        
        if (lowerMsg.includes('all attendance') || lowerMsg.includes('overall attendance')) {
           mockResponse = `${user.name}, your overall attendance across all subjects is 85%. You are well above the 75% required threshold.`;
        } else if (lowerMsg.includes('attendance') || lowerMsg.includes('present') || lowerMsg.includes('kitni hai') || lowerMsg.includes('achha')) {
           mockResponse = `Please tell me the subject for which you want to check your attendance, ${user.name}. I see your roll number is ${user.rollNo}.`;
        } else if (lowerMsg.includes('all result') || lowerMsg.includes('all results') || lowerMsg.includes('overall result')) {
           mockResponse = `${user.name}, your overall CGPA up to the 3rd semester is 8.4. You have cleared all subjects successfully.`;
        } else if (lowerMsg.includes('result') || lowerMsg.includes('sgpa') || lowerMsg.includes('bolo') || lowerMsg.includes('batao') || lowerMsg.includes('results')) {
           mockResponse = `Could you please specify the semester for which you want to check the results, ${user.name}?`;
        } else if (lowerMsg.includes('internship') || lowerMsg.includes('suggest')) {
           mockResponse = `Are you looking for technical internships or general ones, ${user.name}? I can suggest options based on your interests.`;
        }
        
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: mockResponse }]);
      } else {
        const apiMessages = newMessages.filter(m => m.text).map(m => ({
          role: m.role === 'model' ? 'assistant' : 'user',
          content: m.text
        }));

        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true',
            'content-type': 'application/json'
          },
          body: JSON.stringify({
            model: 'claude-3-5-sonnet-20240620',
            max_tokens: 1000,
            system: systemPrompt,
            messages: apiMessages
          })
        });

        if (!response.ok) throw new Error('API Error');
        const data = await response.json();

        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: data.content[0].text || '' }]);
      }
    } catch (e) {
      console.error('Anthropic API Error:', e);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: 'Error connecting to AI service. Please check API configuration or CORS settings.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const toggleListening = () => {
    if (!recognition) {
       alert("Speech recognition is not supported in this browser.");
       return;
    }
    
    if (isListening) {
      recognition.stop();
      setIsListening(false);
      return;
    }

    // Set recognition language based on selection
    const langMap: Record<Language, string> = {
      'English': 'en-IN', 'Hindi': 'hi-IN', 'Odia': 'or-IN', 'Telugu': 'te-IN', 'Bengali': 'bn-IN'
    };
    recognition.lang = langMap[language];
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        setInputText(prev => prev + ' ' + finalTranscript);
      }
    };

    recognition.onend = () => setIsListening(false);
    
    recognition.start();
    setIsListening(true);
  };

  const handleTextToSpeech = (textToRead: string = inputText) => {
    if (!textToRead) return;
    
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(textToRead);
    // Best effort mapping, browser voices vary heavily
    const langMap: Record<Language, string> = {
       'English': 'en', 'Hindi': 'hi', 'Odia': 'or', 'Telugu': 'te', 'Bengali': 'bn'
    };
    utterance.lang = langMap[language];
    
    utterance.onend = () => setIsPlaying(false);
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  // Stop currently playing audio on unmount or mode switch
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      if (recognition && isListening) recognition.stop();
    };
  }, [activeMode]);

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col space-y-4">
      <div>
        <h1 className="text-3xl font-display font-bold text-white tracking-tight">AI Academic Assistant</h1>
        <p className="text-gray-400 mt-1">Ask questions, transcribe lectures, or listen to notes in {language}.</p>
      </div>

      <div className="flex bg-navy-800 p-1 rounded-lg border border-white/10 shrink-0 self-start">
        {['chat', 'voice-text', 'text-voice'].map(mode => (
          <button
            key={mode}
            onClick={() => setActiveMode(mode as any)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors capitalize ${
              activeMode === mode ? 'bg-navy-700 text-primary-500 shadow-sm' : 'text-gray-400 hover:text-white'
            }`}
          >
            {mode.replace('-', ' ')}
          </button>
        ))}
      </div>

      <div className="flex-1 glass-card rounded-2xl border border-white/10 flex flex-col overflow-hidden relative">
        
        {/* Chat Mode */}
        {activeMode === 'chat' && (
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl p-4 ${
                    msg.role === 'user' 
                      ? 'bg-accent/20 text-white border border-accent/20 rounded-tr-sm' 
                      : 'bg-navy-800 text-gray-200 border border-white/5 rounded-tl-sm'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-navy-800 rounded-2xl p-4 rounded-tl-sm border border-white/5 flex gap-2 items-center">
                    <span className="w-2 h-2 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            
            <div className="bg-navy-900 border-t border-white/5 flex flex-col">
              <div className="px-4 pt-4 pb-2 flex gap-2 overflow-x-auto no-scrollbar whitespace-nowrap">
                {[
                  "Show all attendance",
                  "Show all results",
                  "Any new internships?",
                  "When is my next exam?",
                  "Check my today's schedule"
                ].map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInputText(suggestion)}
                    className="px-3 py-1.5 bg-navy-800 hover:bg-navy-700 text-gray-300 text-xs rounded-full border border-white/10 transition-colors flex-shrink-0"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
              <div className="px-4 pb-4 flex gap-3">
                <input 
                  type="text" 
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendChat()}
                  placeholder={`Type your message in ${language}...`}
                  className="flex-1 glass-input px-4 py-3 rounded-xl text-sm"
                />
                <button 
                  onClick={handleSendChat}
                  disabled={!inputText.trim() || isTyping}
                  className="bg-primary-500 hover:bg-primary-400 disabled:bg-navy-800 disabled:text-gray-500 text-white p-3 rounded-xl transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        )}

        {/* Voice to Text Mode */}
        {activeMode === 'voice-text' && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="mb-8 relative user-select-none">
               {isListening && (
                 <div className="absolute inset-0 bg-accent/20 rounded-full animate-ping scale-150" />
               )}
               <button 
                 onClick={toggleListening}
                 className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-colors shadow-xl z-10 ${
                   isListening ? 'bg-red-500 text-white' : 'bg-navy-800 border-2 border-accent text-accent hover:bg-navy-700'
                 }`}
               >
                 {isListening ? <MicOff className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
               </button>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              {isListening ? `Listening in ${language}... Speak now.` : `Tap the mic to start dictating notes in ${language}.`}
            </p>
            <textarea 
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder="Your transcribed text will appear here..."
              className="w-full max-w-2xl h-48 glass-input p-4 rounded-xl resize-none text-sm leading-relaxed"
            />
          </div>
        )}

        {/* Text to Voice Mode */}
        {activeMode === 'text-voice' && (
          <div className="flex-1 p-8 flex flex-col h-full max-w-2xl mx-auto w-full">
            <div className="flex items-center gap-3 mb-6 bg-navy-800 p-4 rounded-xl border border-white/5">
              <Volume2 className="w-6 h-6 text-primary-500" />
              <p className="text-sm text-gray-300">Enter text below to hear it spoken aloud using your browser's TTS engine.</p>
            </div>
            
            <textarea 
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder={`Paste notes or text here to play audio in ${language}...`}
              className="flex-1 w-full glass-input p-6 rounded-xl resize-none text-lg leading-relaxed mb-6"
            />
            
            <button 
              onClick={() => handleTextToSpeech()}
              disabled={!inputText.trim()}
              className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-colors ${
                isPlaying 
                  ? 'bg-red-500 hover:bg-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.3)]' 
                  : 'bg-primary-500 hover:bg-primary-400 disabled:bg-navy-800 disabled:text-gray-500 text-white shadow-lg shadow-primary-500/25'
              }`}
            >
              {isPlaying ? <><StopCircle className="w-5 h-5" /> Stop Playback</> : <><Play className="w-5 h-5 fill-current" /> Read Aloud</>}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
