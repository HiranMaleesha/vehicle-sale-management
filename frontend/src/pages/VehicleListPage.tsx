import React, { useState } from 'react';
import { useVehicles } from '../hooks/useVehicles';
import { VehicleFilters } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import VehicleCard from '../components/VehicleCard';

const VehicleListPage: React.FC = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<VehicleFilters>({});

  const {
    vehicles,
    loading,
    error,
    pagination,
    updateFilters,
    clearFilters,
    goToPage,
  } = useVehicles();

  const handleFilterChange = (key: keyof VehicleFilters, value: string | number) => {
    const newFilters = {
      ...filters,
      [key]: value || undefined,
    };
    setFilters(newFilters);
    updateFilters(newFilters);
  };

  if (loading && vehicles.length === 0) {
    return <LoadingSpinner size="lg" className="min-h-64" />;
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-600 rounded-2xl shadow-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Find Your Perfect Vehicle
          </h1>
          <p className="text-xl text-green-100 mb-6">
            Discover amazing cars, bikes, and SUVs with AI-powered descriptions
          </p>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <span className="text-yellow-300">⭐</span>
              <span>Quality Assured</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-green-300">🤖</span>
              <span>AI Descriptions</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-blue-300">🔍</span>
              <span>Advanced Search</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                🔍
              </span>
              <input
                type="text"
                placeholder="Search by brand, model, or color..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500"
                value={filters.brand || ''}
                onChange={(e) => handleFilterChange('brand', e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <select
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white min-w-[120px]"
              value={filters.vehicleType || ''}
              onChange={(e) => handleFilterChange('vehicleType', e.target.value)}
            >
              <option value=""> All Types</option>
              <option value="Car"> Car</option>
              <option value="Bike"> Bike</option>
              <option value="SUV"> SUV</option>
            </select>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min Price"
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white w-28"
                value={filters.minPrice || ''}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              />
              <span className="flex items-center text-gray-400">-</span>
              <input
                type="number"
                placeholder="Max Price"
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white w-28"
                value={filters.maxPrice || ''}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              />
            </div>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              🗑️ Clear
            </button>
          </div>
        </div>
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
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => goToPage(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-6 py-3 border border-gray-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all duration-200 font-medium disabled:transform-none hover:transform hover:-translate-y-0.5"
                >
                  ← Previous
                </button>

                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const pageNum = Math.max(1, Math.min(pagination.totalPages - 4, pagination.page - 2)) + i;
                    if (pageNum > pagination.totalPages) return null;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => goToPage(pageNum)}
                        className={`px-4 py-3 border rounded-xl font-medium transition-all duration-200 ${
                          pageNum === pagination.page
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white border-transparent shadow-lg transform -translate-y-0.5'
                            : 'border-gray-300 hover:bg-gray-50 hover:transform hover:-translate-y-0.5'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => goToPage(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="px-6 py-3 border border-gray-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all duration-200 font-medium disabled:transform-none hover:transform hover:-translate-y-0.5"
                >
                  Next →
                </button>
              </div>
              <div className="text-center mt-4 text-sm text-gray-500">
                Page {pagination.page} of {pagination.totalPages} • {pagination.total} total vehicles
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default VehicleListPage;