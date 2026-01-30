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

  // Filter out empty, null, or undefined values and normalize names
  const filteredData = data
    .filter(item => {
      const name = (item.name || '').trim();
      const value = item.value || 0;
      return name && name !== '' && name !== 'Unknown' && name !== 'N/A' && value > 0;
    })
    .map(item => ({
      name: (item.name || 'Unknown').trim() || 'Unknown',
      value: item.value || 0
    }));

  if (!filteredData.length) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <p>No valid unsafe conditions data available</p>
      </div>
    );
  }

  // Sort by value descending and take top 10
  const sortedData = [...filteredData]
    .sort((a, b) => (b.value || 0) - (a.value || 0))
    .slice(0, 10);

  const total = sortedData.reduce((sum, item) => sum + (item.value || 0), 0);
  const topUnsafe = sortedData[0] || { name: 'N/A', value: 0 };
  const allTypesCount = filteredData.length;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percent = total > 0 ? ((data.value / total) * 100).toFixed(1) : 0;
      const name = data.payload.name || 'Unknown';
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg max-w-xs">
          <p className="font-semibold text-gray-900 mb-2 break-words">{name}</p>
          <div className="space-y-1">
            <p className="text-orange-600 font-medium">
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

  return (
    <div className="w-full h-full flex flex-col">
      {/* Summary */}
      <div className="mb-6 flex items-center justify-between px-2">
        <div className="space-y-1">
          <p className="text-gray-600 text-xs font-medium uppercase tracking-wide">Total Types</p>
          <p className="text-2xl font-bold text-gray-900">{sortedData.length}</p>
          {allTypesCount > sortedData.length && (
            <p className="text-gray-500 text-xs">Showing top 10 of {allTypesCount}</p>
          )}
        </div>
        <div className="text-right space-y-1">
          <p className="text-gray-600 text-xs font-medium uppercase tracking-wide">Most Common</p>
          <p className="text-lg font-semibold text-orange-600 break-words max-w-[200px]">
            {topUnsafe.name || 'N/A'}
          </p>
          {topUnsafe.value > 0 && (
            <p className="text-gray-500 text-xs">({topUnsafe.value} incidents)</p>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={sortedData} 
            margin={{ top: 15, right: 30, left: 20, bottom: 80 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
            <XAxis 
              dataKey="name" 
              stroke="#6b7280"
              style={{ fontSize: '11px' }}
              angle={-45}
              textAnchor="end"
              height={80}
              tick={{ fill: '#6b7280' }}
              interval={0}
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
                <Cell key={`cell-${index}`} fill={UNSAFE_COLORS[index % UNSAFE_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default UnsafeChart;

