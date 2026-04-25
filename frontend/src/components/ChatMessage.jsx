import { User, BrainCircuit } from "lucide-react";
import clsx from "clsx";

export default function ChatMessage({ message }) {
  const isUser = message.role === "user";

  return (
    <div className={clsx("flex w-full mb-6", isUser ? "justify-end" : "justify-start")}>
      <div className={clsx("flex max-w-[80%] gap-4", isUser ? "flex-row-reverse" : "flex-row")}>
        
        {/* Avatar */}
        <div className="shrink-0 mt-1">
          {isUser ? (
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-300">
              <User size={16} />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]">
              <BrainCircuit size={16} />
            </div>
          )}
        </div>

        {/* Bubble */}
        <div 
          className={clsx(
            "p-4 rounded-2xl text-[15px] leading-relaxed",
            isUser 
              ? "bg-indigo-600 text-white rounded-tr-none shadow-sm"
              : "bg-slate-800/80 text-slate-200 rounded-tl-none ring-1 ring-white/5 backdrop-blur-sm"
          )}
        >
          {message.content}
        </div>
      </div>
    </div>
  );
}
