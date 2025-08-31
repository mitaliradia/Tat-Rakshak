import api from './api';

export const calamityService = {
  // Get latest calamity analysis
  getLatestAnalysis: async () => {
    try {
      const response = await api.get('/calamity/latest');
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch calamity analysis'
      };
    }
  },

  // Get calamity heatmap data
  getHeatmapData: async () => {
    try {
      const response = await api.get('/calamity/heatmap');
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch heatmap data'
      };
    }
  },

  // Get all calamity data
  getAllData: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.region) queryParams.append('region', params.region);
      if (params.type) queryParams.append('type', params.type);
      if (params.riskLevel) queryParams.append('riskLevel', params.riskLevel);
      if (params.status) queryParams.append('status', params.status);

      const response = await api.get(`/calamity?${queryParams}`);
      return {
        success: true,
        data: response.data.data,
        pagination: response.data.pagination
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch calamity data'
      };
    }
  },

  // Create calamity data (Authority only)
  createData: async (data) => {
    try {
      const response = await api.post('/calamity', data);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create calamity data'
      };
    }
  },

  // Update calamity data (Authority only)
  updateData: async (id, data) => {
    try {
      const response = await api.put(`/calamity/${id}`, data);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update calamity data'
      };
    }
  }
};
