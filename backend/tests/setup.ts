import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Set test environment
process.env.NODE_ENV = 'test';
process.env.DB_NAME = 'vehicle_sales_test';

// Mock OpenAI to avoid API calls during tests
jest.mock('../src/services/openaiService', () => ({
  generateVehicleDescription: jest.fn().mockResolvedValue('Test vehicle description'),
}));