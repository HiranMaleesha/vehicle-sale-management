import sequelize from '../../config/database';
import User from './User';
import Vehicle from './Vehicle';

// Initialize models
const models = {
  User,
  Vehicle,
  sequelize,
};

// Test database connection
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

export { connectDB };
export default models;