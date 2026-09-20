import React from 'react';

export const LoadingSkeleton: React.FC<{ rows?: number }> = ({ rows = 3 }) => {
  return (
    <div className="space-y-4 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-24 h-4 bg-slate-800 rounded-md"></div>
            <div className="w-16 h-4 bg-slate-800 rounded-md"></div>
          </div>
          <div className="w-3/4 h-5 bg-slate-800/80 rounded-md"></div>
          <div className="w-1/2 h-3 bg-slate-800/50 rounded-md"></div>
        </div>
      ))}
    </div>
  );
};
