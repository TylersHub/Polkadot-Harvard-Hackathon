import React from 'react';
import ListingCard from './ListingCard';
import { Loan } from '../../types';
import { CircleX } from 'lucide-react';

interface ListingsGridProps {
  listings: Loan[];
  isLoading: boolean;
  error: any;
}

const ListingsGrid: React.FC<ListingsGridProps> = ({ listings, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-neutral-600">Loading investment opportunities...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center text-center max-w-sm">
          <CircleX className="h-12 w-12 text-error-500 mb-3" />
          <h3 className="text-xl font-semibold mb-2">Error Loading Listings</h3>
          <p className="text-neutral-600 mb-4">
            We encountered a problem while loading the investment opportunities. Please try again.
          </p>
          <button className="btn btn-primary">Retry</button>
        </div>
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center text-center max-w-sm">
          <h3 className="text-xl font-semibold mb-2">No Listings Found</h3>
          <p className="text-neutral-600 mb-4">
            There are currently no investment opportunities available in this category.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {listings.map((listing) => (
        <ListingCard key={listing._id} listing={listing} />
      ))}
    </div>
  );
};

export default ListingsGrid;