
import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 w-8 h-8 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-100">
            <i className="fas fa-sparkles text-white text-[12px]"></i>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-slate-900">
              Genify
            </span>
            <span className="text-[10px] font-medium text-slate-400">
              Intelligence Engine
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full border border-green-100">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
            <span className="text-[10px] font-semibold text-green-700 uppercase tracking-wider">Live System</span>
          </div>
          <div className="h-4 w-[1px] bg-slate-200 hidden md:block"></div>
          <span className="text-[11px] font-medium text-slate-500 hover:text-indigo-600 cursor-pointer transition-colors">Documentation</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
