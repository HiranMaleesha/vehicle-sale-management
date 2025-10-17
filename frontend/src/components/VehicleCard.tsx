import React from 'react';
import { Link } from 'react-router-dom';
import { Vehicle } from '../types';

interface VehicleCardProps {
  vehicle: Vehicle;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 bg-gray-200 flex items-center justify-center">
        {vehicle.images && Array.isArray(vehicle.images) && vehicle.images.length > 0 ? (
          <img
            src={vehicle.images[0]}
            alt={`${vehicle.brand} ${vehicle.modelName}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Hide broken images and show placeholder
              (e.target as HTMLImageElement).style.display = 'none';
              const parent = (e.target as HTMLImageElement).parentElement;
              if (parent) {
                parent.innerHTML = `
                  <div class="text-gray-400 text-center">
                    <div class="text-4xl mb-2">🚗</div>
                    <div>Image Error</div>
                  </div>
                `;
              }
            }}
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
  );
};

export default VehicleCard;