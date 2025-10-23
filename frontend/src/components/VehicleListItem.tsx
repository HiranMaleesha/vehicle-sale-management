import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Vehicle } from '../types';

interface VehicleListItemProps {
  vehicle: Vehicle;
  isSelected?: boolean;
  onSelect?: () => void;
  maxSelected?: boolean;
}

const VehicleListItem: React.FC<VehicleListItemProps> = ({ vehicle, isSelected = false, onSelect, maxSelected = false }) => {
  const [imageError, setImageError] = useState(false);
  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
      <div className='flex'>
        {/* Image Section with Selection Overlay */}
        <div className='relative w-48 h-32 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0'>
          <div className="absolute top-2 right-2 z-10">
            <button
              onClick={onSelect}
              disabled={maxSelected && !isSelected}
              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                isSelected
                  ? 'bg-blue-500 border-blue-500 text-white shadow-lg'
                  : maxSelected && !isSelected
                  ? 'bg-gray-300 border-gray-300 cursor-not-allowed opacity-60'
                  : 'bg-white/90 border-gray-300 hover:border-blue-400 cursor-pointer backdrop-blur-sm'
              }`}
            >
              {isSelected && (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>
          {vehicle.images &&
          Array.isArray(vehicle.images) &&
          vehicle.images.length > 0 &&
          !imageError ? (
            <img
              src={vehicle.images[0]}
              alt={`${vehicle.brand} ${vehicle.modelName}`}
              className='w-full h-full object-cover transition-transform duration-300 hover:scale-105'
              onError={() => setImageError(true)}
            />
          ) : (
            <div className='text-gray-400 text-center'>
              <div className='text-sm font-medium'>No Image</div>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className='flex-1 p-6'>
          <div className='flex justify-between items-start'>
            <div className='flex-1'>
              <h3 className='text-xl font-bold text-gray-900 mb-2'>
                {vehicle.year} {vehicle.brand} {vehicle.modelName}
              </h3>
              <div className='flex items-center space-x-3 mb-3'>
                <span className='inline-flex items-center px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full'>
                  {vehicle.vehicleType}
                </span>
                <span className='inline-flex items-center px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded-full'>
                  {vehicle.color}
                </span>
                <span className='inline-flex items-center px-2.5 py-0.5 text-xs font-medium bg-purple-100 text-purple-800 rounded-full'>
                  {vehicle.engineSize}
                </span>
              </div>
              <p className='text-gray-600 text-sm line-clamp-2 mb-3'>
                {vehicle.description}
              </p>
            </div>
            <div className='text-right ml-6'>
              <p className='text-2xl font-bold text-emerald-600 mb-4'>
                Rs {vehicle.price.toLocaleString()}
              </p>
              <Link
                to={`/vehicles/${vehicle.id}`}
                className='inline-block bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-center py-2 px-6 rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
              >
                View Details →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleListItem;
