import axios from 'axios';
import {
  Vehicle,
  VehiclesResponse,
  VehicleFormData,
  AuthResponse,
  LoginCredentials,
  VehicleFilters
} from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('authToken');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

export const vehicleService = {
  getVehicles: async (
    page: number = 1,
    limit: number = 10,
    filters: VehicleFilters = {},
    sortBy: string = 'createdAt',
    sortOrder: string = 'DESC'
  ): Promise<VehiclesResponse> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy,
      sortOrder,
      ...Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== undefined && value !== '')
      ),
    });

    const response = await api.get(`/api/vehicles?${params}`);
    return response.data;
  },

  getVehicleById: async (id: number): Promise<Vehicle> => {
    const response = await api.get(`/api/vehicles/${id}`);
    return response.data;
  },

  createVehicle: async (vehicleData: VehicleFormData): Promise<{ message: string; vehicle: Vehicle }> => {
    const response = await api.post('/api/vehicles', vehicleData);
    return response.data;
  },

  updateVehicle: async (
    id: number,
    vehicleData: Partial<VehicleFormData>
  ): Promise<{ message: string; vehicle: Vehicle }> => {
    const response = await api.put(`/api/vehicles/${id}`, vehicleData);
    return response.data;
  },

  deleteVehicle: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete(`/api/vehicles/${id}`);
    return response.data;
  },

  uploadVehicleImages: async (vehicleId: number, images: File[]): Promise<{ images: string[]; totalImages: number; message: string }> => {
    const formData = new FormData();
    images.forEach(image => formData.append('images', image));

    const response = await api.post(`/api/vehicles/${vehicleId}/upload-images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  deleteVehicleImage: async (vehicleId: number, imageIndex: number): Promise<{ message: string }> => {
    const response = await api.delete(`/api/vehicles/${vehicleId}/images/${imageIndex}`);
    return response.data;
  },
};

export default api;