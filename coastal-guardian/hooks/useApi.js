"use client"

import { useState, useEffect } from 'react';

// Generic hook for API calls
export const useApi = (apiFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction();
      
      if (result.success) {
        setData(result.data);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, dependencies);

  return { data, loading, error, refetch: fetchData };
};

// Hook for alerts
export const useAlerts = (params = {}) => {
  return useApi(() => import('../services/alertsService').then(({ alertsService }) => alertsService.getAlerts(params)), [JSON.stringify(params)]);
};

// Hook for dashboard stats
export const useDashboardStats = () => {
  return useApi(() => import('../services/dashboardService').then(({ dashboardService }) => dashboardService.getStats()), []);
};

// Hook for requests (authority only)
export const useRequests = (params = {}) => {
  return useApi(() => import('../services/requestsService').then(({ requestsService }) => requestsService.getRequests(params)), [JSON.stringify(params)]);
};

// Hook for algae data
export const useAlgaeAnalysis = () => {
  return useApi(() => import('../services/algaeService').then(({ algaeService }) => algaeService.getLatestAnalysis()), []);
};

// Hook for calamity data
export const useCalamityAnalysis = () => {
  return useApi(() => import('../services/calamityService').then(({ calamityService }) => calamityService.getLatestAnalysis()), []);
};
