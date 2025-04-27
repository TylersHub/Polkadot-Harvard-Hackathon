import React from 'react';
import { useWallet } from '../../context/WalletContext';
import { Wallet } from 'lucide-react';
import { truncateAddress } from '../../utils/formatters';

const WalletButton: React.FC = () => {
  const { account, isConnected, isConnecting, openModal, balance } = useWallet();

  // Render different states based on connection status
  if (isConnected && account) {
    return (
      <div className="relative group">
        <button
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 transition-colors"
        >
          <div className="h-2 w-2 rounded-full bg-success-500" />
          <span className="font-medium">{truncateAddress(account)}</span>
        </button>
        
        <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-neutral-200 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
          <div className="p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-neutral-500">Balance</span>
              <span className="font-medium">{Number(balance).toFixed(4)} ETH</span>
            </div>
            <div className="border-t border-neutral-200 pt-2 mt-2">
              <a 
                href={`https://etherscan.io/address/${account}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-primary-600 hover:text-primary-700 mb-1"
              >
                View on Etherscan
              </a>
              <button 
                className="block text-sm text-error-600 hover:text-error-700 w-full text-left"
                onClick={() => {}}
              >
                Disconnect Wallet
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // For connecting or not connected states
  return (
    <button
      onClick={openModal}
      disabled={isConnecting}
      className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {isConnecting ? (
        <>
          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>Connecting...</span>
        </>
      ) : (
        <>
          <Wallet className="h-4 w-4" />
          <span>Connect Wallet</span>
        </>
      )}
    </button>
  );
};

export default WalletButton;