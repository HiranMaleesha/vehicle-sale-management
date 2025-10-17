import { Request, Response } from 'express';
import { Op } from 'sequelize';
import Vehicle from '../models/Vehicle';
import { generateVehicleDescription } from '../services/openaiService';
import { AuthRequest } from '../middleware/auth';

export const createVehicle = async (req: AuthRequest, res: Response) => {
  try {
    const {
      vehicleType,
      brand,
      modelName,
      color,
      engineSize,
      year,
      price,
      images,
      description,
    } = req.body;

    // Validate required fields
    if (!vehicleType || !brand || !modelName || !color || !engineSize || !year || !price) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    // Generate AI description if not provided
    let finalDescription = description;
    if (!finalDescription) {
      try {
        finalDescription = await generateVehicleDescription(
          vehicleType,
          brand,
          modelName,
          color,
          engineSize,
          year,
          price
        );
      } catch (error) {
        console.error('Failed to generate description:', error);
        finalDescription = `${year} ${brand} ${modelName} - A great ${vehicleType.toLowerCase()} option!`;
      }
    }

    const vehicle = await Vehicle.create({
      vehicleType,
      brand,
      modelName,
      color,
      engineSize,
      year,
      price,
      images: Array.isArray(images) ? images : [],
      description: finalDescription,
      userId: req.user?.id, // Add the authenticated user's ID
    });

    res.status(201).json({
      message: 'Vehicle created successfully',
      vehicle,
    });
  } catch (error) {
    console.error('Create vehicle error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getVehicles = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      brand,
      modelName,
      vehicleType,
      color,
      engineSize,
      minPrice,
      maxPrice,
      minYear,
      maxYear,
    } = req.query;

    const offset = (Number(page) - 1) * Number(limit);
    const whereClause: any = {};

    // Build filters
    if (brand) whereClause.brand = { [Op.like]: `%${brand}%` };
    if (modelName) whereClause.modelName = { [Op.like]: `%${modelName}%` };
    if (vehicleType) whereClause.vehicleType = vehicleType;
    if (color) whereClause.color = { [Op.like]: `%${color}%` };
    if (engineSize) whereClause.engineSize = { [Op.like]: `%${engineSize}%` };
    if (minPrice || maxPrice) {
      whereClause.price = {};
      if (minPrice) whereClause.price[Op.gte] = minPrice;
      if (maxPrice) whereClause.price[Op.lte] = maxPrice;
    }
    if (minYear || maxYear) {
      whereClause.year = {};
      if (minYear) whereClause.year[Op.gte] = minYear;
      if (maxYear) whereClause.year[Op.lte] = maxYear;
    }

    const { count, rows: vehicles } = await Vehicle.findAndCountAll({
      where: whereClause,
      limit: Number(limit),
      offset,
      order: [[sortBy as string, sortOrder as string]],
    });

    res.json({
      vehicles,
      pagination: {
        total: count,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(count / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Get vehicles error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getVehicleById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const vehicle = await Vehicle.findByPk(id);

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    res.json(vehicle);
  } catch (error) {
    console.error('Get vehicle by ID error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateVehicle = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const {
      vehicleType,
      brand,
      modelName,
      color,
      engineSize,
      year,
      price,
      images,
      description,
      regenerateDescription,
    } = req.body;

    const vehicle = await Vehicle.findByPk(id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    let finalDescription = description;
    if (regenerateDescription || (!description && regenerateDescription !== false)) {
      try {
        finalDescription = await generateVehicleDescription(
          vehicleType || vehicle.vehicleType,
          brand || vehicle.brand,
          modelName || vehicle.modelName,
          color || vehicle.color,
          engineSize || vehicle.engineSize,
          year || vehicle.year,
          price || vehicle.price
        );
      } catch (error) {
        console.error('Failed to regenerate description:', error);
      }
    }

    await vehicle.update({
      vehicleType: vehicleType || vehicle.vehicleType,
      brand: brand || vehicle.brand,
      modelName: modelName || vehicle.modelName,
      color: color || vehicle.color,
      engineSize: engineSize || vehicle.engineSize,
      year: year || vehicle.year,
      price: price || vehicle.price,
      images: images !== undefined ? images : vehicle.images,
      description: finalDescription || vehicle.description,
    });

    res.json({
      message: 'Vehicle updated successfully',
      vehicle,
    });
  } catch (error) {
    console.error('Update vehicle error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteVehicle = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const vehicle = await Vehicle.findByPk(id);

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    await vehicle.destroy();
    res.json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    console.error('Delete vehicle error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};