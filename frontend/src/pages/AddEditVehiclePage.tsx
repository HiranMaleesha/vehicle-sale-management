import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { vehicleService } from '../services/api';
import api from '../services/api';
import { VehicleFormData, Vehicle } from '../types';

const AddEditVehiclePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState<VehicleFormData>({
    vehicleType: 'Car',
    brand: '',
    modelName: '',
    color: '',
    engineSize: '',
    year: new Date().getFullYear(),
    price: 0,
    images: [],
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [generatingDescription, setGeneratingDescription] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (isEditing && id) {
      fetchVehicle();
    }
  }, [id, isEditing]);

  const fetchVehicle = async () => {
    try {
      setLoading(true);
      const vehicle = await vehicleService.getVehicleById(parseInt(id!));
      setFormData({
        vehicleType: vehicle.vehicleType,
        brand: vehicle.brand,
        modelName: vehicle.modelName,
        color: vehicle.color,
        engineSize: vehicle.engineSize,
        year: vehicle.year,
        price: vehicle.price,
        images: vehicle.images || [],
        description: vehicle.description,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load vehicle');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'year' || name === 'price' ? parseInt(value) || 0 : value,
    }));
  };

  const handleAddImage = () => {
    if (imageUrl.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, imageUrl.trim()],
      }));
      setImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const generateDescription = async () => {
    setGeneratingDescription(true);
    try {
      const response = await api.post('/api/vehicles/generate-description', {
        vehicleType: formData.vehicleType,
        brand: formData.brand,
        modelName: formData.modelName,
        color: formData.color,
        engineSize: formData.engineSize,
        year: formData.year,
        price: formData.price,
      });

      setFormData(prev => ({ ...prev, description: response.data.description }));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to generate description');
    } finally {
      setGeneratingDescription(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      if (isEditing && id) {
        await vehicleService.updateVehicle(parseInt(id), formData);
      } else {
        await vehicleService.createVehicle(formData);
      }
      navigate('/admin');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save vehicle');
    } finally {
      setSaving(false);
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
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate('/admin')}
          className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
        >
          ← Back to Dashboard
        </button>
        <h1 className="text-3xl font-bold text-gray-900">
          {isEditing ? 'Edit Vehicle' : 'Add New Vehicle'}
        </h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Vehicle Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vehicle Type *
            </label>
            <select
              name="vehicleType"
              value={formData.vehicleType}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="Car">Car</option>
              <option value="Bike">Bike</option>
              <option value="SUV">SUV</option>
            </select>
          </div>

          {/* Brand */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Brand *
            </label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Model Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Model Name *
            </label>
            <input
              type="text"
              name="modelName"
              value={formData.modelName}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color *
            </label>
            <input
              type="text"
              name="color"
              value={formData.color}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Engine Size */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Engine Size *
            </label>
            <input
              type="text"
              name="engineSize"
              value={formData.engineSize}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Year */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Year *
            </label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleInputChange}
              min="1900"
              max={new Date().getFullYear() + 1}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Price */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        {/* Images */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Images
          </label>
          <div className="flex gap-2 mb-4">
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Enter image URL"
              className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={handleAddImage}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add Image
            </button>
          </div>

          {formData.images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {formData.images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`Vehicle ${index + 1}`}
                    className="w-full h-24 object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Description */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <button
              type="button"
              onClick={generateDescription}
              disabled={generatingDescription || !formData.brand || !formData.modelName}
              className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {generatingDescription ? 'Generating...' : 'Generate AI Description'}
            </button>
          </div>
          <textarea
            name="description"
            value={formData.description || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={4}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter vehicle description or use AI generation"
          />
        </div>

        {/* Submit Button */}
        <div className="mt-6 flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/admin')}
            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : (isEditing ? 'Update Vehicle' : 'Add Vehicle')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEditVehiclePage;