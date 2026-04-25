import { useState, useRef } from "react";
import { UploadCloud, File as FileIcon, AlertCircle } from "lucide-react";
import clsx from "clsx";
import { apiService } from "../services/apiService";

export default function UploadBox({ onUpload }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = async (files) => {
    const file = files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["application/pdf", "text/plain", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!validTypes.includes(file.type)) {
      setError("Please upload a PDF, TXT, or DOCX file");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Upload to backend
      const result = await apiService.uploadPDF(file);
      
      // Call onUpload callback with the result
      const docId = Date.now().toString();
      onUpload({
        id: docId,
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2) + " MB",
        date: new Date().toLocaleDateString(),
        chunks: result.chunks,
        textLength: result.textLength
      });
    } catch (err) {
      setError(err.message || "Upload failed");
      console.error("Upload error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div
        className={clsx(
          "w-full rounded-3xl border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-center py-16 cursor-pointer",
          isDragging
            ? "border-indigo-500 bg-indigo-500/10"
            : "border-slate-700 bg-white/[0.02] hover:bg-white/[0.04] hover:border-slate-600",
          isLoading && "opacity-60 cursor-not-allowed"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isLoading && fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={(e) => {
            if (e.target.files) handleFiles(e.target.files);
          }}
          accept=".pdf,.txt,.docx"
          disabled={isLoading}
        />
        
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
          {isLoading ? (
            <div className="animate-spin">⏳</div>
          ) : (
            <UploadCloud size={32} />
          )}
        </div>
        
        <h3 className="text-xl font-semibold text-white mb-2">
          {isLoading ? "Processing..." : "Drop your notes here"}
        </h3>
        <p className="text-slate-400 text-sm max-w-sm text-center">
          Support for PDFs, Word Docs, and Text files. We'll instantly process them for chatting and summaries.
        </p>
        
        <button 
          className={clsx(
            "mt-6 px-6 py-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors border border-slate-700 text-sm",
            isLoading && "opacity-50 cursor-not-allowed"
          )}
          disabled={isLoading}
        >
          {isLoading ? "Uploading..." : "Browse Files"}
        </button>
      </div>

      {error && (
        <div className="mt-4 p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-3">
          <AlertCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}
