import sequelize from '../../config/database';
import User from './User';
import Vehicle from './Vehicle';
import bcrypt from 'bcryptjs';

// Initialize models
const models = {
  User,
  Vehicle,
  sequelize,
};

// Create default admin user
const createDefaultAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({ where: { username: 'admin' } });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        username: 'admin',
        password: hashedPassword,
        role: 'admin',
      });
    } else {
      console.log('Default admin user already exists');
    }
  } catch (error) {
    console.error('Error creating default admin user:', error);
  }
};

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    await sequelize.sync();
    console.log('Database synchronized successfully.');

    await createDefaultAdmin();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

export { connectDB };
export default models;