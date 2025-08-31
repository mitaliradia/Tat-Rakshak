import api from './api';

export const alertsService = {
  // Get all alerts
  getAlerts: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.type) queryParams.append('type', params.type);
      if (params.status) queryParams.append('status', params.status);
      if (params.location) queryParams.append('location', params.location);

      const response = await api.get(`/alerts?${queryParams}`);
      
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data,
          pagination: response.data.pagination
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Failed to fetch alerts'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch alerts'
      };
    }
  },

  // Get single alert
  getAlert: async (id) => {
    try {
      const response = await api.get(`/alerts/${id}`);
      
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Failed to fetch alert'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch alert'
      };
    }
  },

  // Create new alert (Authority only)
  createAlert: async (alertData) => {
    try {
      const response = await api.post('/alerts', alertData);
      
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Failed to create alert'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create alert'
      };
    }
  },

  // Update alert (Authority only)
  updateAlert: async (id, alertData) => {
    try {
      const response = await api.put(`/alerts/${id}`, alertData);
      
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Failed to update alert'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update alert'
      };
    }
  },

  // Delete alert (Authority only)
  deleteAlert: async (id) => {
    try {
      const response = await api.delete(`/alerts/${id}`);
      
      if (response.data.success) {
        return {
          success: true,
          message: response.data.message
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Failed to delete alert'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete alert'
      };
    }
  },

  // Add comment to alert
  addComment: async (id, comment) => {
    try {
      const response = await api.post(`/alerts/${id}/comments`, comment);
      
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Failed to add comment'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add comment'
      };
    }
  }
};
