# Vehicle Sales Management System

A full-stack web application for managing vehicle sales with AI-powered descriptions, built with React, Node.js, Express, and MySQL.

## 🚀 Features Implemented

### Admin Features
- **Secure Authentication**: JWT-based login system with error handling
- **Vehicle Management**: Complete CRUD operations (Create, Read, Update, Delete)
- **AI-Powered Descriptions**: Automatic generation using OpenAI ChatGPT API
- **Image Upload**: Multiple image upload with preview functionality
- **Advanced Filtering**: Filter vehicles by brand, model, type, color, price range, and year
- **Dashboard Analytics**: Statistics overview with vehicle counts

### Customer Features
- **Vehicle Browsing**: Grid and list view with pagination
- **Advanced Search**: Search by brand, model, year, price range, and vehicle type
- **Detailed View**: Full vehicle specifications with image gallery
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS

### Technical Features
- **RESTful API**: Well-structured API endpoints
- **File Upload**: Local storage with organized folder structure
- **Data Validation**: Input validation and error handling
- **Unit Testing**: Jest tests for authentication and vehicle operations
- **TypeScript**: Full type safety across frontend and backend

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Configuration:**
   Create a `.env` file in the backend directory:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=vehicle_sales_development
   DB_USER=root
   DB_PASSWORD=your_password

   # OpenAI Configuration
   OPENAI_API_KEY=your_openai_api_key_here

   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # Admin User
   #username=admin
   #password=admin123
   ```

5.**admin user**
   -for now automatically created admin user on server startup temporarily,this is not a secured way , but for testing purposes I used this way, as we are not using a signup, we can use role base login for this instead of this.
   admin user credentials
     - username:  admin
     -password: admin123  

4. **Database Setup:**
   - Create a MySQL database named `vehicle_sales_development`
   - The application will automatically create tables using Sequelize migrations

5. **Start the backend server:**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the frontend development server:**
   ```bash
   npm start
   ```

4. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Testing

1. **Run backend tests:**
   ```bash
   cd backend
   npm test
   ```

## 📋 API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login

### Vehicles (Public)
- `GET /api/vehicles` - Get all vehicles with filtering and pagination
- `GET /api/vehicles/:id` - Get vehicle by ID

### Vehicles (Admin Protected)
- `POST /api/vehicles` - Create new vehicle (requires authentication)
- `PUT /api/vehicles/:id` - Update vehicle (requires authentication)
- `DELETE /api/vehicles/:id` - Delete vehicle (requires authentication)

### Health Check
- `GET /api/health` - Server health check

## 🔧 Assumptions & Limitations

### Assumptions
- Images are stored locally in the `uploads/vehicles/` directory
- OpenAI API key is required for AI description generation
- MySQL database is pre-configured and accessible
- **Temporary Setup**: Default admin user (username: `admin`, password: `admin123`) is automatically created on server startup for development purposes
this is not a secured way , but for testing purposes I used this way, as we are not using a signup, we can use role base login for this instead of this.

### Limitations
- **Storage**: Local file storage (not suitable for production - AWS S3/Firebase would be better)
I didnt use S3 or firebase because of the cost and Simplicity

- **Authentication**: Basic JWT implementation
- **Image Processing**: No image optimization or resizing
- **Search**: Basic text search (no full-text search capabilities)
- **Caching**: No caching layer implemented
- **Rate Limiting**: Basic error handling, no API rate limiting
- **Validation**: Client-side validation only (server-side validation could be enhanced)


## 🧪 Testing

The application includes unit tests for:
- Authentication endpoints
- Vehicle CRUD operations
- Error handling scenarios

Run tests with:
```bash
cd backend
npm test
```
