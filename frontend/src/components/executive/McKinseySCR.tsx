import React from 'react';
import Card from '../common/Card';
import { McKinseySCR } from '../../types';
import { BookOpen } from 'lucide-react';

interface McKinseySCRProps {
  data: McKinseySCR;
}

const McKinseySCR: React.FC<McKinseySCRProps> = ({ data }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <BookOpen className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-slate-900">Executive Summary</h2>
      </div>

      <Card title="Situation" variant="outlined">
        <p className="text-slate-700 leading-relaxed">{data.situation}</p>
      </Card>

      <Card title="Complication" variant="outlined">
        <p className="text-slate-700 leading-relaxed">{data.complication}</p>
      </Card>

      <Card title="Resolution" variant="outlined">
        <p className="text-slate-700 leading-relaxed">{data.resolution}</p>
      </Card>
    </div>
  );
};

export default McKinseySCR;
