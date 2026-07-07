import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from '../common/Card';
import { SeverityDistribution } from '../../types';

interface SeverityChartProps {
  data: SeverityDistribution;
}

const SeverityChart: React.FC<SeverityChartProps> = ({ data }) => {
  const chartData = [
    { severity: 'P1', count: data.p1 },
    { severity: 'P2', count: data.p2 },
    { severity: 'P3', count: data.p3 },
    { severity: 'P4', count: data.p4 },
  ];

  return (
    <Card title="Severity Distribution" subtitle="Problem breakdown by severity">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="severity" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#ef4444" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default SeverityChart;
