import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// API Service Functions
export const incidentAPI = {
  // Get all incidents with filters
  getAll: (params = {}) => {
    return API.get("/incidents", { params });
  },

  // Get single incident by ID
  getById: (id) => {
    return API.get(`/incidents/${id}`);
  },

  // Get statistics summary
  getStats: (params = {}) => {
    return API.get("/incidents/stats/summary", { params });
  },

  // Get filter options
  getFilterOptions: () => {
    return API.get("/incidents/filters/options");
  },

  // Dashboard-specific endpoints (transformed from stats)
  getSummary: async () => {
    try {
      const response = await API.get("/incidents/stats/summary");
      const stats = response.data?.data || {};
      
      // Find high severity (severity >= 3)
      const highSeverity = (stats.bySeverity || [])
        .filter(s => s && s._id >= 3)
        .reduce((sum, s) => sum + (s.count || 0), 0);
      
      // Get top category
      const topCategory = stats.byCategory?.[0]?._id || "-";
      
      return {
        data: {
          total: stats.total || 0,
          highSeverity,
          topCategory,
        }
      };
    } catch (error) {
      console.error("Error fetching summary:", error);
      return {
        data: {
          total: 0,
          highSeverity: 0,
          topCategory: "-",
        }
      };
    }
  },

  getCategory: async () => {
    try {
      const response = await API.get("/incidents/stats/summary");
      const stats = response.data?.data || {};
      
      // Transform to format: [{ name: "Category", value: count }]
      return {
        data: (stats.byCategory || []).map(item => ({
          name: item._id || "Unknown",
          value: item.count || 0
        }))
      };
    } catch (error) {
      console.error("Error fetching category data:", error);
      return { data: [] };
    }
  },

  getSeverity: async () => {
    try {
      const response = await API.get("/incidents/stats/summary");
      const stats = response.data?.data || {};
      
      // Transform to format: [{ name: "Severity Level", value: count }]
      return {
        data: (stats.bySeverity || []).map(item => ({
          name: `Level ${item._id || 0}`,
          value: item.count || 0
        }))
      };
    } catch (error) {
      console.error("Error fetching severity data:", error);
      return { data: [] };
    }
  },

  getTrend: async () => {
    try {
      const response = await API.get("/incidents/stats/summary");
      const stats = response.data?.data;
      
      // Return raw format that TrendLine component expects: { _id: { year, month }, count }
      if (!stats || !stats.byMonth || !Array.isArray(stats.byMonth)) {
        return { data: [] };
      }
      
      return {
        data: stats.byMonth.filter(item => item && item._id && item._id.year && item._id.month)
      };
    } catch (error) {
      console.error("Error fetching trend data:", error);
      return { data: [] };
    }
  },

  getUnsafe: async () => {
    try {
      // Get all incidents and group by unsafe_condition_or_behavior
      const response = await API.get("/incidents", { 
        params: { limit: 10000 } // Get a large sample
      });
      
      const incidents = response.data?.data || [];
      const unsafeMap = {};
      
      incidents.forEach(incident => {
        const type = incident.unsafe_condition_or_behavior || "Unknown";
        unsafeMap[type] = (unsafeMap[type] || 0) + 1;
      });
      
      // Transform to format: [{ name: "Type", value: count }]
      return {
        data: Object.entries(unsafeMap).map(([name, value]) => ({
          name,
          value
        }))
      };
    } catch (error) {
      console.error("Error fetching unsafe data:", error);
      return { data: [] };
    }
  }
};

export default API;
