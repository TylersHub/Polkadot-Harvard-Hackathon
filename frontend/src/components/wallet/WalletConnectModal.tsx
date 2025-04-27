import React from 'react';
import { useWallet } from '../../context/WalletContext';
import { Wallet, X } from 'lucide-react';

const WalletConnectModal: React.FC = () => {
  const { closeModal, connectWallet, isConnecting } = useWallet();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full animate-slide-up">
        <div className="flex justify-between items-center p-4 border-b border-neutral-200">
          <h3 className="text-xl font-semibold">Connect Your Wallet</h3>
          <button 
            onClick={closeModal}
            className="p-1 rounded-full hover:bg-neutral-100 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-neutral-600" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="mb-6 text-neutral-600">
            <p>Connect your cryptocurrency wallet to access the platform features, including creating listings and investing in opportunities.</p>
          </div>
          
          <button
            onClick={connectWallet}
            disabled={isConnecting}
            className="flex items-center justify-center w-full btn btn-primary py-3 rounded-lg gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isConnecting ? (
              <>
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <Wallet className="h-5 w-5" />
                <span>Connect MetaMask</span>
              </>
            )}
          </button>
          
          <div className="mt-4 text-sm text-neutral-500 text-center">
            <p>Don't have a wallet?{' '}
              <a 
                href="https://metamask.io/download/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700"
              >
                Install MetaMask
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletConnectModal;