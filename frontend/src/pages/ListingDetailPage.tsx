import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { Loan } from '../types';
import { formatAmount, formatInterestRate, formatDate, formatTimeRemaining, formatFundedPercentage, truncateAddress } from '../utils/formatters';
import FundForm from '../components/listings/FundForm';
import { Building2, Car, UtensilsCrossed, Briefcase, Laptop, ShoppingBag, Calendar, DollarSign, Percent, Clock, User, ArrowLeft } from 'lucide-react';
import { MOCK_ENABLED } from '../config';
import { getMockListings } from '../utils/mockData';
import { fetchListingById } from '../api/listings';

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

const ListingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { account, isConnected } = useWallet();
  const [listing, setListing] = useState<Loan | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        let data: Loan | null = null;
        
        if (MOCK_ENABLED) {
          const listings = await getMockListings();
          data = listings.find(l => l._id === id) || null;
        } else if (id) {
          data = await fetchListingById(id);
        }
        
        if (!data) {
          throw new Error('Listing not found');
        }
        
        setListing(data);
      } catch (err) {
        console.error('Error fetching listing:', err);
        setError('Failed to load investment opportunity.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchListing();
  }, [id]);
  
  const handleInvestmentSuccess = () => {
    // Refetch the listing to update funded amount
    if (id) {
      // In a real app, we would refetch the listing here
      // For mock data, we'll just increase the funded amount by 20%
      if (listing && MOCK_ENABLED) {
        const newFunded = listing.funded
          ? (BigInt(listing.funded) + BigInt(listing.principal) / BigInt(5)).toString()
          : (BigInt(listing.principal) / BigInt(5)).toString();
        
        setListing({
          ...listing,
          funded: newFunded
        });
      }
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-neutral-600">Loading investment opportunity...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !listing) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center text-center max-w-md mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Opportunity Not Found</h2>
          <p className="text-neutral-600 mb-6">
            {error || "We couldn't find the investment opportunity you're looking for."}
          </p>
          <Link to="/listings" className="btn btn-primary flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Opportunities
          </Link>
        </div>
      </div>
    );
  }
  
  const { 
    title = 'Untitled Investment Opportunity',
    description = 'No description provided.',
    principal,
    startBps,
    minBps,
    maturity,
    funded = '0',
    borrower,
    category = 'other',
    imageUrl = 'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg'
  } = listing;
  
  const fundedPercentage = formatFundedPercentage(funded, principal);
  const timeRemaining = formatTimeRemaining(maturity);
  
  return (
    <div className="bg-neutral-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <Link 
          to="/listings" 
          className="inline-flex items-center text-neutral-600 hover:text-primary-600 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Listings
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="relative h-64 md:h-80 overflow-hidden">
                <img 
                  src={imageUrl} 
                  alt={title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
                    <div className="flex items-center gap-1">
                      {getCategoryIcon(category)}
                      <span className="capitalize">{category.replace('-', ' ')}</span>
                    </div>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-semibold text-white">{title}</h1>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-neutral-600 mb-6">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>Listed by {truncateAddress(borrower)}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-neutral-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-neutral-600 text-sm mb-1">
                      <DollarSign className="h-4 w-4" />
                      <span>Principal</span>
                    </div>
                    <div className="font-semibold">{formatAmount(principal)}</div>
                  </div>
                  
                  <div className="bg-neutral-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-neutral-600 text-sm mb-1">
                      <Percent className="h-4 w-4" />
                      <span>Interest Rate</span>
                    </div>
                    <div className="font-semibold">{formatInterestRate(startBps)}</div>
                  </div>
                  
                  <div className="bg-neutral-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-neutral-600 text-sm mb-1">
                      <Calendar className="h-4 w-4" />
                      <span>Maturity Date</span>
                    </div>
                    <div className="font-semibold">{formatDate(maturity)}</div>
                  </div>
                  
                  <div className="bg-neutral-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-neutral-600 text-sm mb-1">
                      <Clock className="h-4 w-4" />
                      <span>Time Remaining</span>
                    </div>
                    <div className="font-semibold">{timeRemaining}</div>
                  </div>
                </div>
                
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">Description</h2>
                  <div className="text-neutral-700 space-y-4">
                    <p>{description}</p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-neutral-600 mb-2">
                    <span>Funding Progress</span>
                    <span>{fundedPercentage}% Funded</span>
                  </div>
                  <div className="h-3 bg-neutral-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary-500 rounded-full transition-all duration-500"
                      style={{ width: `${fundedPercentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm text-neutral-500 mt-2">
                    <span>{formatAmount(funded)} raised</span>
                    <span>of {formatAmount(principal)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <FundForm 
              loan={listing}
              onSuccess={handleInvestmentSuccess}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetailPage;