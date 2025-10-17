import { useState, useEffect } from 'react';
import { vehicleService } from '../services/api';
import { Vehicle, VehicleFilters, VehiclesResponse } from '../types';

export const useVehicles = (initialFilters: VehicleFilters = {}) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 0,
  });
  const [filters, setFilters] = useState<VehicleFilters>(initialFilters);

  const fetchVehicles = async (page: number = 1) => {
    try {
      setLoading(true);
      setError('');
      const response: VehiclesResponse = await vehicleService.getVehicles(
        page,
        pagination.limit,
        filters
      );
      setVehicles(response.vehicles);
      setPagination(response.pagination);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load vehicles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [filters]);

  const updateFilters = (newFilters: VehicleFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({});
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const goToPage = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
    fetchVehicles(page);
  };

  return {
    vehicles,
    loading,
    error,
    pagination,
    filters,
    updateFilters,
    clearFilters,
    goToPage,
    refetch: fetchVehicles,
  };
};