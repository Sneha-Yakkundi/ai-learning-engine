import { useState, useRef, useEffect } from "react";
import { Network, Search, ZoomIn, ZoomOut, Maximize } from "lucide-react";
import { motion } from "framer-motion";
import { apiService } from "../services/apiService";

export default function ConceptGraph() {
  const [scale, setScale] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [graphReady, setGraphReady] = useState(false);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [error, setError] = useState(null);
  
  const containerRef = useRef(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const result = await apiService.generateConceptGraph();
      // Create flowchart layout with hierarchical positioning
      const positionedNodes = (result.nodes || []).map((node, i) => {
        let x, y;
        if (node.type === "main") {
          x = 450;
          y = 80;
        } else if (node.type === "sub") {
          const subIndex = i % 3;
          x = 150 + subIndex * 300;
          y = 250;
        } else {
          const detailIndex = i % 4;
          x = 100 + detailIndex * 220;
          y = 450;
        }
        return {
          ...node,
          x: node.x || x,
          y: node.y || y
        };
      });
      setNodes(positionedNodes);
      setEdges(result.edges || []);
      setGraphReady(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const zoomIn = () => setScale(s => Math.min(s + 0.2, 2));
  const zoomOut = () => setScale(s => Math.max(s - 0.2, 0.5));
  const resetZoom = () => setScale(1);

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Concept Graph</h1>
          <p className="text-slate-400">Visualize the relationships between topics in your documents.</p>
        </div>
        
        {!graphReady && (
          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white font-medium transition-all flex items-center gap-2"
          >
            {isGenerating ? "Analyzing..." : <><Network size={18} /> Generate Graph</>}
          </button>
        )}
      </div>

      {error && (
        <div className="glass-card rounded-2xl p-4 text-red-400 border border-red-500/30">
          Error: {error}
        </div>
      )}

      <div className="flex-1 glass-card rounded-3xl overflow-hidden relative border border-white/10 group">
        {!graphReady ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-[#181a20]/50">
            {isGenerating ? (
              <>
                <div className="relative w-24 h-24 mb-6">
                  <div className="absolute inset-0 border-4 border-emerald-500/20 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
                  <Network className="absolute inset-0 m-auto text-emerald-400" size={28} />
                </div>
                <h3 className="text-xl font-medium text-white mb-2">Mapping Concepts...</h3>
                <p className="text-slate-400">Extracting entities and building knowledge graph.</p>
              </>
            ) : (
              <>
                <Network size={48} className="text-white/10 mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">No graph generated</h3>
                <p className="text-slate-400 max-w-md">Click generate to map out the connections in your uploaded documents.</p>
              </>
            )}
          </div>
        ) : (
          <>
            {/* Controls */}
            <div className="absolute top-6 left-6 z-10 flex flex-col gap-2 bg-white/5 p-2 rounded-xl backdrop-blur-md border border-white/10">
              <button onClick={zoomIn} className="p-2 hover:bg-white/10 rounded-lg text-slate-300 transition-colors"><ZoomIn size={20} /></button>
              <button onClick={zoomOut} className="p-2 hover:bg-white/10 rounded-lg text-slate-300 transition-colors"><ZoomOut size={20} /></button>
              <button onClick={resetZoom} className="p-2 hover:bg-white/10 rounded-lg text-slate-300 transition-colors"><Maximize size={20} /></button>
            </div>
            
            {/* Search */}
            <div className="absolute top-6 right-6 z-10 bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 flex items-center gap-2 w-64">
              <Search size={16} className="text-slate-400" />
              <input type="text" placeholder="Search concept..." className="bg-transparent border-none outline-none text-sm text-white w-full" />
            </div>

            {/* Graph Canvas */}
            <div 
              ref={containerRef}
              className="w-full h-full overflow-hidden bg-slate-900/50 cursor-move"
              style={{
                backgroundImage: 'radial-gradient(circle at 10px 10px, rgba(255,255,255,0.05) 2px, transparent 0)',
                backgroundSize: '40px 40px'
              }}
            >
              <motion.div 
                className="w-[1000px] h-[800px] relative origin-center"
                drag
                dragConstraints={containerRef}
                animate={{ scale }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {/* Edges */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {edges.map((edge, i) => {
                    const sourceNode = nodes.find(n => n.id === edge.source);
                    const targetNode = nodes.find(n => n.id === edge.target);
                    if (!sourceNode || !targetNode) return null;
                    return (
                      <line 
                        key={i}
                        x1={sourceNode.x} 
                        y1={sourceNode.y} 
                        x2={targetNode.x} 
                        y2={targetNode.y} 
                        stroke="rgba(255,255,255,0.15)" 
                        strokeWidth="2" 
                      />
                    );
                  })}
                </svg>

                {/* Nodes */}
                {nodes.map((node) => {
                  let bgColor = "bg-slate-800";
                  let ringColor = "ring-slate-700";
                  let size = "w-32 h-12";
                  
                  if (node.type === "main") {
                    bgColor = "bg-emerald-600";
                    ringColor = "ring-emerald-400/50";
                    size = "w-40 h-14";
                  } else if (node.type === "sub") {
                    bgColor = "bg-indigo-600";
                    ringColor = "ring-indigo-400/50";
                  }

                  return (
                    <motion.div
                      key={node.id}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 ${size} ${bgColor} rounded-full flex items-center justify-center text-white font-medium text-sm shadow-xl ring-2 ${ringColor} hover:ring-4 cursor-pointer transition-all z-10 hover:scale-105`}
                      style={{ left: node.x, top: node.y }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: (node.id % 5) * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      {node.label}
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
