import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/database';

class Vehicle extends Model {
  public id!: number;
  public vehicleType!: string;
  public brand!: string;
  public modelName!: string;
  public color!: string;
  public engineSize!: string;
  public year!: number;
  public price!: number;
  public images!: string[];
  public description!: string;
  public userId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Vehicle.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    vehicleType: {
      type: DataTypes.ENUM('Car', 'Bike', 'SUV'),
      allowNull: false,
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    modelName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    color: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    engineSize: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    images: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
      get() {
        const raw = this.getDataValue('images');
        if (Array.isArray(raw)) return raw;
        if (typeof raw === 'string') {
          try {
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : [];
          } catch {
            return [];
          }
        }
        return [];
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'Vehicle',
    tableName: 'vehicles',
    timestamps: true,
  }
);

// Define associations
import User from './User';
Vehicle.belongsTo(User, { foreignKey: 'userId', as: 'creator' });
User.hasMany(Vehicle, { foreignKey: 'userId', as: 'vehicles' });

export default Vehicle;