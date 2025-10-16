import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import Vehicle from '../src/models/Vehicle';
import User from '../src/models/User';
import vehicleRoutes from '../src/routes/vehicles';
import sequelize from '../config/database';

const app = express();
app.use(express.json());
app.use('/api/vehicles', vehicleRoutes);

describe('Vehicle Management', () => {
  let authToken: string;

  beforeAll(async () => {
    await sequelize.sync({ force: true });

    // Create a test admin user
    const hashedPassword = await import('bcryptjs').then(bcrypt => bcrypt.hash('password123', 10));
    const user = await User.create({
      username: 'admin',
      password: hashedPassword,
      role: 'admin',
    });

    authToken = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );
  });

  beforeEach(async () => {
    await Vehicle.destroy({ where: {} });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('GET /api/vehicles', () => {
    it('should return empty array when no vehicles exist', async () => {
      const response = await request(app).get('/api/vehicles');

      expect(response.status).toBe(200);
      expect(response.body.vehicles).toEqual([]);
      expect(response.body.pagination.total).toBe(0);
    });

    it('should return vehicles with pagination', async () => {
      // Create test vehicles
      await Vehicle.create({
        vehicleType: 'Car',
        brand: 'Toyota',
        modelName: 'Camry',
        color: 'Blue',
        engineSize: '2.5L',
        year: 2020,
        price: 25000,
        images: [],
        description: 'Test description',
      });

      const response = await request(app).get('/api/vehicles');

      expect(response.status).toBe(200);
      expect(response.body.vehicles).toHaveLength(1);
      expect(response.body.vehicles[0].brand).toBe('Toyota');
    });

    it('should filter vehicles by brand', async () => {
      await Vehicle.create({
        vehicleType: 'Car',
        brand: 'Toyota',
        modelName: 'Camry',
        color: 'Blue',
        engineSize: '2.5L',
        year: 2020,
        price: 25000,
        images: [],
        description: 'Test description',
      });

      await Vehicle.create({
        vehicleType: 'Car',
        brand: 'Honda',
        modelName: 'Civic',
        color: 'Red',
        engineSize: '2.0L',
        year: 2021,
        price: 22000,
        images: [],
        description: 'Test description',
      });

      const response = await request(app)
        .get('/api/vehicles')
        .query({ brand: 'Toyota' });

      expect(response.status).toBe(200);
      expect(response.body.vehicles).toHaveLength(1);
      expect(response.body.vehicles[0].brand).toBe('Toyota');
    });
  });

  describe('POST /api/vehicles', () => {
    it('should create a new vehicle with authentication', async () => {
      const vehicleData = {
        vehicleType: 'Car',
        brand: 'Toyota',
        modelName: 'Camry',
        color: 'Blue',
        engineSize: '2.5L',
        year: 2020,
        price: 25000,
        images: ['image1.jpg'],
      };

      const response = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${authToken}`)
        .send(vehicleData);

      expect(response.status).toBe(201);
      expect(response.body.vehicle.brand).toBe('Toyota');
      expect(response.body.vehicle).toHaveProperty('description');
    });

    it('should return 401 without authentication', async () => {
      const vehicleData = {
        vehicleType: 'Car',
        brand: 'Toyota',
        modelName: 'Camry',
        color: 'Blue',
        engineSize: '2.5L',
        year: 2020,
        price: 25000,
      };

      const response = await request(app)
        .post('/api/vehicles')
        .send(vehicleData);

      expect(response.status).toBe(401);
    });
  });

  describe('PUT /api/vehicles/:id', () => {
    it('should update vehicle with authentication', async () => {
      const vehicle = await Vehicle.create({
        vehicleType: 'Car',
        brand: 'Toyota',
        modelName: 'Camry',
        color: 'Blue',
        engineSize: '2.5L',
        year: 2020,
        price: 25000,
        images: [],
        description: 'Original description',
      });

      const updateData = {
        price: 27000,
        regenerateDescription: true,
      };

      const response = await request(app)
        .put(`/api/vehicles/${vehicle.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.vehicle.price).toBe(27000);
    });
  });

  describe('DELETE /api/vehicles/:id', () => {
    it('should delete vehicle with authentication', async () => {
      const vehicle = await Vehicle.create({
        vehicleType: 'Car',
        brand: 'Toyota',
        modelName: 'Camry',
        color: 'Blue',
        engineSize: '2.5L',
        year: 2020,
        price: 25000,
        images: [],
        description: 'Test description',
      });

      const response = await request(app)
        .delete(`/api/vehicles/${vehicle.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Vehicle deleted successfully');
    });
  });
});