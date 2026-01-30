import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";

const UNSAFE_COLORS = ['#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#10b981', '#06b6d4', '#3b82f6'];

const UnsafeChart = ({ data }) => {
  if (!data || !data.length) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <p>No unsafe conditions data available</p>
      </div>
    );
  }

  // Sort by value descending and take top 10
  const sortedData = [...data]
    .sort((a, b) => (b.value || 0) - (a.value || 0))
    .slice(0, 10);

  const total = sortedData.reduce((sum, item) => sum + (item.value || 0), 0);
  const topUnsafe = sortedData[0] || { name: '-', value: 0 };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percent = total > 0 ? ((data.value / total) * 100).toFixed(1) : 0;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 mb-1">{data.payload.name || 'Unknown'}</p>
          <p className="text-orange-600 font-medium">
            Count: <span className="text-gray-900">{data.value}</span>
          </p>
          <p className="text-gray-600 text-sm">
            Percentage: <span className="font-medium">{percent}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full">
      {/* Summary */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm">Total Types</p>
          <p className="text-2xl font-bold text-gray-900">{sortedData.length}</p>
        </div>
        <div className="text-right">
          <p className="text-gray-600 text-sm">Most Common</p>
          <p className="text-lg font-semibold text-orange-600">{topUnsafe.name || 'N/A'}</p>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={sortedData} 
          margin={{ top: 10, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
          <XAxis 
            dataKey="name" 
            stroke="#6b7280"
            style={{ fontSize: '11px' }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            label={{ value: 'Count', angle: -90, position: 'insideLeft', style: { fontSize: '12px', fill: '#6b7280' } }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" radius={[8, 8, 0, 0]}>
            {sortedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={UNSAFE_COLORS[index % UNSAFE_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UnsafeChart;

