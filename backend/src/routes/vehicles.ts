import { Router } from 'express';
import {
  createVehicle,
  getVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
} from '../controllers/vehicleController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', getVehicles);
router.get('/:id', getVehicleById);

// Protected routes (require authentication)
router.post('/', authenticateToken, createVehicle);
router.put('/:id', authenticateToken, updateVehicle);
router.delete('/:id', authenticateToken, deleteVehicle);

export default router;