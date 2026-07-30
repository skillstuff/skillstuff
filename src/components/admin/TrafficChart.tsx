'use client';

import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface ChartDataPoint {
  date: string;
  views: number;
}

export default function TrafficChart({ data }: { data: ChartDataPoint[] }) {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.45} />
              <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0c4a6e',
              border: '1px solid #0284c7',
              borderRadius: '0.75rem',
              color: '#fff',
              fontSize: '12px',
              boxShadow: '0 10px 25px -5px rgba(14, 165, 233, 0.3)',
            }}
          />
          <Area type="monotone" dataKey="views" stroke="#0284c7" strokeWidth={3} fillOpacity={1} fill="url(#viewsGradient)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
