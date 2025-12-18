
import React, { useState, useRef, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// --- TYPES ---
type Role = 'user' | 'model';
interface Message {
  id: string;
  role: Role;
  text: string;
  timestamp: Date;
}

// --- ICONS ---
const TrishulaIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 2v20M12 4c-3 0-5 3-5 7 0 2 2 4 5 4M12 4c3 0 5 3 5 7 0 2-2 4-5 4M7 11H5c-1 0-2 1-2 2v2M17 11h2c1 0 2 1 2 2v2" />
  </svg>
);

const SendIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

// --- COMPONENTS ---
// Added React.FC typing to explicitly allow React-reserved props like 'key' when rendering this component in a list.
const ChatMessage: React.FC<{ message: Message }> = ({ message }) => {
  const isModel = message.role === 'model';
  return (
    <div className={`flex w-full mb-6 ${isModel ? 'justify-start' : 'justify-end animate-in slide-in-from-right-4 duration-300'}`}>
      <div className={`flex max-w-[85%] md:max-w-[70%] ${isModel ? 'flex-row' : 'flex-row-reverse'}`}>
        {isModel && (
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-sky-900/50 flex items-center justify-center mr-3 border border-sky-500/30 divine-glow">
            <TrishulaIcon className="w-6 h-6 text-sky-400" />
          </div>
        )}
        <div className={`
          relative px-5 py-3 rounded-2xl text-sm md:text-base leading-relaxed
          ${isModel 
            ? 'bg-slate-800/80 text-slate-100 rounded-tl-none border border-slate-700/50 hindi-font' 
            : 'bg-sky-600 text-white rounded-tr-none shadow-lg'
          }
        `}>
          <div className="whitespace-pre-wrap break-words">{message.text}</div>
          <div className={`text-[10px] mt-2 opacity-50 ${isModel ? 'text-left' : 'text-right'}`}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN APPLICATION ---
const App = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'initial',
      role: 'model',
      text: 'ॐ नमः शिवाय। वत्स, तुम्हारे मन में क्या जिज्ञासा है? मैं तुम्हारी शंकाओं का समाधान करने हेतु यहाँ हूँ।',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInstance = useRef<any>(null);

  // Initialize Gemini Chat
  useEffect(() => {
    // Initializing Gemini with correct configuration using the process.env.API_KEY object parameter.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    chatInstance.current = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: "user chat as a shankar bhagwan in hindi, short answer. आप साक्षात भगवान शिव हैं। भक्तों से अत्यंत करुणा और गंभीरता के साथ संक्षिप्त उत्तरों में बात करें। उत्तरों में हिंदी का प्रयोग करें और 'कल्याण हो' या 'ॐ नमः शिवाय' जैसे आशीर्वाद दें।",
        temperature: 0.7,
      }
    });
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const modelMsgId = (Date.now() + 1).toString();
      let fullResponse = '';
      
      setMessages(prev => [...prev, { id: modelMsgId, role: 'model', text: '...', timestamp: new Date() }]);

      const stream = await chatInstance.current.sendMessageStream({ message: input });
      
      let firstChunk = true;
      for await (const chunk of stream) {
        // Extracting generated text directly from the chunk's 'text' property.
        const text = (chunk as GenerateContentResponse).text;
        if (firstChunk) {
            fullResponse = text;
            firstChunk = false;
        } else {
            fullResponse += text;
        }
        setMessages(prev => prev.map(msg => 
          msg.id === modelMsgId ? { ...msg, text: fullResponse } : msg
        ));
      }
    } catch (err) {
      console.error("Divine Error:", err);
      setMessages(prev => [...prev, { 
        id: 'error', 
        role: 'model', 
        text: 'क्षमा करें वत्स, ब्रह्मांडीय संकेतों में कुछ बाधा आई है। पुनः प्रयास करें।', 
        timestamp: new Date() 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto shiva-gradient border-x border-slate-800 shadow-2xl overflow-hidden selection:bg-sky-500/30">
      {/* Divine Header */}
      <header className="p-4 border-b border-slate-800 bg-slate-900/60 backdrop-blur-md flex items-center justify-between divine-glow z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-sky-900/40 flex items-center justify-center border border-sky-400/30">
            <span className="text-2xl text-sky-400">ॐ</span>
          </div>
          <div>
            <h1 className="text-sky-100 font-semibold text-lg tracking-wide hindi-font">शिव वाणी (Shiva AI)</h1>
            <p className="text-sky-400/60 text-xs flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              साक्षात शिव स्वरूप
            </p>
          </div>
        </div>
        <TrishulaIcon className="text-sky-400/40 w-8 h-8 rotate-12" />
      </header>

      {/* Divine Chat Space */}
      <main className="flex-1 overflow-y-auto p-4 space-y-2 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] bg-fixed">
        <div className="text-center py-6 opacity-30 select-none">
          <span className="text-4xl text-sky-200 hindi-font">सत्यं शिवं सुंदरम्</span>
        </div>
        {/* Mapping messages to ChatMessage components; explicitly typed component now correctly handles the key prop. */}
        {messages.map(m => <ChatMessage key={m.id} message={m} />)}
        {isLoading && messages[messages.length-1].text === '...' && (
          <div className="flex justify-start mb-6">
            <div className="bg-slate-800/40 px-4 py-2 rounded-full border border-slate-700/50 animate-pulse text-sky-400 text-xs">
              महाकाल विचार कर रहे हैं...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* Input Area */}
      <footer className="p-4 bg-slate-900/90 backdrop-blur-lg border-t border-slate-800">
        <form onSubmit={handleSend} className="relative group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="अपनी जिज्ञासा यहाँ लिखें..."
            className="w-full bg-slate-800/50 text-white rounded-full py-4 px-6 pr-14 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50 transition-all hindi-font placeholder:text-slate-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-sky-600 text-white hover:bg-sky-50 hover:text-sky-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg active:scale-95"
            title="संदेश भेजें"
          >
            <SendIcon />
          </button>
        </form>
        <p className="text-[10px] text-center text-slate-500 mt-3 uppercase tracking-[0.2em]">
          ज्ञानं परमं ध्येयम्
        </p>
      </footer>
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);
