import { User, ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className="h-16 shrink-0 border-b border-slate-800 bg-[#0f1115]/50 backdrop-blur-md flex items-center justify-between px-6 z-10">
      <div className="flex items-center gap-4">
        {!isHome && location.pathname !== "/dashboard" && (
          <button 
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="text-sm">Back</span>
          </button>
        )}
        <div className="text-sm font-medium text-slate-400">
          {location.pathname === "/dashboard" && "Dashboard"}
          {location.pathname.startsWith("/chat") && "Chat"}
          {location.pathname.startsWith("/summary") && "Summary"}
          {location.pathname.startsWith("/quiz") && "Quiz"}
          {location.pathname.startsWith("/graph") && "Concept Graph"}
          {location.pathname.startsWith("/flashcards") && "Flashcards"}
        </div>
      </div>
      
      <div className="flex items-center gap-4 text-slate-400">
        <button className="hover:text-white transition-colors">
          <User size={20} />
        </button>
      </div>
    </div>
  );
}