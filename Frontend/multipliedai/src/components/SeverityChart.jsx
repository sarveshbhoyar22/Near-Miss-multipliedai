import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";

const SEVERITY_COLORS = {
  0: '#9ca3af', // Gray for level 0
  1: '#10b981', // Green for low
  2: '#f59e0b', // Yellow for medium
  3: '#f97316', // Orange for high
  4: '#ef4444', // Red for critical
  5: '#dc2626', // Dark red for extreme
};

const SeverityChart = ({ data }) => {
  if (!data || !data.length) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <p>No severity data available</p>
      </div>
    );
  }

  // Sort by severity level
  const sortedData = [...data].sort((a, b) => {
    const levelA = parseInt(a.name.replace('Level ', '')) || 0;
    const levelB = parseInt(b.name.replace('Level ', '')) || 0;
    return levelA - levelB;
  });

  const total = sortedData.reduce((sum, item) => sum + (item.value || 0), 0);
  const highSeverity = sortedData
    .filter(item => {
      const level = parseInt(item.name.replace('Level ', '')) || 0;
      return level >= 3;
    })
    .reduce((sum, item) => sum + (item.value || 0), 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percent = total > 0 ? ((data.value / total) * 100).toFixed(1) : 0;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 mb-2">{data.payload.name}</p>
          <div className="space-y-1">
            <p className="text-blue-600 font-medium">
              Count: <span className="text-gray-900 ml-1">{data.value}</span>
            </p>
            <p className="text-gray-600 text-sm">
              Percentage: <span className="font-medium ml-1">{percent}%</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const getColor = (name) => {
    const level = parseInt(name.replace('Level ', '')) || 0;
    return SEVERITY_COLORS[level] || '#9ca3af';
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Summary */}
      <div className="mb-6 grid grid-cols-2 gap-4 px-2">
        <div className="bg-red-50 p-4 rounded-lg border border-red-100">
          <p className="text-gray-600 text-xs font-medium uppercase tracking-wide mb-2">High Severity (≥3)</p>
          <p className="text-red-600 font-bold text-2xl">{highSeverity}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <p className="text-gray-600 text-xs font-medium uppercase tracking-wide mb-2">Total Incidents</p>
          <p className="text-blue-600 font-bold text-2xl">{total}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sortedData} margin={{ top: 15, right: 30, left: 20, bottom: 15 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
            <XAxis 
              dataKey="name" 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              tick={{ fill: '#6b7280' }}
            />
            <YAxis 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              tick={{ fill: '#6b7280' }}
              label={{ 
                value: 'Count', 
                angle: -90, 
                position: 'insideLeft', 
                style: { fontSize: '12px', fill: '#6b7280', textAnchor: 'middle' } 
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {sortedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(entry.name)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SeverityChart;

