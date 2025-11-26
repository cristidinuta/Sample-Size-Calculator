import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { DataPoint } from '../types';

interface ChartProps {
  data: DataPoint[];
  currentEffectSize: number;
  currentTotalN: number;
}

export const Chart: React.FC<ChartProps> = ({ data, currentEffectSize, currentTotalN }) => {
  return (
    <div className="h-64 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
        <LineChart
            data={data}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
        >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
                dataKey="effectSize" 
                label={{ value: 'Effect Size (Δ)', position: 'insideBottom', offset: -5, style: { fontSize: 12, fill: '#64748b' } }} 
                tick={{fontSize: 11, fill: '#64748b'}}
            />
            <YAxis 
                label={{ value: 'Total Sample Size', angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: '#64748b' } }}
                tick={{fontSize: 11, fill: '#64748b'}} 
            />
            <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                formatter={(value: number) => [value, 'Sample Size']}
                labelFormatter={(label: number) => `Effect Size: ${label}`}
            />
            <ReferenceLine x={currentEffectSize} stroke="#ef4444" strokeDasharray="3 3" />
            <ReferenceLine y={currentTotalN} stroke="#ef4444" strokeDasharray="3 3" />
            <Line 
                type="monotone" 
                dataKey="sampleSize" 
                stroke="#2563eb" 
                strokeWidth={3} 
                dot={false} 
                activeDot={{ r: 6 }} 
            />
        </LineChart>
        </ResponsiveContainer>
    </div>
  );
};
