import React, { useEffect, useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { useListings } from '../context/ListingsContext';
import { Link } from 'react-router-dom';
import { Loan } from '../types';
import { formatAmount, formatTimeRemaining, formatFundedPercentage, truncateAddress } from '../utils/formatters';
import { Copy, ExternalLink, Wallet, TrendingUp, LayoutList } from 'lucide-react';
import { withdrawFromLoan } from '../api/listings';
import { MOCK_ENABLED } from '../config';
import { mockWithdrawTransaction } from '../utils/mockData';

const ProfilePage: React.FC = () => {
  const { account, isConnected, balance, openModal } = useWallet();
  const { listings } = useListings();
  
  const [userInvestments, setUserInvestments] = useState<Loan[]>([]);
  const [userListings, setUserListings] = useState<Loan[]>([]);
  const [isWithdrawing, setIsWithdrawing] = useState<Record<string, boolean>>({});
  const [successMessages, setSuccessMessages] = useState<Record<string, string>>({});
  
  // For demo purposes, we'll randomly assign some listings to the user
  useEffect(() => {
    if (isConnected && account && listings.length > 0) {
      // Randomly pick 30% of listings as investments
      const investmentCount = Math.floor(listings.length * 0.3);
      const shuffled = [...listings].sort(() => 0.5 - Math.random());
      
      setUserInvestments(shuffled.slice(0, investmentCount));
      
      // Randomly pick 20% of listings as created by the user
      const listingCount = Math.floor(listings.length * 0.2);
      setUserListings(shuffled.slice(investmentCount, investmentCount + listingCount));
    } else {
      setUserInvestments([]);
      setUserListings([]);
    }
  }, [account, isConnected, listings]);
  
  const handleCopyAddress = () => {
    if (account) {
      navigator.clipboard.writeText(account);
      alert('Address copied to clipboard!');
    }
  };
  
  const handleWithdraw = async (loanId: number) => {
    if (!isConnected || !account) {
      openModal();
      return;
    }
    
    try {
      setIsWithdrawing((prev) => ({ ...prev, [loanId]: true }));
      
      // Use mock or real API based on config
      const result = MOCK_ENABLED
        ? await mockWithdrawTransaction(loanId, account)
        : await withdrawFromLoan(loanId, account);
      
      setSuccessMessages((prev) => ({ 
        ...prev, 
        [loanId]: `Withdrawal successful! Transaction: ${result.txHash.substring(0, 8)}...`
      }));
      
      // Remove from investments after withdrawal
      setUserInvestments((prev) => prev.filter(loan => loan.loanId !== loanId));
    } catch (error) {
      console.error('Error withdrawing from loan:', error);
      alert('Failed to withdraw. Please try again.');
    } finally {
      setIsWithdrawing((prev) => ({ ...prev, [loanId]: false }));
    }
  };
  
  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-sm p-8 text-center">
          <h1 className="text-2xl font-semibold mb-4">Connect Your Wallet</h1>
          <p className="text-neutral-600 mb-6">
            You need to connect your wallet to view your profile and investments.
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
      <h1 className="text-3xl font-semibold mb-8">Your Profile</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mb-4">
                <Wallet className="h-8 w-8 text-primary-600" />
              </div>
              <h2 className="text-xl font-semibold mb-1">
                {truncateAddress(account || '', 6)}
              </h2>
              <div className="flex items-center gap-2 text-neutral-500 text-sm">
                <button
                  onClick={handleCopyAddress}
                  className="text-primary-600 hover:text-primary-700 flex items-center gap-1"
                >
                  <Copy className="h-3 w-3" />
                  Copy
                </button>
                <span>|</span>
                <a
                  href={`https://etherscan.io/address/${account}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700 flex items-center gap-1"
                >
                  <ExternalLink className="h-3 w-3" />
                  View on Etherscan
                </a>
              </div>
            </div>
            
            <div className="border-t border-neutral-200 pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-neutral-600">Balance</span>
                <span className="font-semibold">{Number(balance).toFixed(4)} ETH</span>
              </div>
              
              <div className="flex justify-between items-center mb-4">
                <span className="text-neutral-600">Active Investments</span>
                <span className="font-semibold">{userInvestments.length}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-neutral-600">Created Listings</span>
                <span className="font-semibold">{userListings.length}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="border-b border-neutral-200">
              <div className="flex">
                <button className="px-6 py-4 text-primary-600 border-b-2 border-primary-600 font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Your Investments
                </button>
                <button className="px-6 py-4 text-neutral-600 hover:text-neutral-800 font-medium flex items-center gap-2">
                  <LayoutList className="h-4 w-4" />
                  Your Listings
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {userInvestments.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-neutral-600 mb-4">You don't have any active investments yet.</p>
                  <Link to="/listings" className="btn btn-primary">
                    Browse Investment Opportunities
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {userInvestments.map((loan) => {
                    const {
                      _id,
                      loanId,
                      title = 'Untitled Investment',
                      principal,
                      maturity,
                      funded = '0',
                    } = loan;
                    
                    const timeRemaining = formatTimeRemaining(maturity);
                    const fundedPercentage = formatFundedPercentage(funded, principal);
                    const hasMatured = timeRemaining === 'Expired';
                    
                    return (
                      <div key={_id} className="border border-neutral-200 rounded-lg overflow-hidden">
                        <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex-1">
                            <Link
                              to={`/listings/${_id}`}
                              className="text-lg font-medium hover:text-primary-600 transition-colors"
                            >
                              {title}
                            </Link>
                            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2 text-sm text-neutral-500">
                              <div>
                                Invested: {formatAmount(funded)}
                              </div>
                              <div>
                                Status: {hasMatured ? (
                                  <span className="text-success-600 font-medium">Ready to withdraw</span>
                                ) : (
                                  <span className="text-warning-600 font-medium">{timeRemaining}</span>
                                )}
                              </div>
                            </div>
                            
                            <div className="mt-3">
                              <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-primary-500 rounded-full"
                                  style={{ width: `${fundedPercentage}%` }}
                                />
                              </div>
                              <div className="flex justify-between text-xs text-neutral-500 mt-1">
                                <span>{fundedPercentage}% Funded</span>
                                <span>{formatAmount(principal)} Total</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex-shrink-0">
                            {successMessages[loanId] ? (
                              <div className="text-sm text-success-600">
                                {successMessages[loanId]}
                              </div>
                            ) : (
                              <button
                                onClick={() => handleWithdraw(loanId)}
                                disabled={!hasMatured || isWithdrawing[loanId]}
                                className={`btn ${
                                  hasMatured ? 'btn-accent' : 'btn-secondary opacity-60'
                                }`}
                              >
                                {isWithdrawing[loanId] ? (
                                  <div className="flex items-center gap-2">
                                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    <span>Processing...</span>
                                  </div>
                                ) : (
                                  <span>Withdraw Funds</span>
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;