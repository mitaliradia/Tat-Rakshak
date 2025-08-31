import api from './api';

export const requestsService = {
  // Get all requests (Authority only)
  getRequests: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.type) queryParams.append('type', params.type);
      if (params.status) queryParams.append('status', params.status);
      if (params.location) queryParams.append('location', params.location);

      const response = await api.get(`/requests?${queryParams}`);
      
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data,
          pagination: response.data.pagination
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Failed to fetch requests'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch requests'
      };
    }
  },

  // Get single request (Authority only)
  getRequest: async (id) => {
    try {
      const response = await api.get(`/requests/${id}`);
      
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Failed to fetch request'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch request'
      };
    }
  },

  // Submit new request (Public)
  submitRequest: async (requestData) => {
    try {
      const response = await api.post('/requests', requestData);
      
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Failed to submit request'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to submit request'
      };
    }
  },

  // Update request (Authority only)
  updateRequest: async (id, requestData) => {
    try {
      const response = await api.put(`/requests/${id}`, requestData);
      
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Failed to update request'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update request'
      };
    }
  },
  
  // Update request status (Authority only)
  updateRequestStatus: async (id, statusData) => {
    try {
      const response = await api.put(`/requests/${id}/status`, statusData);
      
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Failed to update request status'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update request status'
      };
    }
  },

  // Delete request (Authority only)
  deleteRequest: async (id) => {
    try {
      const response = await api.delete(`/requests/${id}`);
      
      if (response.data.success) {
        return {
          success: true,
          message: response.data.message
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Failed to delete request'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete request'
      };
    }
  }
};
