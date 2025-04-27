import React from 'react';
import { Outlet } from 'react-router-dom';
import { Link, useLocation } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import WalletButton from '../components/wallet/WalletButton';
import { LayoutDashboard, Plus, Home, User, Menu, X } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { isConnected } = useWallet();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Investments', href: '/listings', icon: LayoutDashboard },
    { name: 'Create Listing', href: '/create-listing', icon: Plus, requiresWallet: true },
    { name: 'Profile', href: '/profile', icon: User, requiresWallet: true },
  ];

  // Filter navigation items based on wallet connection
  const filteredNavigation = navigation.filter(
    (item) => !item.requiresWallet || (item.requiresWallet && isConnected)
  );

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-primary-800 flex items-center">
            <span className="text-warning-500">De</span>Fund
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {filteredNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium hover:text-primary-600 transition-colors ${
                  location.pathname === item.href
                    ? 'text-primary-600'
                    : 'text-neutral-600'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:block">
            <WalletButton />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden absolute top-full left-0 right-0 bg-white border-b border-neutral-200 transform transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
          }`}
        >
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            {filteredNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center p-3 rounded-lg font-medium hover:bg-neutral-100 transition-colors ${
                  location.pathname === item.href
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-neutral-600'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            ))}
            <div className="pt-2">
              <WalletButton />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-neutral-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold mb-4">
                <span className="text-warning-500">De</span>Fund
              </div>
              <p className="text-neutral-400 mb-4">
                A decentralized investment platform empowering users to fund and invest in real-world assets.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Platform</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/listings" className="text-neutral-400 hover:text-white transition-colors">
                    Browse Investments
                  </Link>
                </li>
                <li>
                  <Link to="/create-listing" className="text-neutral-400 hover:text-white transition-colors">
                    Create a Listing
                  </Link>
                </li>
                <li>
                  <Link to="/profile" className="text-neutral-400 hover:text-white transition-colors">
                    Your Profile
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                    FAQs
                  </a>
                </li>
                <li>
                  <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                    Documentation
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-neutral-700 mt-8 pt-8 text-center text-neutral-500 text-sm">
            <p>&copy; {new Date().getFullYear()} DeFund. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;