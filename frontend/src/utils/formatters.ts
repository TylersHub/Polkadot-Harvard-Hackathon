import { ethers } from "ethers";

// Format amount to ETH/USDC with appropriate decimals
export const formatAmount = (
  amount: string,
  isUSDC: boolean = false,
  decimals: number = 18
): string => {
  try {
    const value = ethers.formatUnits(amount, decimals);
    return `${parseFloat(value).toFixed(4)} ${isUSDC ? 'USDC' : 'ETH'}`;
  } catch (error) {
    console.error('Error formatting amount:', error);
    return '0.0000';
  }
};

// Format interest rate from basis points to percentage
export const formatInterestRate = (basisPoints: number): string => {
  const percentage = basisPoints / 100;
  return `${percentage.toFixed(2)}%`;
};

// Format timestamp to relative time from now
export const formatTimeRemaining = (timestamp: number): string => {
  const now = Math.floor(Date.now() / 1000);
  const difference = timestamp - now;
  
  if (difference <= 0) {
    return 'Expired';
  }
  
  const days = Math.floor(difference / (24 * 3600));
  const hours = Math.floor((difference % (24 * 3600)) / 3600);
  const minutes = Math.floor((difference % 3600) / 60);
  
  if (days > 0) {
    return `${days}d ${hours}h remaining`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m remaining`;
  } else {
    return `${minutes}m remaining`;
  }
};

// Format date from timestamp
export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Format percentage funded
export const formatFundedPercentage = (funded: string, principal: string): number => {
  try {
    if (!funded || funded === '0') return 0;
    
    const fundedBN = ethers.parseEther(ethers.formatEther(funded));
    const principalBN = ethers.parseEther(ethers.formatEther(principal));
    
    const percentage = (Number(fundedBN) / Number(principalBN)) * 100;
    return Math.min(Math.round(percentage), 100);
  } catch (error) {
    console.error('Error calculating funded percentage:', error);
    return 0;
  }
};

// Truncate Ethereum address
export const truncateAddress = (address: string, chars: number = 4): string => {
  if (!address) return '';
  return `${address.substring(0, chars + 2)}...${address.substring(42 - chars)}`;
};