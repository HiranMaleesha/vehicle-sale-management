import { Router } from 'express';
import {
  createVehicle,
  getVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
} from '../controllers/vehicleController';
import { authenticateToken } from '../middleware/auth';
import { generateVehicleDescription } from '../services/openaiService';

const router = Router();

// Public routes
router.get('/', getVehicles);
router.get('/:id', getVehicleById);

// Protected routes (require authentication)
router.post('/', authenticateToken, createVehicle);
router.put('/:id', authenticateToken, updateVehicle);
router.delete('/:id', authenticateToken, deleteVehicle);

// AI Description generation endpoint
router.post('/generate-description', authenticateToken, async (req, res) => {
  try {
    const { vehicleType, brand, modelName, color, engineSize, year, price } = req.body;

    if (!vehicleType || !brand || !modelName || !color || !engineSize || !year || !price) {
      return res.status(400).json({ message: 'All vehicle details are required for description generation' });
    }

    const description = await generateVehicleDescription(
      vehicleType,
      brand,
      modelName,
      color,
      engineSize,
      year,
      price
    );

    res.json({ description });
  } catch (error) {
    console.error('Generate description error:', error);
    res.status(500).json({ message: 'Failed to generate vehicle description' });
  }
});

export default router;