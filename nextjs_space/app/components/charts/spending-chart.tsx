'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface SpendingChartProps {
  transactions: any[];
}

const COLORS = ['#60B5FF', '#FF9149', '#FF9898', '#FF90BB', '#80D8C3', '#A19AD3', '#72BF78', '#FF6363'];

const SpendingChart = ({ transactions }: SpendingChartProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-64 flex items-center justify-center text-sage">Loading chart...</div>;
  }

  const categoryData = transactions
    ?.filter((t) => t?.type === 'debit' && t?.category)
    ?.reduce((acc: any, t) => {
      const category = t?.category || 'Other';
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += t?.amount ?? 0;
      return acc;
    }, {}) ?? {};

  const chartData = Object.entries(categoryData)
    ?.map(([name, value]) => ({
      name: name?.charAt(0)?.toUpperCase() + name?.slice(1),
      value: Number(value ?? 0),
    }))
    ?.sort((a, b) => (b?.value ?? 0) - (a?.value ?? 0))
    ?.slice(0, 6) ?? [];

  if (chartData?.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-sage">
        No spending data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData?.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS?.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) => `$${value?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? '0.00'}`}
          contentStyle={{ fontSize: 11 }}
        />
        <Legend
          verticalAlign="top"
          align="center"
          wrapperStyle={{ fontSize: 11 }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default SpendingChart;
