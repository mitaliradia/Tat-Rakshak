import api from './api';

export const algaeService = {
  // Get latest algae analysis
  getLatestAnalysis: async () => {
    try {
      const response = await api.get('/algae/latest');
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch algae analysis'
      };
    }
  },

  // Get algae heatmap data
  getHeatmapData: async () => {
    try {
      const response = await api.get('/algae/heatmap');
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

  // Get all algae data
  getAllData: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.region) queryParams.append('region', params.region);
      if (params.intensity) queryParams.append('intensity', params.intensity);

      const response = await api.get(`/algae?${queryParams}`);
      return {
        success: true,
        data: response.data.data,
        pagination: response.data.pagination
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch algae data'
      };
    }
  },

  // Create algae data (Authority only)
  createData: async (data) => {
    try {
      const response = await api.post('/algae', data);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create algae data'
      };
    }
  },

  // Update algae data (Authority only)
  updateData: async (id, data) => {
    try {
      const response = await api.put(`/algae/${id}`, data);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update algae data'
      };
    }
  }
};
