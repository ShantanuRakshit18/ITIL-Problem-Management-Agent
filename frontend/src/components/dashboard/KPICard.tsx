import React from 'react';
import Card from '../common/Card';
import { TrendingUp } from 'lucide-react';

interface KPICardProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: number;
  icon?: React.ReactNode;
}

const KPICard: React.FC<KPICardProps> = ({
  label,
  value,
  unit = '',
  trend = 'neutral',
  trendValue,
  icon,
}) => {
  const trendColors = {
    up: 'text-red-600 bg-red-50',
    down: 'text-green-600 bg-green-50',
    neutral: 'text-slate-600 bg-slate-50',
  };

  return (
    <Card variant="elevated" className="text-center">
      <div className="flex items-center justify-center mb-3">
        {icon || <TrendingUp className="w-6 h-6 text-blue-600" />}
      </div>
      <p className="text-sm font-medium text-slate-600 mb-2">{label}</p>
      <div className="flex items-baseline justify-center gap-1">
        <span className="text-3xl font-bold text-slate-900">{value}</span>
        {unit && <span className="text-sm text-slate-600">{unit}</span>}
      </div>
      {trendValue !== undefined && (
        <div className={`mt-3 px-2 py-1 rounded text-sm font-semibold ${trendColors[trend]}`}>
          {trend === 'up' ? '↑' : '↓'} {trendValue}%
        </div>
      )}
    </Card>
  );
};

export default KPICard;
