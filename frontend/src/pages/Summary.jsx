import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FileText, Wand2 } from "lucide-react";
import { motion } from "framer-motion";
import { apiService } from "../services/apiService";

export default function Summary() {
  const [searchParams] = useSearchParams();
  const docId = searchParams.get("doc") || "demo";
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const result = await apiService.generateSummary();
      setSummary(result.summary);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Smart Summary</h1>
          <p className="text-slate-400">Generate an AI-powered digest of your document.</p>
        </div>
        
        {!summary && (
          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-medium transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(79,70,229,0.3)]"
          >
            {isGenerating ? (
              <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> Generating...</span>
            ) : (
              <><Wand2 size={18} /> Generate Summary</>
            )}
          </button>
        )}
      </div>

      {error && (
        <div className="glass-card rounded-2xl p-4 text-red-400 border border-red-500/30">
          Error: {error}
        </div>
      )}

      {!summary && !isGenerating && (
        <div className="border-2 border-dashed border-white/10 rounded-3xl p-16 text-center bg-white/[0.01]">
          <div className="w-16 h-16 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileText size={32} />
          </div>
          <h3 className="text-xl font-medium text-white mb-2">Ready to summarize</h3>
          <p className="text-slate-400 max-w-sm mx-auto mb-6">
            Click the button above to extract key insights and generate a comprehensive summary of your document.
          </p>
        </div>
      )}

      {isGenerating && (
        <div className="glass-card rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-6">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
            <Wand2 className="absolute inset-0 m-auto text-indigo-400" size={24} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-medium text-white">Analyzing Document...</h3>
            <p className="text-slate-400 text-sm">Extracting key concepts and generating summary.</p>
          </div>
        </div>
      )}

      {summary && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 text-left"
        >
          <div className="glass-card rounded-3xl p-8">
            <h2 className="text-xl font-bold text-white mb-6 border-b border-white/5 pb-4">Document Summary</h2>
            <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed space-y-4 whitespace-pre-wrap">
              {summary}
            </div>
          </div>

          <button 
            onClick={() => setSummary(null)}
            className="px-6 py-2.5 rounded-full bg-slate-700/50 hover:bg-slate-700 text-white font-medium transition-all"
          >
            Generate New Summary
          </button>
        </motion.div>
      )}
    </div>
  );
}
