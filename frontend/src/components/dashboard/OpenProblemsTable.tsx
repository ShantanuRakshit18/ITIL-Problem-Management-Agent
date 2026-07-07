import React from 'react';
import Card from '../common/Card';
import { OpenProblemRisk } from '../../types';
import { AlertCircle } from 'lucide-react';

interface OpenProblemsTableProps {
  data: OpenProblemRisk[];
}

const OpenProblemsTable: React.FC<OpenProblemsTableProps> = ({ data }) => {
  const statusColors = {
    CRITICAL: 'bg-red-100 text-red-800',
    HIGH: 'bg-orange-100 text-orange-800',
    MEDIUM: 'bg-yellow-100 text-yellow-800',
    LOW: 'bg-green-100 text-green-800',
  };

  return (
    <Card
      title="Open Problem Risk Register"
      subtitle="Problems awaiting resolution, ranked by risk"
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-3 px-4 font-semibold text-slate-900">Problem ID</th>
              <th className="text-left py-3 px-4 font-semibold text-slate-900">Severity</th>
              <th className="text-left py-3 px-4 font-semibold text-slate-900">Days Open</th>
              <th className="text-left py-3 px-4 font-semibold text-slate-900">Status</th>
              <th className="text-left py-3 px-4 font-semibold text-slate-900">Summary</th>
            </tr>
          </thead>
          <tbody>
            {data.slice(0, 10).map((risk, idx) => (
              <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-3 px-4 font-medium text-slate-900">{risk.problemId}</td>
                <td className="py-3 px-4 text-slate-700">
                  <span className="px-2 py-1 rounded bg-slate-100 text-xs font-semibold">
                    {risk.severity}
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-700">
                  <span className="font-semibold">{risk.daysOpen}</span> days
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[risk.status]}`}>
                    {risk.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-slate-600">{risk.summary}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default OpenProblemsTable;
