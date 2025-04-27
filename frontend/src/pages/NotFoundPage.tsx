import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary-800 mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-neutral-600 mb-8 max-w-md mx-auto">
          We couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </p>
        <Link 
          to="/" 
          className="btn btn-primary inline-flex items-center gap-2 px-6 py-3"
        >
          <Home className="h-5 w-5" />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;