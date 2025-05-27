import { useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, TooltipProps } from 'recharts';

// Helper for pie chart colors
const PIE_COLORS = [
  '#0ea5e9', '#14b8a6', '#f59e0b', '#ef4444', '#a78bfa', '#f472b6', '#34d399', '#f87171', '#38bdf8', '#fbbf24', '#6366f1', '#eab308'
];


export const TokenomicsPieChart = ({ tokenomics }) => {
  // Each tokenomics item is a slice, label by id or type
  const data = tokenomics.map((t) => ({
    name: t.releases[0]?.type || `#${t.id}`,
    value: t.bips,
    isLocked: t.isLocked,
    release: t.releases[0],
    id: t.id
  }));
  return (
    <PieChart width={32} height={32}>
      <Pie
        data={data}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={16}
        innerRadius={8}
        paddingAngle={2}
        stroke="#22223b"
        strokeWidth={1}
      >
        {data.map((entry, idx) => (
          <Cell key={`cell-${idx}`} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
        ))}
      </Pie>
    </PieChart>
  );
};


