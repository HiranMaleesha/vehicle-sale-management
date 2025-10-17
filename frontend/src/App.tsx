import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoginPage from './pages/LoginPage';
import VehicleListPage from './pages/VehicleListPage';
import VehicleDetailPage from './pages/VehicleDetailPage';
import AdminDashboard from './pages/AdminDashboard';
import AddEditVehiclePage from './pages/AddEditVehiclePage';

const AppContent: React.FC = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <div className='min-h-screen bg-gray-50 flex flex-col'>
      <Navbar />
      <main className='flex-grow container mx-auto px-4 py-8'>
          <Routes>
            {/* Public Routes */}
            {/* <Route
              path='/'
              element={
                <div className='text-center py-12'>
                  <h2 className='text-3xl font-bold text-gray-800'>
                    Welcome to Vehicle Sales
                  </h2>
                  <p className='text-gray-600 mt-4'>
                    Browse our amazing collection of vehicles
                  </p>
                </div>
              }
            /> */}
            <Route
              path='/'
              element={<VehicleListPage />}
            />
            <Route
              path='/vehicles/:id'
              element={<VehicleDetailPage />}
            />

            {/* Admin Routes */}
            <Route
              path='/login'
              element={
                isAuthenticated ? <Navigate to='/admin' replace /> : <LoginPage />
              }
            />
            <Route
              path='/admin'
              element={
                isAuthenticated && isAdmin ? <AdminDashboard /> : <Navigate to='/login' replace />
              }
            />
            <Route
              path='/admin/vehicles/add'
              element={
                isAuthenticated && isAdmin ? <AddEditVehiclePage /> : <Navigate to='/login' replace />
              }
            />
            <Route
              path='/admin/vehicles/edit/:id'
              element={
                isAuthenticated && isAdmin ? <AddEditVehiclePage /> : <Navigate to='/login' replace />
              }
            />

            {/* Catch all route */}
            <Route path='*' element={<Navigate to='/' replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
