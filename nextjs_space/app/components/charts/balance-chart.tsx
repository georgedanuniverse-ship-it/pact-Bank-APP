'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface BalanceChartProps {
  transactions: any[];
  initialBalance: number;
}

const BalanceChart = ({ transactions, initialBalance }: BalanceChartProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-64 flex items-center justify-center text-sage">Loading chart...</div>;
  }

  const sortedTransactions = [...(transactions ?? [])].sort(
    (a, b) => new Date(a?.createdAt ?? 0).getTime() - new Date(b?.createdAt ?? 0).getTime()
  );

  let runningBalance = initialBalance ?? 0;
  const balanceData = sortedTransactions?.map((t) => {
    if (t?.type === 'credit') {
      runningBalance += t?.amount ?? 0;
    } else {
      runningBalance -= t?.amount ?? 0;
    }

    return {
      date: new Date(t?.createdAt ?? 0).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      balance: Number(runningBalance?.toFixed(2)),
    };
  }) ?? [];

  const sampledData = balanceData?.filter((_, index) => index % Math.ceil(balanceData?.length / 15) === 0) ?? [];

  if (sampledData?.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-sage">
        No balance data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={sampledData} margin={{ top: 5, right: 20, bottom: 20, left: 10 }}>
        <XAxis
          dataKey="date"
          tickLine={false}
          tick={{ fontSize: 10 }}
          interval="preserveStartEnd"
          label={{ value: 'Date', position: 'insideBottom', offset: -15, style: { textAnchor: 'middle', fontSize: 11 } }}
        />
        <YAxis
          tickLine={false}
          tick={{ fontSize: 10 }}
          tickFormatter={(value) => `$${(value / 1000)?.toFixed(0) ?? 0}k`}
          label={{ value: 'Balance', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 11 } }}
        />
        <Tooltip
          formatter={(value: number) => [`$${value?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? '0.00'}`, 'Balance']}
          contentStyle={{ fontSize: 11 }}
        />
        <Line
          type="monotone"
          dataKey="balance"
          stroke="#0a3d2e"
          strokeWidth={2}
          dot={{ fill: '#d4af37', r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default BalanceChart;
