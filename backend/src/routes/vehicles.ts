import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {
  createVehicle,
  getVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
} from '../controllers/vehicleController';
import { authenticateToken } from '../middleware/auth';
import { generateVehicleDescription } from '../services/openaiService';
import Vehicle from '../models/Vehicle';

const router = Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const vehicleId = req.params.vehicleId || 'temp';
    const dir = path.join(__dirname, '../../uploads/vehicles', vehicleId);
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

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

// Image upload route
router.post('/:vehicleId/upload-images', authenticateToken, upload.array('images', 10), async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'No images provided' });
    }

    // Generate URLs for uploaded images (full URLs)
    const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';
    const imageUrls = files.map(file =>
      `${BASE_URL}/uploads/vehicles/${vehicleId}/${file.filename}`
    );

    // Update vehicle with image URLs
    const vehicle = await Vehicle.findByPk(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    // Ensure existingImages is properly parsed as an array
    let existingImages: string[] = [];
    try {
      if (vehicle.images) {
        if (Array.isArray(vehicle.images)) {
          existingImages = vehicle.images;
        } else if (typeof vehicle.images === 'string') {
          // Handle corrupted stringified JSON
          const parsed = JSON.parse(vehicle.images);
          existingImages = Array.isArray(parsed) ? parsed : [];
        }
      }
    } catch (error) {
      console.warn('Failed to parse existing images, resetting to empty array');
      existingImages = [];
    }

    await vehicle.update({
      images: [...existingImages, ...imageUrls]
    });

    res.json({
      message: 'Images uploaded successfully',
      images: imageUrls,
      totalImages: existingImages.length + imageUrls.length
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Failed to upload images' });
  }
});

// Delete specific image
router.delete('/:vehicleId/images/:imageIndex', authenticateToken, async (req, res) => {
  try {
    const { vehicleId, imageIndex } = req.params;
    if (!imageIndex) {
      return res.status(400).json({ message: 'Image index is required' });
    }

    const index = parseInt(imageIndex);

    const vehicle = await Vehicle.findByPk(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    // Ensure images is properly parsed as an array
    let images: string[] = [];
    try {
      if (vehicle.images) {
        if (Array.isArray(vehicle.images)) {
          images = vehicle.images;
        } else if (typeof vehicle.images === 'string') {
          // Handle corrupted stringified JSON
          const parsed = JSON.parse(vehicle.images);
          images = Array.isArray(parsed) ? parsed : [];
        }
      }
    } catch (error) {
      console.warn('Failed to parse images for deletion, resetting to empty array');
      images = [];
    }

    if (index < 0 || index >= images.length) {
      return res.status(400).json({ message: 'Invalid image index' });
    }

    // Delete file from filesystem
    const imageUrl = images[index];
    if (imageUrl) {
      const urlParts = imageUrl.split('/');
      const filename = urlParts[urlParts.length - 1];
      if (filename) {
        const filePath = path.join(__dirname, '../../uploads/vehicles', vehicleId!, filename);

        try {
          fs.unlinkSync(filePath);
        } catch (fileError) {
          console.warn('Could not delete file:', fileError);
        }
      }
    }

    // Remove from database
    images.splice(index, 1);
    await vehicle.update({ images });

    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({ message: 'Failed to delete image' });
  }
});

export default router;