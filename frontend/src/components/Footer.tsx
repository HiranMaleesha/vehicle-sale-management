import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className='bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-12 mt-16'>
      <div className='container mx-auto px-4'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          <div className='md:col-span-2'>
            <div className='flex items-center space-x-2 mb-4'>
              <h3 className='text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'>
                VehicleHub
              </h3>
            </div>
            <p className='text-gray-300 leading-relaxed mb-4'>
              Your trusted partner for buying and selling quality vehicles.
              Discover your perfect car, bike, or SUV with our AI-powered platform.
            </p>
            
          </div>
          <div>
            <h4 className='text-lg font-semibold mb-4 text-white'>Quick Links</h4>
            <ul className='space-y-3'>
              <li>
                <a href='/' className='text-gray-300 hover:text-blue-400 transition-colors flex items-center space-x-2'>
                  
                  <span>Browse Vehicles</span>
                </a>
              </li>
              <li>
                <a href='/admin' className='text-gray-300 hover:text-blue-400 transition-colors flex items-center space-x-2'>
                
                  <span>Admin Dashboard</span>
                </a>
              </li>
              <li>
                <a href='/login' className='text-gray-300 hover:text-blue-400 transition-colors flex items-center space-x-2'>
               
                  <span>Admin Login</span>
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className='text-lg font-semibold mb-4 text-white'>Contact Info</h4>
            <div className='space-y-3 text-gray-300'>
              <div className='flex items-center space-x-2'>
               
                <span>074 0488 335</span>
              </div>
              <div className='flex items-center space-x-2'>
                
                <span>sales@vehiclehub.com</span>
              </div>
              <div className='flex items-center space-x-2'>
               
                <span>Homagama, Colombo</span>
              </div>
            </div>
          </div>
        </div>
        <div className='border-t border-gray-700 mt-12 pt-8 text-center'>
          <div className='flex flex-col md:flex-row justify-between items-center'>
            <p className='text-gray-400 mb-4 md:mb-0'>
              &copy; 2025 VehicleHub. All rights reserved.
            </p>
            <div className='flex space-x-6 text-sm text-gray-400'>
              <a href='#' className='hover:text-blue-400 transition-colors'>Privacy Policy</a>
              <a href='#' className='hover:text-blue-400 transition-colors'>Terms of Service</a>
              <a href='#' className='hover:text-blue-400 transition-colors'>Support</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;