import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: string;
  trendPositive?: boolean;
  statusColor?: 'emerald' | 'amber' | 'orange' | 'rose' | 'blue' | 'slate';
  onClick?: () => void;
  highlight?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendPositive,
  statusColor = 'slate',
  onClick,
  highlight = false,
}) => {
  const leftBorderMap = {
    emerald: 'border-l-4 border-l-green-500',
    amber: 'border-l-4 border-l-yellow-400',
    orange: 'border-l-4 border-l-orange-500',
    rose: 'border-l-4 border-l-red-500',
    blue: 'border-l-4 border-l-blue-500',
    slate: '',
  };

  const textValColorMap = {
    emerald: 'text-green-600',
    amber: 'text-yellow-600',
    orange: 'text-orange-600',
    rose: 'text-red-600',
    blue: 'text-blue-600',
    slate: 'text-slate-900',
  };

  const subtitleColorMap = {
    emerald: 'text-green-500',
    amber: 'text-yellow-500',
    orange: 'text-orange-500',
    rose: 'text-red-500',
    blue: 'text-blue-500',
    slate: 'text-slate-400',
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white p-4 rounded-xl shadow-xs border border-slate-200 transition-all duration-200 ${leftBorderMap[statusColor]} ${
        onClick ? 'cursor-pointer hover:shadow-md' : ''
      } ${highlight ? 'ring-2 ring-blue-500/20' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div className="w-full">
          <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-1">
            {title}
          </div>
          <div className={`text-2xl font-bold ${textValColorMap[statusColor]}`}>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </div>
          {subtitle && (
            <div className={`text-[10px] mt-1 ${subtitleColorMap[statusColor]}`}>
              {subtitle}
            </div>
          )}
        </div>
        {Icon && (
          <div className="p-1.5 rounded text-slate-400 shrink-0">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      {trend && (
        <div className="mt-2 text-[10px] text-slate-500 pt-1.5 border-t border-slate-100 flex items-center justify-between">
          <span
            className={`font-semibold ${
              trendPositive === true
                ? 'text-emerald-600'
                : trendPositive === false
                ? 'text-rose-600'
                : 'text-slate-600'
            }`}
          >
            {trend}
          </span>
        </div>
      )}
    </div>
  );
};

