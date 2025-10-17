import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { vehicleService } from '../services/api';
import { Vehicle, VehicleFilters, VehiclesResponse } from '../types';

const VehicleListPage: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 0,
  });
  const [filters, setFilters] = useState<VehicleFilters>({});
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchVehicles();
  }, [pagination.page, filters]);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const response: VehiclesResponse = await vehicleService.getVehicles(
        pagination.page,
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

  const handleFilterChange = (key: keyof VehicleFilters, value: string | number) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined,
    }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  };

  const clearFilters = () => {
    setFilters({});
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  if (loading && vehicles.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Browse Vehicles</h1>

        {/* Search and Filter Controls */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Search & Filter</h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <input
                type="text"
                placeholder="Brand"
                className="border border-gray-300 rounded px-3 py-2"
                value={filters.brand || ''}
                onChange={(e) => handleFilterChange('brand', e.target.value)}
              />
              <input
                type="text"
                placeholder="Model"
                className="border border-gray-300 rounded px-3 py-2"
                value={filters.modelName || ''}
                onChange={(e) => handleFilterChange('modelName', e.target.value)}
              />
              <select
                className="border border-gray-300 rounded px-3 py-2"
                value={filters.vehicleType || ''}
                onChange={(e) => handleFilterChange('vehicleType', e.target.value)}
              >
                <option value="">All Types</option>
                <option value="Car">Car</option>
                <option value="Bike">Bike</option>
                <option value="SUV">SUV</option>
              </select>
              <input
                type="text"
                placeholder="Color"
                className="border border-gray-300 rounded px-3 py-2"
                value={filters.color || ''}
                onChange={(e) => handleFilterChange('color', e.target.value)}
              />
              <input
                type="number"
                placeholder="Min Price"
                className="border border-gray-300 rounded px-3 py-2"
                value={filters.minPrice || ''}
                onChange={(e) => handleFilterChange('minPrice', parseInt(e.target.value))}
              />
              <input
                type="number"
                placeholder="Max Price"
                className="border border-gray-300 rounded px-3 py-2"
                value={filters.maxPrice || ''}
                onChange={(e) => handleFilterChange('maxPrice', parseInt(e.target.value))}
              />
              <input
                type="number"
                placeholder="Min Year"
                className="border border-gray-300 rounded px-3 py-2"
                value={filters.minYear || ''}
                onChange={(e) => handleFilterChange('minYear', parseInt(e.target.value))}
              />
              <input
                type="number"
                placeholder="Max Year"
                className="border border-gray-300 rounded px-3 py-2"
                value={filters.maxYear || ''}
                onChange={(e) => handleFilterChange('maxYear', parseInt(e.target.value))}
              />
            </div>
          )}

          {Object.keys(filters).some(key => filters[key as keyof VehicleFilters]) && (
            <button
              onClick={clearFilters}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Clear Filters
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {vehicles.length} of {pagination.total} vehicles
          </p>
        </div>

        {/* Vehicle Grid */}
        {vehicles.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No vehicles found</h3>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {vehicles.map((vehicle) => (
              <div key={vehicle.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  {vehicle.images && vehicle.images.length > 0 ? (
                    <img
                      src={vehicle.images[0]}
                      alt={`${vehicle.brand} ${vehicle.modelName}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-gray-400 text-center">
                      <div className="text-4xl mb-2">🚗</div>
                      <div>No Image</div>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {vehicle.year} {vehicle.brand} {vehicle.modelName}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {vehicle.vehicleType} • {vehicle.color} • {vehicle.engineSize}
                  </p>
                  <p className="text-2xl font-bold text-blue-600 mb-3">
                    ${vehicle.price.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                    {vehicle.description}
                  </p>
                  <Link
                    to={`/vehicles/${vehicle.id}`}
                    className="block w-full bg-blue-500 text-white text-center py-2 rounded hover:bg-blue-600 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <div className="flex space-x-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
                className="px-4 py-2 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>

              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setPagination(prev => ({ ...prev, page }))}
                  className={`px-4 py-2 border rounded ${
                    page === pagination.page
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page === pagination.totalPages}
                className="px-4 py-2 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleListPage;