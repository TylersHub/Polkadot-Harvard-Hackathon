import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { createListing } from '../api/listings';
import { CreateLoanPayload } from '../types';
import { CATEGORIES, MOCK_ENABLED, DEFAULT_MATURITY_DAYS } from '../config';
import { getMockListings } from '../utils/mockData';

const CreateListingPage: React.FC = () => {
  const navigate = useNavigate();
  const { account, isConnected, openModal } = useWallet();
  
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    principal: string;
    startBps: string;
    minBps: string;
    maturityDays: string;
    category: string;
    imageUrl: string;
  }>({
    title: '',
    description: '',
    principal: '1',
    startBps: '1000',
    minBps: '400',
    maturityDays: '30',
    category: 'other',
    imageUrl: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected || !account) {
      openModal();
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Validate form data
      if (!formData.title.trim()) {
        throw new Error('Title is required');
      }
      
      if (!formData.description.trim()) {
        throw new Error('Description is required');
      }
      
      if (parseFloat(formData.principal) <= 0) {
        throw new Error('Principal amount must be greater than 0');
      }
      
      // Convert form data to API payload
      const now = Math.floor(Date.now() / 1000);
      const maturityTime = now + (parseInt(formData.maturityDays) * 24 * 3600);
      
      // Get next loan ID (in a real app, this would come from the backend)
      let nextLoanId = 1;
      if (MOCK_ENABLED) {
        const listings = await getMockListings();
        nextLoanId = Math.max(...listings.map(l => l.loanId), 0) + 1;
      }
      
      const payload: CreateLoanPayload = {
        loanId: nextLoanId,
        borrower: account,
        principal: (parseFloat(formData.principal) * 1e18).toString(), // Convert to wei
        startBps: parseInt(formData.startBps),
        minBps: parseInt(formData.minBps),
        maturity: maturityTime,
        category: formData.category,
        title: formData.title,
        description: formData.description,
        imageUrl: formData.imageUrl || undefined,
      };
      
      // In mock mode, we'll just navigate to listings
      if (MOCK_ENABLED) {
        setTimeout(() => {
          navigate('/listings');
        }, 1500);
      } else {
        // Call API to create listing
        const result = await createListing(payload);
        navigate(`/listings/${result._id}`);
      }
    } catch (err: any) {
      console.error('Error creating listing:', err);
      setError(err.message || 'Failed to create listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-sm p-8 text-center">
          <h1 className="text-2xl font-semibold mb-4">Connect Your Wallet</h1>
          <p className="text-neutral-600 mb-6">
            You need to connect your wallet to create a new investment opportunity.
          </p>
          <button
            onClick={openModal}
            className="btn btn-primary py-3 px-6"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-6">Create Investment Opportunity</h1>
      
      <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 max-w-3xl mx-auto">
        {error && (
          <div className="bg-error-50 border border-error-200 rounded-lg p-4 mb-6 text-error-700">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="md:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-neutral-700 mb-1">
                Title *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Luxury Car Rental Business Expansion"
                className="input w-full"
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-1">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your investment opportunity in detail..."
                className="input w-full h-32 resize-none"
                required
              />
            </div>
            
            <div>
              <label htmlFor="principal" className="block text-sm font-medium text-neutral-700 mb-1">
                Principal Amount (ETH) *
              </label>
              <input
                id="principal"
                name="principal"
                type="number"
                step="0.1"
                min="0.1"
                value={formData.principal}
                onChange={handleChange}
                className="input w-full"
                required
              />
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-neutral-700 mb-1">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="input w-full"
                required
              >
                {CATEGORIES.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="startBps" className="block text-sm font-medium text-neutral-700 mb-1">
                Starting Interest Rate (basis points) *
              </label>
              <input
                id="startBps"
                name="startBps"
                type="number"
                min="100"
                max="10000"
                value={formData.startBps}
                onChange={handleChange}
                className="input w-full"
                required
              />
              <p className="text-xs text-neutral-500 mt-1">
                1000 basis points = 10% interest rate
              </p>
            </div>
            
            <div>
              <label htmlFor="minBps" className="block text-sm font-medium text-neutral-700 mb-1">
                Minimum Interest Rate (basis points) *
              </label>
              <input
                id="minBps"
                name="minBps"
                type="number"
                min="100"
                max="10000"
                value={formData.minBps}
                onChange={handleChange}
                className="input w-full"
                required
              />
            </div>
            
            <div>
              <label htmlFor="maturityDays" className="block text-sm font-medium text-neutral-700 mb-1">
                Maturity Period (days) *
              </label>
              <input
                id="maturityDays"
                name="maturityDays"
                type="number"
                min="1"
                max="365"
                value={formData.maturityDays}
                onChange={handleChange}
                className="input w-full"
                required
              />
            </div>
            
            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-neutral-700 mb-1">
                Image URL (optional)
              </label>
              <input
                id="imageUrl"
                name="imageUrl"
                type="url"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="input w-full"
              />
            </div>
            
            <div className="md:col-span-2 mt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn btn-primary py-3"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Creating Listing...</span>
                  </div>
                ) : (
                  <span>Create Investment Opportunity</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateListingPage;