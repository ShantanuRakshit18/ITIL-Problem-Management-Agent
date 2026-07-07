import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from '../common/Card';
import { TrendData } from '../../types';

interface TrendChartProps {
  data: TrendData[];
}

const TrendChart: React.FC<TrendChartProps> = ({ data }) => {
  return (
    <Card title="Problem Trends" subtitle="Weekly aggregation of severity levels">
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" angle={-45} textAnchor="end" height={80} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="p1" stroke="#ef4444" strokeWidth={2} name="P1" />
          <Line type="monotone" dataKey="p2" stroke="#f59e0b" strokeWidth={2} name="P2" />
          <Line type="monotone" dataKey="p3" stroke="#3b82f6" strokeWidth={2} name="P3" />
          <Line type="monotone" dataKey="p4" stroke="#6b7280" strokeWidth={2} name="P4" />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default TrendChart;
