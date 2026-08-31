import React from 'react';
import { ComponentStatus, TraditionalStatus } from '../types';
import { CheckCircle2, AlertTriangle, AlertOctagon, Check } from 'lucide-react';

interface StatusBadgeProps {
  status: ComponentStatus | TraditionalStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  pulse?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true,
  pulse = false,
}) => {
  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 font-bold gap-1',
    md: 'text-xs px-2.5 py-0.5 font-bold gap-1.5',
    lg: 'text-sm px-3 py-1 font-bold gap-2',
  };

  let colorClasses = '';
  let Icon = CheckCircle2;

  switch (status) {
    case 'NORMAL':
    case 'PASS':
      colorClasses = 'bg-green-100 text-green-700 border border-green-200/60';
      Icon = Check;
      break;
    case 'WATCH':
      colorClasses = 'bg-yellow-100 text-yellow-700 border border-yellow-200/60';
      Icon = AlertTriangle;
      break;
    case 'SUSPICIOUS':
      colorClasses = 'bg-orange-100 text-orange-700 border border-orange-200/60';
      Icon = AlertTriangle;
      break;
    case 'HIGH-RISK':
    case 'FAIL':
      colorClasses = 'bg-red-100 text-red-600 border border-red-200/60';
      Icon = AlertOctagon;
      break;
    default:
      colorClasses = 'bg-slate-100 text-slate-700 border border-slate-200';
      Icon = CheckCircle2;
  }

  return (
    <span
      className={`inline-flex items-center rounded-md tracking-wide uppercase font-sans ${sizeClasses[size]} ${colorClasses} ${
        pulse && (status === 'HIGH-RISK' || status === 'SUSPICIOUS') ? 'animate-pulse' : ''
      }`}
    >
      {showIcon && <Icon className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />}
      <span>{status}</span>
    </span>
  );
};

