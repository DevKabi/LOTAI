import React from 'react';
import { Plus } from 'lucide-react';

interface EmptyStateProps {
  icon: React.ElementType;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  accentColor?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  accentColor = 'indigo'
}) => {
  const getColors = () => {
    switch (accentColor) {
      case 'purple': return { bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-400', btn: 'bg-purple-600 hover:bg-purple-500' };
      case 'blue': return { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400', btn: 'bg-blue-600 hover:bg-blue-500' };
      case 'amber': return { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400', btn: 'bg-amber-600 hover:bg-amber-500' };
      case 'emerald': return { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', btn: 'bg-emerald-600 hover:bg-emerald-500' };
      case 'rose': return { bg: 'bg-rose-500/10', border: 'border-rose-500/20', text: 'text-rose-400', btn: 'bg-rose-600 hover:bg-rose-500' };
      case 'pink': return { bg: 'bg-pink-500/10', border: 'border-pink-500/20', text: 'text-pink-400', btn: 'bg-pink-600 hover:bg-pink-500' };
      default: return { bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', text: 'text-indigo-400', btn: 'bg-indigo-600 hover:bg-indigo-500' };
    }
  };

  const colors = getColors();

  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-3xl bg-slate-900/40 border border-dashed border-slate-800 space-y-4">
      <div className={`p-4 rounded-2xl ${colors.bg} ${colors.border} border shadow-inner`}>
        <Icon className={`w-8 h-8 ${colors.text}`} />
      </div>

      <div className="max-w-sm space-y-1">
        <h3 className="text-base font-bold text-slate-100">{title}</h3>
        <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
      </div>

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition shadow-md active:scale-95 ${colors.btn}`}
        >
          <Plus className="w-4 h-4" />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
};
