import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { vehicleService } from '../services/api';
import { Vehicle, VehicleFilters } from '../types';

const AdminDashboard: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<VehicleFilters>({});

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const response = await vehicleService.getVehicles(1, 50, filters); // Get all vehicles for admin with filters
      setVehicles(response.vehicles);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load vehicles');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof VehicleFilters, value: string | number) => {
    const newFilters = {
      ...filters,
      [key]: value || undefined,
    };
    setFilters(newFilters);
    // Refetch vehicles with new filters
    fetchVehiclesWithFilters(newFilters);
  };

  const fetchVehiclesWithFilters = async (filterParams: VehicleFilters) => {
    try {
      setLoading(true);
      const response = await vehicleService.getVehicles(1, 50, filterParams);
      setVehicles(response.vehicles);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load vehicles');
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({});
    fetchVehicles();
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this vehicle?')) {
      return;
    }

    try {
      setDeleteLoading(id);
      await vehicleService.deleteVehicle(id);
      setVehicles(vehicles.filter(vehicle => vehicle.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete vehicle');
    } finally {
      setDeleteLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <Link
            to="/admin/vehicles/add"
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 font-medium"
          >
            Add New Vehicle
          </Link>
        </div>
        <p className="text-gray-600 mt-2">Manage your vehicle inventory</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Filter Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Filter Vehicles</h2>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600 transition-colors"
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <input
              type="text"
              placeholder="Brand"
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={filters.brand || ''}
              onChange={(e) => handleFilterChange('brand', e.target.value)}
            />
            <input
              type="text"
              placeholder="Model"
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={filters.modelName || ''}
              onChange={(e) => handleFilterChange('modelName', e.target.value)}
            />
            <select
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={filters.color || ''}
              onChange={(e) => handleFilterChange('color', e.target.value)}
            />
            <input
              type="number"
              placeholder="Min Price"
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={filters.minPrice || ''}
              onChange={(e) => handleFilterChange('minPrice', parseInt(e.target.value))}
            />
            <input
              type="number"
              placeholder="Max Price"
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={filters.maxPrice || ''}
              onChange={(e) => handleFilterChange('maxPrice', parseInt(e.target.value))}
            />
            <input
              type="number"
              placeholder="Min Year"
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={filters.minYear || ''}
              onChange={(e) => handleFilterChange('minYear', parseInt(e.target.value))}
            />
            <input
              type="number"
              placeholder="Max Year"
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={filters.maxYear || ''}
              onChange={(e) => handleFilterChange('maxYear', parseInt(e.target.value))}
            />
          </div>
        )}

        {Object.keys(filters).some(key => filters[key as keyof VehicleFilters]) && (
          <button
            onClick={clearFilters}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Vehicles</h3>
          <p className="text-3xl font-bold text-blue-600">{vehicles.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Cars</h3>
          <p className="text-3xl font-bold text-green-600">
            {vehicles.filter(v => v.vehicleType === 'Car').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">SUVs</h3>
          <p className="text-3xl font-bold text-purple-600">
            {vehicles.filter(v => v.vehicleType === 'SUV').length}
          </p>
        </div>
      </div>

      {/* Vehicles Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Vehicle Inventory</h2>
        </div>

        {vehicles.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No vehicles found</h3>
            <p className="text-gray-500 mb-4">Start by adding your first vehicle</p>
            <Link
              to="/admin/vehicles/add"
              className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600"
            >
              Add First Vehicle
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vehicle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {vehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-12 w-12 bg-gray-200 rounded flex items-center justify-center mr-3">
                          {vehicle.images && vehicle.images.length > 0 ? (
                            <img
                              src={vehicle.images[0]}
                              alt={vehicle.modelName}
                              className="h-12 w-12 object-cover rounded"
                            />
                          ) : (
                            <span className="text-gray-400">🚗</span>
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {vehicle.year} {vehicle.brand} {vehicle.modelName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {vehicle.vehicleType}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        <span className="font-medium">Color:</span> {vehicle.color}
                      </div>
                      <div className="text-sm text-gray-500">
                        <span className="font-medium">Engine:</span> {vehicle.engineSize}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-lg font-semibold text-green-600">
                        Rs {vehicle.price.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <Link
                        to={`/vehicles/${vehicle.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </Link>
                      <Link
                        to={`/admin/vehicles/edit/${vehicle.id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(vehicle.id)}
                        disabled={deleteLoading === vehicle.id}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50"
                      >
                        {deleteLoading === vehicle.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;