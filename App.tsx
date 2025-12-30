
import React, { useState, useRef, useEffect } from 'react';
// @ts-ignore
import ReactMarkdown from 'react-markdown';
// @ts-ignore
import remarkGfm from 'remark-gfm';
import Navbar from './components/Navbar';
import { Message, IndicLanguage } from './types';
import { generateFundingInsights } from './services/geminiService';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState<IndicLanguage>(IndicLanguage.ENGLISH);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [errorStatus, setErrorStatus] = useState<'none' | 'key_missing' | 'key_invalid' | 'generic'>('none');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Speech recognition is not available in your browser.");
      return;
    }
    // @ts-ignore
    const recognition = new webkitSpeechRecognition();
    
    // Map IndicLanguage to speech recognition codes
    const langMap: Record<string, string> = {
      [IndicLanguage.HINDI]: 'hi-IN',
      [IndicLanguage.TAMIL]: 'ta-IN',
      [IndicLanguage.TELUGU]: 'te-IN',
      [IndicLanguage.BENGALI]: 'bn-IN',
      [IndicLanguage.MARATHI]: 'mr-IN',
      [IndicLanguage.GUJARATI]: 'gu-IN',
      [IndicLanguage.KANNADA]: 'kn-IN',
      [IndicLanguage.MALAYALAM]: 'ml-IN',
      [IndicLanguage.PUNJABI]: 'pa-IN',
      [IndicLanguage.ENGLISH]: 'en-IN'
    };

    recognition.lang = langMap[language] || 'en-IN';
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (e: any) => setInput(e.results[0][0].transcript);
    recognition.start();
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMsg: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setErrorStatus('none');

    try {
      const response = await generateFundingInsights(input, language, messages);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response.text, 
        sources: response.sources 
      }]);
    } catch (e: any) {
      console.error(e);
      if (e.message === "API_KEY_MISSING") setErrorStatus('key_missing');
      else if (e.message === "API_KEY_INVALID") setErrorStatus('key_invalid');
      else setErrorStatus('generic');
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm having trouble connecting to the intelligence network. Please check your environment configuration." 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col font-sans">
      <Navbar />

      {errorStatus !== 'none' && (
        <div className="fixed top-16 left-0 right-0 z-40 bg-red-50 border-b border-red-100 py-2 px-6 flex justify-center animate-in slide-in-from-top duration-300">
          <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest flex items-center gap-2">
            <i className="fas fa-exclamation-triangle"></i>
            {errorStatus === 'key_missing' ? "API KEY NOT FOUND. PLEASE SET PROCESS.ENV.API_KEY." : 
             errorStatus === 'key_invalid' ? "INVALID API KEY. CHECK YOUR GOOGLE AI STUDIO CREDENTIALS." :
             "CONNECTION ERROR. PLEASE TRY REFRESHING."}
          </p>
        </div>
      )}
      
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 pt-24 pb-40 flex flex-col">
        <div className="flex-1 space-y-10">
          {messages.length === 0 && (
            <div className="py-24 text-center space-y-8 max-w-lg mx-auto animate-in fade-in duration-1000">
              <div className="w-20 h-20 bg-white rounded-[2.5rem] shadow-xl shadow-indigo-100 flex items-center justify-center mx-auto border border-slate-50">
                <i className="fas fa-rocket text-indigo-500 text-2xl"></i>
              </div>
              <div className="space-y-3">
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Genify Intelligence</h1>
                <p className="text-slate-500 text-base leading-relaxed">
                  Real-time grounded insights into the Indian startup ecosystem. High-fidelity intelligence in your preferred language.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-6">
                {[
                  "Active SaaS VCs in India 2024",
                  "Latest funding rounds in Bengaluru",
                  "Startup India tax exemptions",
                  "Top Fintech angel investors in Mumbai"
                ].map((hint, i) => (
                  <button 
                    key={i}
                    onClick={() => {
                      setInput(hint);
                      // Automatic trigger on hint click
                    }}
                    className="p-4 bg-white border border-slate-100 rounded-2xl text-xs font-semibold text-slate-600 hover:border-indigo-400 hover:text-indigo-600 transition-all text-left shadow-sm group flex justify-between items-center"
                  >
                    {hint}
                    <i className="fas fa-chevron-right text-[10px] opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0"></i>
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, idx) => (
            <div 
              key={idx} 
              className={`flex items-start gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500`}
            >
              <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                m.role === 'user' ? 'bg-slate-200' : 'bg-indigo-600'
              }`}>
                <i className={`text-[10px] text-white fas ${m.role === 'user' ? 'fa-user text-slate-500' : 'fa-brain'}`}></i>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                  {m.role === 'user' ? 'Direct Query' : 'Genify Intelligence'}
                </p>
                <div className={`text-[15px] leading-relaxed text-slate-800 ${m.role === 'assistant' ? 'bg-white p-6 rounded-2xl shadow-sm border border-slate-100 prose' : 'font-medium'}`}>
                  {m.role === 'assistant' ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {m.content}
                    </ReactMarkdown>
                  ) : (
                    m.content
                  )}
                </div>

                {m.sources && m.sources.length > 0 && (
                  <div className="mt-6 space-y-3 animate-in fade-in duration-700 delay-300">
                    <div className="flex items-center gap-2">
                      <span className="h-[1px] flex-1 bg-slate-100"></span>
                      <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Grounding Sources</span>
                      <span className="h-[1px] flex-1 bg-slate-100"></span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {m.sources.map((s, si) => (
                        <a 
                          key={si} 
                          href={s.uri} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-100 rounded-lg hover:border-indigo-200 hover:bg-indigo-50/30 transition-all group"
                        >
                          <i className="fas fa-external-link-alt text-[8px] text-slate-300 group-hover:text-indigo-500"></i>
                          <span className="text-[10px] font-bold text-slate-600 truncate max-w-[150px]">{s.title}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex items-start gap-4 animate-pulse">
              <div className="w-8 h-8 bg-slate-100 rounded-full flex-shrink-0"></div>
              <div className="flex-1 space-y-2">
                <div className="h-3 w-20 bg-slate-100 rounded-full"></div>
                <div className="h-20 w-full bg-white rounded-2xl border border-slate-100"></div>
              </div>
            </div>
          )}
          <div ref={scrollRef} className="h-1" />
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#F8F9FB] via-[#F8F9FB] to-transparent pointer-events-none">
          <div className="max-w-3xl mx-auto pointer-events-auto">
            <div className="bg-white rounded-2xl shadow-2xl shadow-indigo-100/50 border border-slate-200 p-2 flex items-center gap-2 group transition-all focus-within:ring-4 focus-within:ring-indigo-500/5">
              
              <div className="relative pl-2">
                <select 
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as IndicLanguage)}
                  className="bg-slate-50 text-[10px] font-bold uppercase tracking-widest py-2 px-4 rounded-xl border-none outline-none cursor-pointer text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all appearance-none"
                >
                  {Object.values(IndicLanguage).map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[8px] text-slate-400">
                  <i className="fas fa-chevron-down"></i>
                </div>
              </div>

              <div className="h-8 w-[1px] bg-slate-100 mx-1"></div>

              <input 
                type="text"
                autoFocus
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={isListening ? "Listening closely..." : `Ask Genify in ${language.split(' ')[0]}...`}
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium text-slate-700 placeholder:text-slate-300 py-3 px-2"
              />

              <div className="flex items-center gap-1.5 pr-1">
                <button 
                  onClick={handleVoiceInput}
                  disabled={loading}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    isListening ? 'bg-indigo-600 text-white voice-active shadow-lg shadow-indigo-200' : 'text-slate-400 hover:bg-slate-50'
                  }`}
                  title="Voice Input"
                >
                  <i className={`fas ${isListening ? 'fa-stop-circle' : 'fa-microphone'} text-xs`}></i>
                </button>
                <button 
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-100 disabled:text-slate-300 text-white w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-lg shadow-indigo-100 active:scale-95"
                >
                  <i className="fas fa-paper-plane text-[10px]"></i>
                </button>
              </div>
            </div>
            
            <div className="mt-4 flex justify-between items-center px-4 text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">
              <div className="flex gap-4">
                <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div> System Online</span>
                <span>Grounding: Active</span>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setMessages([])} className="hover:text-slate-600 transition-colors">Reset Session</button>
                <span className="text-slate-100">|</span>
                <span>Gemini 3.0 Flash</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="text-center py-8 border-t border-slate-100 opacity-50 bg-white/30">
        <p className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase">
          Genify AI • Real-time Multilingual Intelligence • Indian Startup Ecosystem
        </p>
      </footer>
    </div>
  );
};

export default App;
