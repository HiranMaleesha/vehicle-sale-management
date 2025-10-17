import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className='bg-gray-800 text-white py-8 mt-12'>
      <div className='container mx-auto px-4'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          <div>
            <h3 className='text-xl font-bold mb-4'>Vehicle Sales</h3>
            <p className='text-gray-300'>
              Your trusted partner for buying and selling quality vehicles.
              Find your perfect car, bike, or SUV today.
            </p>
          </div>
          <div>
            <h4 className='text-lg font-semibold mb-4'>Quick Links</h4>
            <ul className='space-y-2'>
              <li>
                <a href='/' className='text-gray-300 hover:text-white'>
                  Browse Vehicles
                </a>
              </li>
              <li>
                <a href='/admin' className='text-gray-300 hover:text-white'>
                  Admin Dashboard
                </a>
              </li>
              <li>
                <a href='/login' className='text-gray-300 hover:text-white'>
                  Admin Login
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className='text-lg font-semibold mb-4'>Contact Info</h4>
            <div className='space-y-2 text-gray-300'>
              <p>📞 +1 (555) 123-4567</p>
              <p>📧 sales@vehiclesales.com</p>
              <p>📍 123 Main St, City, State 12345</p>
            </div>
          </div>
        </div>
        <div className='border-t border-gray-700 mt-8 pt-8 text-center text-gray-300'>
          <p>&copy; 2025 Vehicle Sales. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;