import React from 'react';
import { Link } from 'react-router-dom';
import clubLogo from '../assets/images/club_logo.png';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-xl max-w-md w-full">
        <img
          src={clubLogo}
          alt="EV Ski Club Logo"
          className="mx-auto mb-8 w-32 h-32 object-contain"
        />
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          Oops! Looks like you've ventured off-piste. Let's get you back on track.
        </p>
        <Link
          to="/"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
