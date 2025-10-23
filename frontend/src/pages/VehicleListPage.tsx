import React, { useState } from 'react';
import { useVehicles } from '../hooks/useVehicles';
import { VehicleFilters } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import VehicleCard from '../components/VehicleCard';
import VehicleListItem from '../components/VehicleListItem';
import VehicleComparison from '../components/VehicleComparison';

const VehicleListPage: React.FC = () => {
  const [filters, setFilters] = useState<VehicleFilters>({});
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedVehicles, setSelectedVehicles] = useState<number[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  const {
    vehicles,
    loading,
    error,
    pagination,
    updateFilters,
    clearFilters,
    goToPage,
  } = useVehicles();

  const handleFilterChange = (
    key: keyof VehicleFilters,
    value: string | number
  ) => {
    const newFilters = {
      ...filters,
      [key]: value || undefined,
    };
    setFilters(newFilters);
    updateFilters(newFilters);
  };

  const handleVehicleSelect = (vehicleId: number) => {
    setSelectedVehicles(prev => {
      if (prev.includes(vehicleId)) {
        return prev.filter(id => id !== vehicleId);
      } else if (prev.length < 3) {
        return [...prev, vehicleId];
      }
      return prev;
    });
  };

  const handleCompare = () => {
    setShowComparison(true);
  };

  const handleBackToList = () => {
    setShowComparison(false);
  };

  if (loading && vehicles.length === 0) {
    return <LoadingSpinner size='lg' className='min-h-64' />;
  }

  if (showComparison) {
    const comparisonVehicles = vehicles.filter(vehicle => selectedVehicles.includes(vehicle.id));
    return (
      <div className='space-y-8'>
        <div className='flex items-center justify-between'>
          <h1 className='text-3xl font-bold text-gray-900'>Vehicle Comparison</h1>
          <button
            onClick={handleBackToList}
            className='px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
          >
            ← Back to List
          </button>
        </div>
        <VehicleComparison vehicles={comparisonVehicles} />
      </div>
    );
  }

  return (
    <div className='space-y-8'>
      {/* Hero Section */}
      <div className='bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-600 rounded-2xl shadow-2xl p-8 text-white relative overflow-hidden'>
        <div className='absolute inset-0 bg-black opacity-10'></div>
        <div className='relative z-10'>
          <h1 className='text-4xl md:text-5xl font-bold mb-4'>
            Find Your Perfect Vehicle
          </h1>
          <p className='text-xl text-green-100 mb-6'>
            Discover amazing cars, bikes, and SUVs with AI-powered descriptions
          </p>
          <div className='flex items-center space-x-4 text-sm'>
            <div className='flex items-center space-x-1'>
              <span>Quality Assured</span>
            </div>
            <div className='flex items-center space-x-1'>
              <span>AI Descriptions</span>
            </div>
            <div className='flex items-center space-x-1'>
              <span>Advanced Search</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className='bg-white rounded-2xl shadow-xl p-6 border border-gray-100'>
        <div className='flex flex-col lg:flex-row gap-6'>
          <div className='flex-1'>
            <div className='relative'>
              <input
                type='text'
                placeholder='Search by brand, model, or color...'
                className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500'
                value={filters.brand || ''}
                onChange={(e) => handleFilterChange('brand', e.target.value)}
              />
            </div>
          </div>
          <div className='flex flex-wrap gap-4'>
            <select
              className='px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white min-w-[120px]'
              value={filters.vehicleType || ''}
              onChange={(e) =>
                handleFilterChange('vehicleType', e.target.value)
              }
            >
              <option value=''> All Types</option>
              <option value='Car'> Car</option>
              <option value='Bike'> Bike</option>
              <option value='SUV'> SUV</option>
            </select>
            <div className='flex gap-2'>
              <input
                type='number'
                placeholder='Min Price'
                className='px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white w-28'
                value={filters.minPrice || ''}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              />
              <span className='flex items-center text-gray-400'>-</span>
              <input
                type='number'
                placeholder='Max Price'
                className='px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white w-28'
                value={filters.maxPrice || ''}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              />
            </div>
            <button
              onClick={clearFilters}
              className='px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
            >
              🗑️ Clear
            </button>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className='flex justify-end mt-4'>
          <div className='flex bg-gray-100 rounded-lg p-1'>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded-md transition-all duration-200 font-medium ${
                viewMode === 'grid'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <span className='flex items-center space-x-2'>
                <span>⊞</span>
                <span>Grid</span>
              </span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-md transition-all duration-200 font-medium ${
                viewMode === 'list'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <span className='flex items-center space-x-2'>
                <span>☰</span>
                <span>List</span>
              </span>
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6'>
          {error}
        </div>
      )}

      {/* Results Summary and Compare Button */}
      <div className='mb-6 flex justify-between items-center'>
        <p className='text-gray-600'>
          Showing {vehicles.length} of {pagination.total} vehicles
        </p>
        {selectedVehicles.length > 0 && (
          <button
            onClick={handleCompare}
            className='px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
          >
            Compare ({selectedVehicles.length}) →
          </button>
        )}
      </div>

      {/* Vehicle Display */}
      {vehicles.length === 0 ? (
        <div className='text-center py-12'>
          <h3 className='text-xl font-semibold text-gray-600 mb-2'>
            No vehicles found
          </h3>
          <p className='text-gray-500'>Try adjusting your search criteria</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {vehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              isSelected={selectedVehicles.includes(vehicle.id)}
              onSelect={() => handleVehicleSelect(vehicle.id)}
              maxSelected={selectedVehicles.length >= 3 && !selectedVehicles.includes(vehicle.id)}
            />
          ))}
        </div>
      ) : (
        <div className='space-y-4'>
          {vehicles.map((vehicle) => (
            <VehicleListItem
              key={vehicle.id}
              vehicle={vehicle}
              isSelected={selectedVehicles.includes(vehicle.id)}
              onSelect={() => handleVehicleSelect(vehicle.id)}
              maxSelected={selectedVehicles.length >= 3 && !selectedVehicles.includes(vehicle.id)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className='mt-12 flex justify-center'>
          <div className='bg-white rounded-2xl shadow-xl p-6 border border-gray-100'>
            <div className='flex items-center space-x-2'>
              <button
                onClick={() => goToPage(pagination.page - 1)}
                disabled={pagination.page === 1}
                className='px-6 py-3 border border-gray-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all duration-200 font-medium disabled:transform-none hover:transform hover:-translate-y-0.5'
              >
                ← Previous
              </button>

              <div className='flex space-x-1'>
                {Array.from(
                  { length: Math.min(5, pagination.totalPages) },
                  (_, i) => {
                    const pageNum =
                      Math.max(
                        1,
                        Math.min(pagination.totalPages - 4, pagination.page - 2)
                      ) + i;
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
                  }
                )}
              </div>

              <button
                onClick={() => goToPage(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className='px-6 py-3 border border-gray-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all duration-200 font-medium disabled:transform-none hover:transform hover:-translate-y-0.5'
              >
                Next →
              </button>
            </div>
            <div className='text-center mt-4 text-sm text-gray-500'>
              Page {pagination.page} of {pagination.totalPages} •{' '}
              {pagination.total} total vehicles
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleListPage;
