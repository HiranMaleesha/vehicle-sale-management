export interface Vehicle {
  id: number;
  vehicleType: 'Car' | 'Bike' | 'SUV';
  brand: string;
  modelName: string;
  color: string;
  engineSize: string;
  year: number;
  price: number;
  images: string[];
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleFilters {
  brand?: string;
  modelName?: string;
  vehicleType?: 'Car' | 'Bike' | 'SUV';
  color?: string;
  engineSize?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
}

export interface VehicleFormData {
  vehicleType: 'Car' | 'Bike' | 'SUV';
  brand: string;
  modelName: string;
  color: string;
  engineSize: string;
  year: number;
  price: number;
  images: string[];
  description?: string;
}

export interface VehiclesResponse {
  vehicles: Vehicle[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface User {
  id: number;
  username: string;
  role: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface ApiError {
  message: string;
  status?: number;
}