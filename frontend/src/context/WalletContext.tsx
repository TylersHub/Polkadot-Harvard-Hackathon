import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import { WalletStatus } from '../types';

interface WalletContextType {
  account: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  status: WalletStatus;
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  balance: string;
  chainId: number | null;
  isModalOpen: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  openModal: () => void;
  closeModal: () => void;
}

const WalletContext = createContext<WalletContextType>({} as WalletContextType);

export const useWallet = () => useContext(WalletContext);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [status, setStatus] = useState<WalletStatus>('disconnected');
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [balance, setBalance] = useState<string>('0');
  const [chainId, setChainId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Initialize provider if window.ethereum exists
  useEffect(() => {
    const initProvider = async () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(provider);
        
        // Check if we have a connected account
        try {
          const accounts = await provider.listAccounts();
          if (accounts.length > 0) {
            const account = accounts[0];
            const signer = await provider.getSigner();
            const network = await provider.getNetwork();
            const balance = await provider.getBalance(account.address);
            
            setAccount(account.address);
            setSigner(signer);
            setChainId(Number(network.chainId));
            setBalance(ethers.formatEther(balance));
            setStatus('connected');
          }
        } catch (error) {
          console.error("Failed to initialize wallet:", error);
        }
      }
    };

    initProvider();
  }, []);

  // Listen for account and chain changes
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else if (accounts[0] !== account) {
        setAccount(accounts[0]);
        updateWalletInfo();
      }
    };

    const handleChainChanged = (chainIdHex: string) => {
      setChainId(parseInt(chainIdHex, 16));
      updateWalletInfo();
    };

    const handleDisconnect = () => {
      disconnectWallet();
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);
    window.ethereum.on('disconnect', handleDisconnect);

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
        window.ethereum.removeListener('disconnect', handleDisconnect);
      }
    };
  }, [account]);

  const updateWalletInfo = async () => {
    if (!provider || !account) return;
    
    try {
      const signer = await provider.getSigner();
      const balance = await provider.getBalance(account);
      
      setSigner(signer);
      setBalance(ethers.formatEther(balance));
    } catch (error) {
      console.error("Failed to update wallet info:", error);
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      window.open('https://metamask.io/download/', '_blank');
      return;
    }

    try {
      setStatus('connecting');
      const provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(provider);
      
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      if (accounts.length > 0) {
        const account = accounts[0];
        const signer = await provider.getSigner();
        const network = await provider.getNetwork();
        const balance = await provider.getBalance(account);
        
        setAccount(account);
        setSigner(signer);
        setChainId(Number(network.chainId));
        setBalance(ethers.formatEther(balance));
        setStatus('connected');
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      setStatus('disconnected');
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setSigner(null);
    setBalance('0');
    setStatus('disconnected');
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const contextValue: WalletContextType = {
    account,
    isConnected: status === 'connected',
    isConnecting: status === 'connecting',
    status,
    provider,
    signer,
    balance,
    chainId,
    isModalOpen,
    connectWallet,
    disconnectWallet,
    openModal,
    closeModal,
  };

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
};