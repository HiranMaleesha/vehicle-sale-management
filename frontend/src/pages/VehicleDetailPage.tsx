import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { vehicleService } from '../services/api';
import { Vehicle } from '../types';
import ImageGallery from '../components/ImageGallery';

const VehicleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (id) {
      fetchVehicle();
    }
  }, [id]);

  const fetchVehicle = async () => {
    try {
      setLoading(true);
      const data = await vehicleService.getVehicleById(parseInt(id!));
      setVehicle(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load vehicle');
    } finally {
      setLoading(false);
    }
  };

  const nextImage = () => {
    if (vehicle?.images && Array.isArray(vehicle.images) && vehicle.images.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === vehicle.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (vehicle?.images && Array.isArray(vehicle.images) && vehicle.images.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? vehicle.images.length - 1 : prev - 1
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error || 'Vehicle not found'}
        </div>
        <button
          onClick={() => navigate('/')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Back to Browse
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate('/')}
          className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
        >
          ← Back to Browse
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative h-96 bg-gray-200 rounded-lg overflow-hidden">
            <ImageGallery
              images={vehicle.images || []}
              alt={`${vehicle.brand} ${vehicle.modelName}`}
            />
          </div>

          {/* Thumbnail Gallery */}
          {vehicle.images && Array.isArray(vehicle.images) && vehicle.images.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto">
              {vehicle.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded border-2 overflow-hidden ${
                    index === currentImageIndex ? 'border-blue-500' : 'border-gray-300'
                  }`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Vehicle Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {vehicle.year} {vehicle.brand} {vehicle.modelName}
            </h1>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                {vehicle.vehicleType}
              </span>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                {vehicle.color}
              </span>
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                {vehicle.engineSize}
              </span>
            </div>
          </div>

          <div className="text-4xl font-bold text-emerald-600">
            Rs {vehicle.price.toLocaleString()}
          </div>

          {/* Specifications */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Specifications</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="font-medium text-gray-700">Brand:</span>
                <span className="ml-2 text-gray-900">{vehicle.brand}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Model:</span>
                <span className="ml-2 text-gray-900">{vehicle.modelName}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Year:</span>
                <span className="ml-2 text-gray-900">{vehicle.year}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Type:</span>
                <span className="ml-2 text-gray-900">{vehicle.vehicleType}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Color:</span>
                <span className="ml-2 text-gray-900">{vehicle.color}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Engine:</span>
                <span className="ml-2 text-gray-900">{vehicle.engineSize}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white border border-gray-200 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {vehicle.description}
            </p>
          </div>

          {/* Contact Section */}
          <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Interested in this vehicle?</h2>
            <p className="text-gray-700 mb-4">
              Contact our sales team to learn more about this {vehicle.year} {vehicle.brand} {vehicle.modelName}.
            </p>
            <div className="space-y-2">
              <div className="flex items-center text-gray-600">
                <span className="font-medium w-20">Phone:</span>
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center text-gray-600">
                <span className="font-medium w-20">Email:</span>
                <span>sales@vehiclesales.com</span>
              </div>
            </div>
            <button className="mt-4 w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Contact Sales Team
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailPage;