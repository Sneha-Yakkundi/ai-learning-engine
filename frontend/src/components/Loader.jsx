import { motion } from "framer-motion";

export default function Loader() {
  return (
    <div className="flex items-center space-x-1.5 p-4 rounded-2xl bg-slate-800/50 w-fit rounded-tl-none ring-1 ring-white/5">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 bg-indigo-400 rounded-full"
          animate={{
            y: ["0%", "-50%", "0%"],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.15,
          }}
        />
      ))}
    </div>
  );
}
