import React, { useEffect } from 'react';
import { useListings } from '../context/ListingsContext';
import ListingsGrid from '../components/listings/ListingsGrid';
import CategoryFilter from '../components/listings/CategoryFilter';
import { Search } from 'lucide-react';

const ListingsPage: React.FC = () => {
  const { 
    listings, 
    isLoading, 
    error,
    categorizedListings,
    selectedCategory,
    setSelectedCategory
  } = useListings();
  
  const [searchTerm, setSearchTerm] = React.useState('');
  
  // Filter listings based on search term and selected category
  const filteredListings = React.useMemo(() => {
    const categoryListings = selectedCategory === 'all' 
      ? listings 
      : (categorizedListings[selectedCategory] || []);
    
    if (!searchTerm) return categoryListings;
    
    const term = searchTerm.toLowerCase();
    return categoryListings.filter(listing => 
      (listing.title && listing.title.toLowerCase().includes(term)) ||
      (listing.description && listing.description.toLowerCase().includes(term))
    );
  }, [listings, categorizedListings, selectedCategory, searchTerm]);
  
  // Reset search when category changes
  useEffect(() => {
    setSearchTerm('');
  }, [selectedCategory]);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-6">Investment Opportunities</h1>
      
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="w-full md:w-64 flex-shrink-0">
          <CategoryFilter 
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>
        
        <div className="flex-1">
          <div className="mb-6 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-neutral-400" />
            </div>
            <input
              type="text"
              placeholder="Search opportunities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10 w-full"
            />
          </div>
          
          <ListingsGrid 
            listings={filteredListings}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </div>
    </div>
  );
};

export default ListingsPage;