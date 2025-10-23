import React from 'react';
import { Vehicle } from '../types';

interface VehicleComparisonProps {
  vehicles: Vehicle[];
}

const VehicleComparison: React.FC<VehicleComparisonProps> = ({ vehicles }) => {
  if (vehicles.length === 0) {
    return (
      <div className='text-center py-12'>
        <h3 className='text-xl font-semibold text-gray-600 mb-2'>No vehicles selected</h3>
        <p className='text-gray-500'>Please select vehicles to compare</p>
      </div>
    );
  }

  const comparisonFields = [
    { label: 'Brand', key: 'brand' },
    { label: 'Model', key: 'modelName' },
    { label: 'Year', key: 'year' },
    { label: 'Color', key: 'color' },
    { label: 'Engine Size', key: 'engineSize' },
    { label: 'Mileage', key: 'mileage' },
    { label: 'Price', key: 'price', format: (value: number) => `Rs ${value.toLocaleString()}` },
  ];

  return (
    <div className='bg-white rounded-2xl shadow-xl p-6 border border-gray-100'>
      <div className='overflow-x-auto'>
        <table className='w-full'>
          <thead>
            <tr className='border-b border-gray-200'>
              <th className='text-left py-4 px-4 font-semibold text-gray-900'>Specification</th>
              {vehicles.map((vehicle, index) => (
                <th key={vehicle.id} className='text-center py-4 px-4 font-semibold text-gray-900 min-w-[200px]'>
                  <div className='flex flex-col items-center'>
                    {vehicle.images && vehicle.images.length > 0 && (
                      <img
                        src={vehicle.images[0]}
                        alt={`${vehicle.brand} ${vehicle.modelName}`}
                        className='w-24 h-16 object-cover rounded-lg mb-2'
                      />
                    )}
                    <span className='text-sm'>{vehicle.year} {vehicle.brand} {vehicle.modelName}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comparisonFields.map((field, fieldIndex) => (
              <tr key={field.key} className={`border-b border-gray-100 ${fieldIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                <td className='py-4 px-4 font-medium text-gray-700'>{field.label}</td>
                {vehicles.map((vehicle) => (
                  <td key={vehicle.id} className='py-4 px-4 text-center text-gray-900'>
                    {field.format
                      ? field.format((vehicle as any)[field.key])
                      : (vehicle as any)[field.key] || 'N/A'
                    }
                  </td>
                ))}
              </tr>
            ))}
            <tr className='border-b border-gray-200'>
              <td className='py-4 px-4 font-medium text-gray-700'>Description</td>
              {vehicles.map((vehicle) => (
                <td key={vehicle.id} className='py-4 px-4 text-center text-gray-600 text-sm max-w-xs'>
                  {vehicle.description || 'No description available'}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VehicleComparison;