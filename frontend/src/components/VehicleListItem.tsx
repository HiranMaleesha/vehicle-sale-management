import React from 'react';
import { Link } from 'react-router-dom';
import { Vehicle } from '../types';

interface VehicleListItemProps {
  vehicle: Vehicle;
}

const VehicleListItem: React.FC<VehicleListItemProps> = ({ vehicle }) => {
  return (
    <div className='bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100'>
      <div className='flex'>
        {/* Image Section */}
        <div className='w-48 h-32 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0'>
          {vehicle.images &&
          Array.isArray(vehicle.images) &&
          vehicle.images.length > 0 ? (
            <img
              src={vehicle.images[0]}
              alt={`${vehicle.brand} ${vehicle.modelName}`}
              className='w-full h-full object-cover transition-transform duration-300 hover:scale-105'
              onError={(e) => {
                // Hide broken images and show placeholder
                (e.target as HTMLImageElement).style.display = 'none';
                const parent = (e.target as HTMLImageElement).parentElement;
                if (parent) {
                  parent.innerHTML = `
                    <div class="text-gray-400 text-center">
                      <div class="text-sm">Image Error</div>
                    </div>
                  `;
                }
              }}
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
