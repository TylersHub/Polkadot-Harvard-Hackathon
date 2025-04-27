import React from 'react';
import { CATEGORIES } from '../../config';

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
  selectedCategory, 
  onSelectCategory 
}) => {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-medium mb-4">Categories</h2>
      <div className="flex flex-wrap gap-2">
        <button
          key="all"
          onClick={() => onSelectCategory('all')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
            selectedCategory === 'all'
              ? 'bg-primary-500 text-white'
              : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
          }`}
        >
          All Categories
        </button>
        
        {CATEGORIES.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
              selectedCategory === category.id
                ? 'bg-primary-500 text-white'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            {/* Dynamically import icon based on category */}
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;