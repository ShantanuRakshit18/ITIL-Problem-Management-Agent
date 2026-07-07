import React, { useState } from 'react';
import Card from '../common/Card';
import { RootCauseIntelligence } from '../../types';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface RootCauseTableProps {
  data: RootCauseIntelligence[];
}

const RootCauseTable: React.FC<RootCauseTableProps> = ({ data }) => {
  const [sortKey, setSortKey] = useState<'frequency' | 'percentage'>('frequency');
  const [sortDesc, setSortDesc] = useState(true);

  const sorted = [...data].sort((a, b) => {
    const aVal = sortKey === 'frequency' ? a.frequency : a.percentage;
    const bVal = sortKey === 'frequency' ? b.frequency : b.percentage;
    return sortDesc ? bVal - aVal : aVal - bVal;
  });

  const severityColors = {
    CRITICAL: 'bg-red-100 text-red-800',
    HIGH: 'bg-orange-100 text-orange-800',
    MEDIUM: 'bg-yellow-100 text-yellow-800',
    LOW: 'bg-green-100 text-green-800',
  };

  const handleSort = (key: 'frequency' | 'percentage') => {
    if (sortKey === key) {
      setSortDesc(!sortDesc);
    } else {
      setSortKey(key);
      setSortDesc(true);
    }
  };

  return (
    <Card title="Root Cause Intelligence" subtitle="Most common problem causes">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-3 px-4 font-semibold text-slate-900">Cause</th>
              <th
                className="text-right py-3 px-4 font-semibold text-slate-900 cursor-pointer hover:bg-slate-100"
                onClick={() => handleSort('frequency')}
              >
                <div className="flex items-center justify-end gap-2">
                  Frequency
                  {sortKey === 'frequency' && (
                    sortDesc ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />
                  )}
                </div>
              </th>
              <th
                className="text-right py-3 px-4 font-semibold text-slate-900 cursor-pointer hover:bg-slate-100"
                onClick={() => handleSort('percentage')}
              >
                <div className="flex items-center justify-end gap-2">
                  %
                  {sortKey === 'percentage' && (
                    sortDesc ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />
                  )}
                </div>
              </th>
              <th className="text-right py-3 px-4 font-semibold text-slate-900">Severity</th>
            </tr>
          </thead>
          <tbody>
            {sorted.slice(0, 10).map((item, idx) => (
              <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-3 px-4 text-slate-900">{item.cause}</td>
                <td className="py-3 px-4 text-right text-slate-900 font-medium">{item.frequency}</td>
                <td className="py-3 px-4 text-right text-slate-900 font-medium">{item.percentage.toFixed(2)}%</td>
                <td className="py-3 px-4 text-right">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${severityColors[item.severity]}`}>
                    {item.severity}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default RootCauseTable;
