import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Send, FileText, AlertCircle } from "lucide-react";
import ChatMessage from "../components/ChatMessage";
import Loader from "../components/Loader";
import { apiService } from "../services/apiService";

export default function Chat() {
  const { docId } = useParams();
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      content: "Hello! I've analyzed your document. What would you like to know about it? Ask me anything!"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    const userMsg = { id: Date.now(), role: "user", content: userMessage };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);
    setError("");

    try {
      // Call the backend API
      const response = await apiService.askQuestion(userMessage);
      
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: response.answer
        }
      ]);
    } catch (err) {
      setError(err.message);
      console.error("Chat error:", err);
      
      // Add error message to chat
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: `⚠️ Error: ${err.message}. Please try again or contact support.`
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full gap-6">
      
      {/* Left Panel: Document Context */}
      <div className="hidden lg:flex w-80 shrink-0 flex-col gap-4">
        <div className="glass-card p-5 rounded-2xl h-full flex flex-col">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <FileText size={18} className="text-indigo-400" /> Reference Material
          </h2>
          
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 mb-4">
            <h3 className="text-sm font-medium text-white mb-1">Active Document</h3>
            <p className="text-xs text-slate-400 truncate">Document ID: {docId}</p>
            <p className="text-xs text-slate-500 mt-2">Connected to backend API</p>
          </div>

          <div className="flex-1 overflow-auto pr-2 custom-scrollbar text-sm text-slate-400 space-y-4">
            <p className="text-indigo-400 text-xs font-medium">💡 Tips:</p>
            <p className="text-xs">• Ask specific questions about your document</p>
            <p className="text-xs">• The AI reads from your uploaded PDF content</p>
            <p className="text-xs">• Get summaries, explanations, and insights</p>
            <p className="text-xs">• Verify important information in the original</p>
          </div>
        </div>
      </div>

      {/* Right Panel: Chat Interface */}
      <div className="flex-1 flex flex-col glass-card rounded-2xl overflow-hidden relative">
        
        {/* Header */}
        <div className="h-16 border-b border-white/5 flex items-center px-6 shrink-0 bg-white/[0.01]">
          <h2 className="font-medium text-white">💬 Chat with Your PDF</h2>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-auto p-6 scroll-smooth">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          {isLoading && (
            <div className="flex justify-start mb-6 w-full">
              <Loader />
            </div>
          )}
          {error && (
            <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-2">
              <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white/[0.01] border-t border-white/5">
          <form 
            onSubmit={handleSend}
            className="flex items-center gap-2 max-w-4xl mx-auto bg-slate-900/50 border border-slate-700/50 rounded-2xl p-2 focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/50 transition-all"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your PDF..."
              className="flex-1 bg-transparent border-none outline-none text-white px-4 py-2 placeholder:text-slate-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="w-10 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 flex items-center justify-center text-white transition-colors"
            >
              <Send size={18} className={input.trim() ? "ml-0.5" : ""} />
            </button>
          </form>
          <p className="text-center text-[11px] text-slate-500 mt-3">
            Powered by OpenRouter AI • Verify important information with your original document
          </p>
        </div>
      
      </div>
    </div>
  );
}
