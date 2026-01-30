import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";

const TrendChart = ({ data }) => {
  if (!data || !Array.isArray(data) || !data.length) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <p>No trend data available</p>
      </div>
    );
  }

  // Format data for the chart
  const formatted = data
    .filter(d => d && d._id && d._id.year && d._id.month)
    .map(d => {
      const monthNum = d._id.month;
      const year = d._id.year;
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return {
        month: `${monthNames[monthNum - 1]} ${year}`,
        monthShort: monthNames[monthNum - 1],
        year: year,
        monthNum: monthNum,
        count: d.count || 0,
        fullDate: `${year}-${String(monthNum).padStart(2, '0')}`
      };
    })
    .sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.monthNum - b.monthNum;
    });

  // Calculate statistics
  const totalIncidents = formatted.reduce((sum, d) => sum + d.count, 0);
  const avgIncidents = formatted.length > 0 ? (totalIncidents / formatted.length).toFixed(1) : 0;
  const maxMonth = formatted.reduce((max, d) => d.count > max.count ? d : max, formatted[0]);
  const minMonth = formatted.reduce((min, d) => d.count < min.count ? d : min, formatted[0]);

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 mb-1">{label}</p>
          <p className="text-blue-600 font-medium">
            Incidents: <span className="text-gray-900">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full">
      {/* Statistics Summary */}
      <div className="grid grid-cols-4 gap-4 mb-4 text-sm">
        <div className="bg-blue-50 p-2 rounded">
          <p className="text-gray-600 text-xs">Total</p>
          <p className="text-blue-600 font-semibold text-lg">{totalIncidents}</p>
        </div>
        <div className="bg-green-50 p-2 rounded">
          <p className="text-gray-600 text-xs">Average</p>
          <p className="text-green-600 font-semibold text-lg">{avgIncidents}</p>
        </div>
        <div className="bg-red-50 p-2 rounded">
          <p className="text-gray-600 text-xs">Peak Month</p>
          <p className="text-red-600 font-semibold text-sm">{maxMonth?.monthShort} ({maxMonth?.count})</p>
        </div>
        <div className="bg-yellow-50 p-2 rounded">
          <p className="text-gray-600 text-xs">Lowest Month</p>
          <p className="text-yellow-600 font-semibold text-sm">{minMonth?.monthShort} ({minMonth?.count})</p>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height="100%">
        <LineChart 
          data={formatted} 
          margin={{ top: 10, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
          <XAxis 
            dataKey="month" 
            stroke="#6b7280"
            style={{ fontSize: '11px' }}
            angle={-45}
            textAnchor="end"
            height={80}
            interval="preserveStartEnd"
          />
          <YAxis 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            label={{ value: 'Number of Incidents', angle: -90, position: 'insideLeft', style: { fontSize: '12px', fill: '#6b7280' } }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="count" 
            stroke="#3b82f6" 
            strokeWidth={3}
            dot={{ fill: '#3b82f6', r: 4, strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 7, fill: '#2563eb', stroke: '#fff', strokeWidth: 2 }}
            name="Incidents"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendChart;

