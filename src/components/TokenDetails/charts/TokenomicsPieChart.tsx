import { PieChart } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Cell, Pie, Tooltip, TooltipProps } from "recharts";

const tokenomicsCache = {};
const PIE_COLORS = [
    '#0ea5e9', '#14b8a6', '#f59e0b', '#ef4444', '#a78bfa', '#f472b6', '#34d399', '#f87171', '#38bdf8', '#fbbf24', '#6366f1', '#eab308'
  ];
export const TokenomicsPieChartPopup = ({ virtualId, tokenName, onClose }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTokenomics = useCallback(async () => {
    if (tokenomicsCache[virtualId]) {
      setData(tokenomicsCache[virtualId]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`https://api.virtuals.io/api/virtuals/${virtualId}/tokenomics`);
      if (!res.ok) throw new Error('Failed to fetch tokenomics');
      const json = await res.json();
      tokenomicsCache[virtualId] = json.data;
      setData(json.data);
    } catch {
      setError('Failed to load tokenomics');
    } finally {
      setLoading(false);
    }
  }, [virtualId]);

  useEffect(() => {
    fetchTokenomics();
  }, [fetchTokenomics]);

  // Prepare data for recharts
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chartData = (data || []).map((t: any) => ({
    name: t.name,
    value: Number(t.bips),
    isLocked: t.isLocked,
    description: t.description,
    id: t.id
  }));
  const total = chartData.reduce((sum, d) => sum + d.value, 0);

  // Custom tooltip for recharts
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomTooltip = (props: TooltipProps<any, any>) => {
    const { active, payload } = props;
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="bg-dark-300 border border-dark-100 rounded-lg px-3 py-2 text-xs text-white shadow-lg">
          <div className="font-bold mb-1">{d.name}{d.isLocked && ' 🔒'}</div>
          <div>{d.description}</div>
          <div className="mt-1 text-primary-400 font-semibold">{((d.value / total) * 100).toFixed(1)}%</div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-10 cursor-pointer"
        onClick={onClose}
      />
      {/* Chart Popup */}
      <div
        className="relative bg-dark-400 border border-dark-200 rounded-lg shadow-lg p-4 flex flex-col items-center justify-center min-w-[380px] min-h-[380px]"
        onMouseLeave={onClose}
        onClick={e => e.stopPropagation()}
      >
        <div className="text-lg font-bold text-white mb-4">{tokenName}</div>
        {loading ? (
          <div className="flex items-center justify-center w-[360px] h-[360px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : error ? (
          <div className="text-error-500 p-4">{error}</div>
        ) : (
          <PieChart width={360} height={360}>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={160}
              innerRadius={80}
              paddingAngle={2}
              stroke="#22223b"
              strokeWidth={2}
            >
              {chartData.map((_, idx) => (
                <Cell key={`cell-popup-${idx}`} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={CustomTooltip} />
          </PieChart>
        )}
      </div>
    </div>
  );
};