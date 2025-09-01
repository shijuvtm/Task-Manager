import React from 'react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between">
          <div className="flex space-x-7">
            <div className="flex items-center py-4">
              <span className="font-semibold text-gray-800 text-lg">
                Task Manager
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {user && (
              <>
                <span className="py-4 text-gray-600">Hello, {user.username}</span>
                <button
                  onClick={logout}
                  className="py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded transition duration-300"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
