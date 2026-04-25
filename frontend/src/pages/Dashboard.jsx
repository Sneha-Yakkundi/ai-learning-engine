import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, MessageSquare, BrainCircuit, Network, Trash2 } from "lucide-react";
import UploadBox from "../components/UploadBox";

export default function Dashboard() {
  const [documents, setDocuments] = useState([]);

  const handleUpload = (newDoc) => {
    setDocuments([newDoc, ...documents]);
  };

  const removeDoc = (id) => {
    setDocuments(documents.filter(d => d.id !== id));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Your Dashboard</h1>
        <p className="text-slate-400">Upload PDFs to start learning with AI-powered analysis and chat.</p>
      </div>

      <UploadBox onUpload={handleUpload} />

      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">
            Uploaded Documents ({documents.length})
          </h2>
        </div>
        
        {documents.length === 0 ? (
          <div className="text-center py-20 bg-white/[0.02] border border-white/5 rounded-3xl">
            <p className="text-slate-500 mb-2">No documents uploaded yet</p>
            <p className="text-slate-600 text-sm">Upload a PDF above to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence>
              {documents.map((doc) => (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={doc.id}
                  className="glass-card p-5 rounded-2xl flex flex-col group relative overflow-hidden hover:border-indigo-500/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                        <FileText size={20} className="text-indigo-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-white truncate group-hover:text-indigo-400 transition-colors">
                          {doc.name}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">
                          {doc.size}
                        </p>
                        {doc.chunks && (
                          <p className="text-xs text-slate-500 mt-2">
                            ✓ {doc.chunks} chunks • {doc.textLength} chars
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => removeDoc(doc.id)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-auto pt-3">
                    <Link
                      to={`/chat/${doc.id}`}
                      className="flex items-center justify-center gap-2 py-2 px-2 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 text-xs font-medium transition-colors"
                    >
                      <MessageSquare size={14} /> Chat
                    </Link>
                    <Link
                      to={`/summary?doc=${doc.id}`}
                      className="flex items-center justify-center gap-2 py-2 px-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-medium transition-colors"
                    >
                      <FileText size={14} /> Summary
                    </Link>
                    <Link
                      to={`/quiz?doc=${doc.id}`}
                      className="flex items-center justify-center gap-2 py-2 px-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-xs font-medium transition-colors"
                    >
                      <BrainCircuit size={14} /> Quiz
                    </Link>
                    <Link
                      to={`/graph?doc=${doc.id}`}
                      className="flex items-center justify-center gap-2 py-2 px-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-xs font-medium transition-colors"
                    >
                      <Network size={14} /> Graph
                    </Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
