import React from 'react';
import { Link } from 'react-router-dom';
import { Vehicle } from '../types';

interface VehicleCardProps {
  vehicle: Vehicle;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
        {vehicle.images && Array.isArray(vehicle.images) && vehicle.images.length > 0 ? (
          <img
            src={vehicle.images[0]}
            alt={`${vehicle.brand} ${vehicle.modelName}`}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
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
          <div className="text-gray-400 text-center">
            <div className="text-sm font-medium">No Image</div>
          </div>
        )}
       
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
          {vehicle.year} {vehicle.brand} {vehicle.modelName}
        </h3>
        <div className="flex items-center space-x-2 mb-3">
          <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-black-800">
            {vehicle.color}
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-black-800">
            {vehicle.engineSize}
          </span>
        </div>
        <p className="text-2xl font-bold text-emerald-600 mb-4">
          Rs {vehicle.price.toLocaleString()}
        </p>
        <Link
          to={`/vehicles/${vehicle.id}`}
          className="block w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-center py-3 rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
};

export default VehicleCard;