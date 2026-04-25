import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  MessageSquare, 
  FileText, 
  BrainCircuit, 
  Network
} from "lucide-react";
import clsx from "clsx";

export default function Sidebar() {
  const links = [
    { name: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
    { name: "Chat", to: "/chat/demo", icon: MessageSquare }, // In a real app we'd hide this until a doc is selected
    { name: "Summary", to: "/summary", icon: FileText },
    { name: "Quiz", to: "/quiz", icon: BrainCircuit },
    { name: "Graph", to: "/graph", icon: Network },
  ];

  return (
    <div className="w-64 h-screen border-r border-[#334155] bg-[#0f1115]/80 backdrop-blur-xl flex flex-col pt-8 p-4 shrink-0">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
          <BrainCircuit size={20} />
        </div>
        <span className="font-bold text-lg text-white tracking-tight">NotebookLM++</span>
      </div>

      <nav className="flex flex-col gap-2">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.name}
              to={link.to}
              className={({ isActive }) =>
                clsx(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 font-medium",
                  isActive
                    ? "bg-indigo-500/10 text-indigo-400 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] border border-indigo-500/20"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                )
              }
            >
              <Icon size={18} />
              {link.name}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
