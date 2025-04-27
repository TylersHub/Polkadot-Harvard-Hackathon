import React from 'react';
import { Link } from 'react-router-dom';
import { Loan } from '../../types';
import { formatAmount, formatInterestRate, formatTimeRemaining, formatFundedPercentage } from '../../utils/formatters';
import { Building2, Car, UtensilsCrossed, Briefcase, Laptop, ShoppingBag } from 'lucide-react';
import { CATEGORIES } from '../../config';

interface ListingCardProps {
  listing: Loan;
}

const getCategoryIcon = (category?: string) => {
  switch (category) {
    case 'car':
      return <Car className="h-5 w-5" />;
    case 'bakery':
      return <UtensilsCrossed className="h-5 w-5" />;
    case 'real-estate':
      return <Building2 className="h-5 w-5" />;
    case 'tech':
      return <Laptop className="h-5 w-5" />;
    case 'retail':
      return <ShoppingBag className="h-5 w-5" />;
    default:
      return <Briefcase className="h-5 w-5" />;
  }
};

const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
  const { 
    _id, 
    title = 'Untitled Investment Opportunity', 
    principal, 
    startBps, 
    maturity, 
    funded, 
    category = 'other',
    imageUrl = 'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg'
  } = listing;
  
  const fundedPercentage = formatFundedPercentage(funded, principal);
  const timeRemaining = formatTimeRemaining(maturity);
  const categoryObj = CATEGORIES.find(c => c.id === category) || CATEGORIES[CATEGORIES.length - 1];
  
  return (
    <Link 
      to={`/listings/${_id}`} 
      className="card hover:shadow-xl transition-all duration-300 group overflow-hidden flex flex-col h-full"
    >
      <div className="relative w-full h-48 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
          <span className="badge badge-warning">
            {formatInterestRate(startBps)} APY
          </span>
          <span className="badge badge-primary">
            {formatAmount(principal)}
          </span>
        </div>
      </div>
      
      <div className="flex-1 p-4 flex flex-col">
        <div className="flex items-center gap-2 text-sm text-neutral-500 mb-2">
          <div className="flex items-center gap-1">
            {getCategoryIcon(category)}
            <span>{categoryObj.name}</span>
          </div>
        </div>
        
        <h3 className="text-lg font-medium mb-2 line-clamp-2">{title}</h3>
        
        <div className="mt-auto">
          <div className="mb-2">
            <div className="flex justify-between text-sm text-neutral-600 mb-1">
              <span>Funding Progress</span>
              <span>{fundedPercentage}%</span>
            </div>
            <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary-500 rounded-full transition-all duration-300"
                style={{ width: `${fundedPercentage}%` }}
              />
            </div>
          </div>
          
          <div className="text-sm text-warning-600 font-medium">
            {timeRemaining}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ListingCard;