import React from 'react';
import { Link } from 'react-router-dom';
import { useListings } from '../context/ListingsContext';
import ListingCard from '../components/listings/ListingCard';
import { ArrowRight, TrendingUp, Shield, Wallet, Clock } from 'lucide-react';

const HomePage: React.FC = () => {
  const { listings, isLoading } = useListings();
  
  // Get 4 featured listings
  const featuredListings = isLoading ? [] : listings.slice(0, 4);
  
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-800 to-primary-900 text-white pt-16 pb-20 lg:pt-20 lg:pb-28">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="animate-fade-in animate-slide-up">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                Invest in Real-World Assets on the Blockchain
              </h1>
              <p className="text-lg text-primary-100 mb-8 max-w-xl">
                DeFund connects asset owners with investors, enabling anyone to participate
                in funding real businesses, properties, and more with complete transparency.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  to="/listings" 
                  className="btn bg-warning-500 hover:bg-warning-600 text-white px-6 py-3 rounded-lg font-medium text-lg"
                >
                  Explore Opportunities
                </Link>
                <Link
                  to="/create-listing"
                  className="btn bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-medium text-lg backdrop-blur-sm"
                >
                  List Your Asset
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <img 
                src="https://images.pexels.com/photos/3943723/pexels-photo-3943723.jpeg"
                alt="Decentralized Finance" 
                className="rounded-xl shadow-lg w-full object-cover max-h-[500px]"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Listings */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-semibold">Featured Opportunities</h2>
            <Link 
              to="/listings" 
              className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
            >
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading ? (
              <div className="col-span-full flex justify-center py-10">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-neutral-600">Loading opportunities...</span>
                </div>
              </div>
            ) : featuredListings.length > 0 ? (
              featuredListings.map((listing) => (
                <ListingCard key={listing._id} listing={listing} />
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-neutral-600">No listings available at the moment.</p>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-semibold mb-4">How It Works</h2>
            <p className="text-neutral-600">
              Our platform makes investing in real-world assets simple, secure, and transparent.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Wallet className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Connect Your Wallet</h3>
              <p className="text-neutral-600">
                Link your cryptocurrency wallet to browse opportunities and make investments securely.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="bg-warning-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="h-8 w-8 text-warning-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Invest in Opportunities</h3>
              <p className="text-neutral-600">
                Browse available listings and invest any amount in opportunities that interest you.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="bg-success-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="h-8 w-8 text-success-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Earn Returns</h3>
              <p className="text-neutral-600">
                Once the investment matures, withdraw your principal plus interest directly to your wallet.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Benefits */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-semibold mb-6">Secure, Transparent, Decentralized</h2>
              <p className="text-neutral-600 mb-8">
                Our platform leverages blockchain technology to provide a trustless environment 
                for investment. Every transaction is recorded on-chain, providing complete
                transparency and security.
              </p>
              
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="bg-primary-100 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Shield className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Secure Investments</h3>
                    <p className="text-sm text-neutral-600">
                      Smart contracts secure your investment, ensuring funds can only be 
                      accessed according to the agreed terms.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="bg-warning-100 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="h-5 w-5 text-warning-600" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Competitive Returns</h3>
                    <p className="text-sm text-neutral-600">
                      Access investment opportunities with attractive interest rates, often 
                      higher than traditional financial products.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="bg-success-100 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="h-5 w-5 text-success-600" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Flexible Timelines</h3>
                    <p className="text-sm text-neutral-600">
                      Choose from opportunities with various maturity periods, from short-term 
                      to long-term investments.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="hidden lg:block">
              <img 
                src="https://images.pexels.com/photos/5980743/pexels-photo-5980743.jpeg"
                alt="Secure Blockchain Investments" 
                className="rounded-xl shadow-lg w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-primary-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-semibold mb-4">Ready to Start Investing?</h2>
          <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of investors who are already earning returns on our platform.
            Start with as little as 0.01 ETH.
          </p>
          <Link 
            to="/listings" 
            className="btn bg-warning-500 hover:bg-warning-600 text-white px-8 py-3 rounded-lg font-medium text-lg"
          >
            Explore Opportunities
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;