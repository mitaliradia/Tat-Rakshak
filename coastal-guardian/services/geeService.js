import api from './api';

export const geeService = {
  // Run GEE analysis
  runAnalysis: async (locations = []) => {
    try {
      const response = await api.post('/gee/analyze', { locations });
      
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Failed to run GEE analysis'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to run GEE analysis'
      };
    }
  },

  // Get latest analysis results
  getResults: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.location) queryParams.append('location', params.location);
      if (params.limit) queryParams.append('limit', params.limit);

      const response = await api.get(`/gee/results?${queryParams}`);
      
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Failed to get analysis results'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get analysis results'
      };
    }
  },

  // Get analysis status
  getStatus: async () => {
    try {
      const response = await api.get('/gee/status');
      
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Failed to get analysis status'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get analysis status'
      };
    }
  }
};
