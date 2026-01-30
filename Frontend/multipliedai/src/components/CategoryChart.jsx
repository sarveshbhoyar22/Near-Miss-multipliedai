import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer, Legend } from "recharts";

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

const CategoryChart = ({ data }) => {
  if (!data || !data.length) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <p>No category data available</p>
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + (item.value || 0), 0);
  const topCategory = data.reduce((max, item) => 
    (item.value || 0) > (max.value || 0) ? item : max, 
    data[0] || { name: '-', value: 0 }
  );

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percent = ((data.value / total) * 100).toFixed(1);
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 mb-2">{data.name}</p>
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

  return (
    <div className="w-full h-full flex flex-col">
      {/* Summary */}
      <div className="mb-6 flex items-center justify-between px-2">
        <div className="space-y-1">
          <p className="text-gray-600 text-xs font-medium uppercase tracking-wide">Total Categories</p>
          <p className="text-2xl font-bold text-gray-900">{data.length}</p>
        </div>
        <div className="text-right space-y-1">
          <p className="text-gray-600 text-xs font-medium uppercase tracking-wide">Top Category</p>
          <p className="text-lg font-semibold text-blue-600">{topCategory.name}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 10, right: 10, bottom: 50, left: 10 }}>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
            //   label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            //   paddingAngle={1}
            //   labelfontSize={5}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              height={50}
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }}
              formatter={(value) => <span style={{ color: '#374151', marginLeft: '4px' }}>{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CategoryChart;

