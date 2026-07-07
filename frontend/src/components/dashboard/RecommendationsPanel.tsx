import React, { useState } from 'react';
import Card from '../common/Card';
import { StrategicRecommendation } from '../../types';
import { ChevronDown, ChevronUp, Target } from 'lucide-react';

interface RecommendationsPanelProps {
  data: StrategicRecommendation[];
}

const RecommendationsPanel: React.FC<RecommendationsPanelProps> = ({ data }) => {
  const [expanded, setExpanded] = useState<string | null>(data[0]?.id || null);

  const riskColors = {
    CRITICAL: 'border-red-300 bg-red-50',
    HIGH: 'border-orange-300 bg-orange-50',
    MEDIUM: 'border-yellow-300 bg-yellow-50',
    LOW: 'border-green-300 bg-green-50',
  };

  const priorityBadges = {
    1: 'bg-red-100 text-red-800',
    2: 'bg-yellow-100 text-yellow-800',
    3: 'bg-blue-100 text-blue-800',
  };

  return (
    <Card title="Strategic Recommendations" subtitle="ITIL v4-aligned improvement initiatives">
      <div className="space-y-3">
        {data.map((rec) => (
          <div
            key={rec.id}
            className={`border-l-4 rounded-lg p-4 transition-all ${
              expanded === rec.id ? riskColors[rec.riskLevel] : 'border-slate-300 bg-slate-50'
            }`}
          >
            <div
              className="flex items-start justify-between cursor-pointer"
              onClick={() => setExpanded(expanded === rec.id ? null : rec.id)}
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${priorityBadges[rec.priority]}`}>
                    P{rec.priority}
                  </span>
                  <h4 className="font-semibold text-slate-900">{rec.title}</h4>
                </div>
                <p className="text-sm text-slate-600">ITIL Practice: {rec.itilPractice}</p>
              </div>
              <div className="ml-4">
                {expanded === rec.id ? (
                  <ChevronUp className="w-5 h-5 text-slate-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-600" />
                )}
              </div>
            </div>

            {expanded === rec.id && (
              <div className="mt-4 pt-4 border-t border-slate-200">
                <p className="text-sm text-slate-700 mb-3">{rec.description}</p>
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="font-semibold text-slate-900">Impact</p>
                    <p className="text-slate-600">{rec.impactRating}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Effort</p>
                    <p className="text-slate-600">{rec.effortRating}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Risk Level</p>
                    <p className="text-slate-600">{rec.riskLevel}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default RecommendationsPanel;
