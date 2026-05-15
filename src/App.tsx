import { useState } from 'react';
import { clsx } from 'clsx';
import Analyzer from './components/Analyzer';
import Architecture from './components/Architecture';
import AboutUs from './components/AboutUs';

export default function App() {
  const [activeTab, setActiveTab] = useState<'analyzer' | 'architecture' | 'about'>('analyzer');

  return (
    <div className="w-full h-full min-h-screen bg-[#050505] text-slate-200 font-sans flex flex-col">
      {/* Header Navigation */}
      <nav className="h-16 border-b border-white/10 flex flex-wrap sm:flex-nowrap items-center justify-between px-4 sm:px-8 bg-black/40 backdrop-blur-md sticky top-0 z-50 shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setActiveTab('analyzer')}
            className="w-8 h-8 bg-blue-600 rounded-sm flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(37,99,235,0.5)] hover:scale-105 transition-transform cursor-pointer"
          >
            RL
          </button>
          <button 
            onClick={() => setActiveTab('analyzer')}
            className="text-lg font-medium tracking-tight uppercase hidden sm:inline-block cursor-pointer hover:text-blue-400 transition-colors"
          >
            RoomLens <span className="text-blue-400 font-bold tracking-widest">AI</span>
          </button>
        </div>

        <div className="flex gap-4 sm:gap-8 text-[10px] sm:text-xs font-semibold tracking-widest uppercase text-slate-400">
          <button
            onClick={() => setActiveTab('analyzer')}
            className={clsx(
              "cursor-pointer transition-colors pb-1 border-b-2",
              activeTab === 'analyzer' 
                ? "text-white border-blue-500" 
                : "border-transparent hover:text-white"
            )}
          >
            Scan Mode
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={clsx(
              "cursor-pointer transition-colors pb-1 border-b-2",
              activeTab === 'architecture' 
                ? "text-white border-blue-500" 
                : "border-transparent hover:text-white"
            )}
          >
            Vision & Strategy
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={clsx(
              "cursor-pointer transition-colors pb-1 border-b-2",
              activeTab === 'about' 
                ? "text-white border-blue-500" 
                : "border-transparent hover:text-white"
            )}
          >
            About Us
          </button>
        </div>
        
        <div className="hidden sm:flex gap-3 items-center">
          <button
            onClick={() => setActiveTab('analyzer')}
            className="px-4 py-1.5 rounded-full border border-white/20 text-[10px] uppercase tracking-tighter text-slate-300 hover:bg-white/5 cursor-pointer transition-colors"
          >
            AI Layout Engine
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8 flex flex-col h-full">
        {activeTab === 'analyzer' && <Analyzer />}
        {activeTab === 'architecture' && <Architecture />}
        {activeTab === 'about' && <AboutUs />}
      </main>
      
      {/* Bottom Status Bar */}
      <footer className="h-12 border-t border-white/10 bg-black/60 px-4 sm:px-8 flex items-center justify-between shrink-0 relative">
        <div className="flex items-center gap-2 flex-1">
          <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">Engine: AI Layout Engine</span>
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 text-[10px] font-mono tracking-widest text-slate-500 text-center">
          ROOMLENS AI &copy; 2026
        </div>
        <div className="flex items-center gap-2 flex-1 justify-end">
          <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase hidden sm:inline-block">Status: Online</span>
        </div>
      </footer>
    </div>
  );
}
