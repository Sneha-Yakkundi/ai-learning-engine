import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { BookOpenCheck, RotateCw, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { apiService } from "../services/apiService";

export default function Flashcards() {
  const [searchParams] = useSearchParams();
  const [isGenerating, setIsGenerating] = useState(false);
  const [flashcards, setFlashcards] = useState([]);
  const [hasFlashcards, setHasFlashcards] = useState(false);
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const result = await apiService.generateFlashcards();
      setFlashcards(result.flashcards || []);
      if (result.flashcards && result.flashcards.length > 0) {
        setHasFlashcards(true);
      } else {
        setError("No flashcards generated. Try again.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const nextCard = () => {
    if (currentCard < flashcards.length - 1) {
      setCurrentCard(c => c + 1);
      setIsFlipped(false);
    }
  };

  const prevCard = () => {
    if (currentCard > 0) {
      setCurrentCard(c => c - 1);
      setIsFlipped(false);
    }
  };

  const reset = () => {
    setCurrentCard(0);
    setIsFlipped(false);
    setHasFlashcards(false);
    setFlashcards([]);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Flashcards</h1>
          <p className="text-slate-400">Study with interactive flashcards made from your document.</p>
        </div>
        
        {!hasFlashcards && (
          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-medium transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.3)]"
          >
            {isGenerating ? (
              <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> Generating...</span>
            ) : (
              <><BookOpenCheck size={18} /> Generate Flashcards</>
            )}
          </button>
        )}
      </div>

      {error && (
        <div className="glass-card rounded-2xl p-4 text-red-400 border border-red-500/30">
          Error: {error}
        </div>
      )}

      {!hasFlashcards && !isGenerating && (
        <div className="border-2 border-dashed border-white/10 rounded-3xl p-16 text-center bg-white/[0.01]">
          <div className="w-16 h-16 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BookOpenCheck size={32} />
          </div>
          <h3 className="text-xl font-medium text-white mb-2">Ready to study</h3>
          <p className="text-slate-400 max-w-sm mx-auto mb-6">
            Click the button above to generate interactive flashcards for reviewing key concepts from your document.
          </p>
        </div>
      )}

      {isGenerating && (
        <div className="glass-card rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-6">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
            <BookOpenCheck className="absolute inset-0 m-auto text-blue-400" size={24} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-medium text-white">Generating Flashcards...</h3>
            <p className="text-slate-400 text-sm">Creating study cards from your document content.</p>
          </div>
        </div>
      )}

      {hasFlashcards && flashcards.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Card Counter and Progress */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-blue-400 font-medium">Card {currentCard + 1} of {flashcards.length}</span>
            <div className="flex-1 mx-4 h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-blue-500"
                initial={{ width: 0 }}
                animate={{ width: `${((currentCard + 1) / flashcards.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <span className="text-slate-400">{Math.round(((currentCard + 1) / flashcards.length) * 100)}%</span>
          </div>

          {/* Flashcard */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentCard}
              initial={{ rotateY: 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: -90, opacity: 0 }}
              transition={{ duration: 0.5 }}
              onClick={() => setIsFlipped(!isFlipped)}
              className="relative h-64 cursor-pointer perspective"
              style={{
                transformStyle: "preserve-3d",
              }}
            >
              <motion.div
                className="absolute inset-0 glass-card rounded-3xl p-8 flex flex-col items-center justify-center text-center"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6 }}
                style={{
                  transformStyle: "preserve-3d",
                }}
              >
                <div style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}>
                  <p className="text-slate-400 text-sm mb-4">Question</p>
                  <p className="text-2xl font-semibold text-white leading-relaxed">
                    {flashcards[currentCard].front}
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="absolute inset-0 glass-card rounded-3xl p-8 flex flex-col items-center justify-center text-center bg-blue-500/10"
                animate={{ rotateY: isFlipped ? 0 : 180 }}
                transition={{ duration: 0.6 }}
                style={{
                  transformStyle: "preserve-3d",
                }}
              >
                <div style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                  <p className="text-blue-400 text-sm mb-4">Answer</p>
                  <p className="text-xl font-medium text-white leading-relaxed">
                    {flashcards[currentCard].back}
                  </p>
                </div>
              </motion.div>

              {/* Click to flip hint */}
              {!isFlipped && (
                <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-slate-500">
                  Click to reveal answer
                </p>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex gap-4 justify-between items-center">
            <button
              onClick={prevCard}
              disabled={currentCard === 0}
              className="p-3 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-slate-300 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors"
            >
              {isFlipped ? "Hide Answer" : "Show Answer"}
            </button>

            <button
              onClick={nextCard}
              disabled={currentCard === flashcards.length - 1}
              className="p-3 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-slate-300 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Reset Button */}
          <button 
            onClick={reset}
            className="w-full px-6 py-2.5 rounded-full bg-slate-700/50 hover:bg-slate-700 text-white font-medium transition-all flex items-center justify-center gap-2"
          >
            <RotateCw size={18} /> Generate New Flashcards
          </button>
        </motion.div>
      )}
    </div>
  );
}
