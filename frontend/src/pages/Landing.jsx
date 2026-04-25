import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BrainCircuit, Sparkles, Zap, Shield, ChevronRight } from "lucide-react";

export default function Landing() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-[#0f1115] text-slate-200 overflow-hidden relative">
      {/* Background Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 blur-[100px] rounded-full" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <BrainCircuit size={24} />
          </div>
          <span className="font-bold text-2xl tracking-tight text-white">NotebookLM++</span>
        </div>
        <Link 
          to="/dashboard"
          className="px-6 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 font-medium transition-all"
        >
          Sign In
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-24 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto space-y-8"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-sm font-medium mb-4">
            <Sparkles size={16} />
            <span>The ultimate AI study companion</span>
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-6xl md:text-8xl font-bold tracking-tight text-white leading-tight">
            AI that understands <br/>
            <span className="text-gradient">YOUR notes</span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Upload your documents, lectures, and PDFs. Get instant summaries, custom quizzes, and deep-dive chats trained exactly on your material.
          </motion.p>
          
          <motion.div variants={itemVariants} className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/dashboard"
              className="px-8 py-4 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium flex items-center gap-2 transition-all shadow-[0_0_40px_rgba(79,70,229,0.4)]"
            >
              Get Started for Free <ChevronRight size={20} />
            </Link>
            <button className="px-8 py-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-all">
              View Demo
            </button>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 text-left"
        >
          <FeatureCard 
            icon={<BrainCircuit className="text-purple-400" size={24} />}
            title="Context-Aware Chat"
            desc="Chat with your documents seamlessly. No hallucinations, only facts pulled directly from what you upload."
          />
          <FeatureCard 
            icon={<Zap className="text-amber-400" size={24} />}
            title="Instant Summaries & Quizzes"
            desc="Turn pages of reading into bite-sized study cards and test your knowledge with auto-generated quizzes."
          />
          <FeatureCard 
            icon={<Shield className="text-emerald-400" size={24} />}
            title="Private & Secure"
            desc="Your notes remain yours. Our isolated study environments ensure that your proprietary data never leaks."
          />
        </motion.div>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="glass-card p-8 rounded-3xl border border-white/5 hover:border-indigo-500/30 transition-all group">
      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-slate-400 leading-relaxed">
        {desc}
      </p>
    </div>
  );
}
