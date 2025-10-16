import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { authService } from './services/api';

const App: React.FC = () => {
  const isAuthenticated = authService.isAuthenticated();
  const currentUser = authService.getCurrentUser();
  const isAdmin = currentUser?.role === 'admin';

  return (
    <Router>
      <div className='min-h-screen bg-gray-50'>
        <nav className='bg-white shadow-lg'>
          <div className='container mx-auto px-4'>
            <div className='flex justify-between items-center py-4'>
              <div className='flex items-center space-x-4'>
                <h1 className='text-2xl font-bold text-blue-600'>
                  Vehicle Sales
                </h1>
                <a href='/' className='text-gray-600 hover:text-blue-600'>
                  Browse
                </a>
                {isAuthenticated && isAdmin && (
                  <a
                    href='/admin'
                    className='text-gray-600 hover:text-blue-600'
                  >
                    Admin
                  </a>
                )}
              </div>
              <div className='flex items-center space-x-4'>
                {isAuthenticated ? (
                  <div className='flex items-center space-x-4'>
                    <span className='text-gray-600'>
                      Welcome, {currentUser?.username}
                    </span>
                    <button
                      onClick={() => {
                        authService.logout();
                        window.location.href = '/';
                      }}
                      className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600'
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <a
                    href='/login'
                    className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
                  >
                    Admin Login
                  </a>
                )}
              </div>
            </div>
          </div>
        </nav>
        <main className='container mx-auto px-4 py-8'>
          <Routes>
            {/* Public Routes */}
            <Route
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
            />
            <Route
              path='/vehicles'
              element={
                <div className='text-center py-12'>
                  <h2 className='text-3xl font-bold text-gray-800'>
                    Vehicle List
                  </h2>
                  <p className='text-gray-600 mt-4'>Coming soon...</p>
                </div>
              }
            />
            <Route
              path='/vehicles/:id'
              element={
                <div className='text-center py-12'>
                  <h2 className='text-3xl font-bold text-gray-800'>
                    Vehicle Details
                  </h2>
                  <p className='text-gray-600 mt-4'>Coming soon...</p>
                </div>
              }
            />

            {/* Admin Routes */}
            <Route
              path='/login'
              element={
                isAuthenticated ? (
                  <Navigate to='/admin' replace />
                ) : (
                  <div className='text-center py-12'>
                    <h2 className='text-3xl font-bold text-gray-800'>
                      Admin Login
                    </h2>
                    <p className='text-gray-600 mt-4'>Coming soon...</p>
                  </div>
                )
              }
            />
            <Route
              path='/admin'
              element={
                isAuthenticated && isAdmin ? (
                  <div className='text-center py-12'>
                    <h2 className='text-3xl font-bold text-gray-800'>
                      Admin Dashboard
                    </h2>
                    <p className='text-gray-600 mt-4'>Coming soon...</p>
                  </div>
                ) : (
                  <Navigate to='/login' replace />
                )
              }
            />
            <Route
              path='/admin/vehicles/add'
              element={
                isAuthenticated && isAdmin ? (
                  <div className='text-center py-12'>
                    <h2 className='text-3xl font-bold text-gray-800'>
                      Add Vehicle
                    </h2>
                    <p className='text-gray-600 mt-4'>Coming soon...</p>
                  </div>
                ) : (
                  <Navigate to='/login' replace />
                )
              }
            />
            <Route
              path='/admin/vehicles/edit/:id'
              element={
                isAuthenticated && isAdmin ? (
                  <div className='text-center py-12'>
                    <h2 className='text-3xl font-bold text-gray-800'>
                      Edit Vehicle
                    </h2>
                    <p className='text-gray-600 mt-4'>Coming soon...</p>
                  </div>
                ) : (
                  <Navigate to='/login' replace />
                )
              }
            />

            {/* Catch all route */}
            <Route path='*' element={<Navigate to='/' replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
