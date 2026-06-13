import React, { useState, useRef, useEffect } from "react";
import { 
  Sparkles, 
  Send, 
  Trash2, 
  Bot, 
  User, 
  TrendingUp, 
  Building, 
  Calculator, 
  PieChart 
} from "lucide-react";
import { ChatMessage } from "../types";

interface AiAssistantProps {
  chatHistory: ChatMessage[];
  onSendMessage: (text: string) => Promise<string>;
  onClearHistory: () => void;
  loading: boolean;
}

export default function AiAssistantTab({
  chatHistory,
  onSendMessage,
  onClearHistory,
  loading
}: AiAssistantProps) {
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest chat node
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || loading) return;

    const textToSend = inputText;
    setInputText("");
    await onSendMessage(textToSend);
  };

  // Quick prompt buttons suggestions
  const SUGGESTED_QUESTIONS = [
    { text: "What are the primary investment indicators for Westside Hills?", label: "Market Advice", icon: <TrendingUp className="h-3.5 w-3.5 text-blue-500" /> },
    { text: "How does property age weight affect depreciation in apartment prices?", label: "Depreciation rules", icon: <Building className="h-3.5 w-3.5 text-emerald-500" /> },
    { text: "Help me calculate 5-year CAGR appreciation for $450K homes.", label: "Calculate Appreciation", icon: <Calculator className="h-3.5 w-3.5 text-amber-500" /> },
    { text: "Explain why XGBoost yields high predictive efficiency.", label: "Algorithm Intel", icon: <PieChart className="h-3.5 w-3.5 text-sky-500" /> }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-20">
      
      {/* Informational intro card */}
      <div className="lg:col-span-4 space-y-4">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800/80 p-4 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-50 dark:bg-blue-950/40 rounded-lg text-blue-600 dark:text-blue-450">
              <Bot className="h-5.5 w-5.5" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white font-display">Gemini Advisor Assistant</h2>
              <span className="text-[10px] text-blue-500 font-bold uppercase tracking-wider block mt-0.5">Active Copilot</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 leading-normal font-sans">
            Let our Gemini AI analyze pricing ratios, mortgage selections, or recommend suburbs optimized for your target budget.
          </p>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* Prompt card recommendations */}
          <div className="space-y-2">
            <span className="text-[9px] font-bold text-slate-400 tracking-wider uppercase block">Suggested Prompt Queries</span>
            <div className="grid grid-cols-1 gap-1.5">
              {SUGGESTED_QUESTIONS.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => setInputText(q.text)}
                  className="flex items-start gap-2 p-2.5 rounded-lg border border-slate-150 dark:border-slate-850 hover:border-blue-500/30 hover:bg-blue-50/5 dark:hover:bg-slate-950/20 text-left transition-all cursor-pointer"
                >
                  <div className="mt-0.5 shrink-0">{q.icon}</div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider">{q.label}</span>
                    <p className="text-[11px] text-slate-705 dark:text-slate-350 line-clamp-2 mt-0.5 font-semibold leading-normal">{q.text}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main chat window portion */}
      <div className="lg:col-span-8 flex flex-col h-[520px] bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm overflow-hidden justify-between">
        
        {/* Chat header */}
        <div className="flex justify-between items-center px-4 py-3 border-b border-slate-100 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950/25">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10.5px] font-extrabold text-slate-800 dark:text-white uppercase tracking-wider leading-none font-display">Investments Intelligence Channel</span>
          </div>

          <button 
            onClick={onClearHistory}
            className="p-1 px-1.5 rounded-lg border border-slate-200 dark:border-slate-850 hover:bg-red-50 text-slate-400 hover:text-red-500 cursor-pointer"
            title="Clear Chat Room Logs"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        {/* Chat Conversation Stream scroll wrapper */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {chatHistory.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <Sparkles className="h-8 w-8 text-blue-400 mb-2 animate-pulse" />
              <h4 className="text-xs font-bold text-slate-300">Prompt Gemini Advisor</h4>
              <p className="text-[11px] text-slate-400 mt-0.5 max-w-sm leading-normal">
                Initiate a message regarding structural variables, pricing, regional margins, or click an advice helper template on the left.
              </p>
            </div>
          ) : (
            chatHistory.map((msg) => {
              const isBot = msg.role === "model";
              return (
                <div 
                  key={msg.id} 
                  className={`flex gap-2.5 max-w-[85%] ${isBot ? "self-start mr-auto" : "self-end ml-auto flex-row-reverse"}`}
                >
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center border shrink-0 ${isBot ? "bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-950 dark:border-blue-900" : "bg-slate-50 border-slate-205 text-slate-600 dark:bg-slate-850"}`}>
                    {isBot ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                  </div>

                  <div className={`p-3 rounded-xl text-xs leading-relaxed font-semibold ${isBot ? "bg-slate-50 border border-slate-150 text-slate-800 dark:bg-slate-950/40 dark:border-slate-850 text-slate-250 rounded-tl-none" : "bg-blue-600 text-white rounded-tr-none shadow-sm shadow-blue-500/10"}`}>
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    <span className={`text-[9px] block mt-1.5 text-right font-mono ${isBot ? "text-slate-400" : "text-blue-100"}`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })
          )}
          {loading && (
            <div className="flex gap-2.5 max-w-[85%] self-start mr-auto">
              <div className="h-8 w-8 rounded-lg bg-blue-50 border border-blue-200 text-blue-600 dark:bg-blue-950 dark:border-blue-900 flex items-center justify-center shrink-0">
                <Bot className="h-4 w-4 animate-pulse" />
              </div>
              <div className="bg-slate-50 border border-slate-150 text-slate-800 dark:bg-slate-950/40 dark:border-slate-850 p-3 rounded-xl rounded-tl-none flex items-center gap-2">
                <span className="flex gap-1">
                  <span className="h-1 w-1 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0ms" }}></span>
                  <span className="h-1 w-1 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "150ms" }}></span>
                  <span className="h-1 w-1 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "300ms" }}></span>
                </span>
                <span className="text-[10px] text-slate-400 font-bold select-none">Advisor is preparing advice...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Action Form Footer */}
        <form onSubmit={handleSubmit} className="p-3.5 border-t border-slate-100 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950/25 flex gap-2">
          <input 
            id="txt_chat_prompt"
            type="text" 
            placeholder="Inquire regarding property predictions or calculations..." 
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            className="flex-1 text-slate-950 dark:text-white px-3 py-2 rounded-lg border border-slate-205 dark:border-slate-800 bg-white text-xs font-semibold focus:ring-1 focus:ring-blue-500 outline-none"
            required
            disabled={loading}
          />
          <button 
            id="btn_send_chat"
            type="submit" 
            disabled={loading || !inputText.trim()}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center cursor-pointer"
          >
            <Send className="h-3.5 w-3.5 text-white" />
          </button>
        </form>

      </div>

    </div>
  );
}
