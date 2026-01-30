import { useEffect, useState } from "react";
import { incidentAPI } from "../services/api";
import TrendChart from "../components/TrendChart";
import CategoryChart from "../components/CategoryChart";
import SeverityChart from "../components/SeverityChart";
import UnsafeChart from "../components/UnsafeChart";
import StatCard from "../components/StatCard";

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [trend, setTrend] = useState([]);
  const [category, setCategory] = useState([]);
  const [severity, setSeverity] = useState([]);
  const [unsafe, setUnsafe] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [summaryRes, trendRes, categoryRes, severityRes, unsafeRes] = await Promise.all([
          incidentAPI.getSummary(),
          incidentAPI.getTrend(),
          incidentAPI.getCategory(),
          incidentAPI.getSeverity(),
          incidentAPI.getUnsafe()
        ]);
        setSummary(summaryRes.data);
        setTrend(trendRes.data);
        setCategory(categoryRes.data);
        setSeverity(severityRes.data);
        setUnsafe(unsafeRes.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">Near Miss Dashboard</h1>
              <p className="text-gray-600 text-sm">Comprehensive safety incident analysis and monitoring</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 mb-1">Last Updated</p>
              <p className="text-lg font-semibold text-gray-900">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Total Incidents" 
            value={summary?.total || 0}
            color="blue"
            icon="📊"
          />
          <StatCard 
            title="High Severity" 
            value={summary?.highSeverity || 0}
            color="red"
            icon="⚠️"
          />
          <StatCard 
            title="Top Category" 
            value={summary?.topCategory || "-"}
            color="green"
            icon="📁"
          />
          <StatCard 
            title="Categories" 
            value={category?.length || 0}
            color="purple"
            icon="🏷️"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Category Chart */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-1">Incidents by Category</h2>
              <p className="text-sm text-gray-500">Distribution across different incident categories</p>
            </div>
            <div className="h-[350px]">
              <CategoryChart data={category} />
            </div>
          </div>

          {/* Severity Chart */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-1">Severity Distribution</h2>
              <p className="text-sm text-gray-500">Breakdown of incidents by severity level</p>
            </div>
            <div className="h-[350px]">
              <SeverityChart data={severity} />
            </div>
          </div>
        </div>

        {/* Trend Chart - Full Width */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8 hover:shadow-xl transition-shadow duration-300">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">Monthly Trend Analysis</h2>
            <p className="text-sm text-gray-500">Incident frequency over time with key statistics</p>
          </div>
          <div className="h-[450px]">
            <TrendChart data={trend} />
          </div>
        </div>

        {/* Unsafe Conditions Chart */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">Unsafe Conditions & Behaviors</h2>
            <p className="text-sm text-gray-500">Top unsafe conditions and behaviors identified</p>
          </div>
          <div className="h-[400px]">
            <UnsafeChart data={unsafe} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
