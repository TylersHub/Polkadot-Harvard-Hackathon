import React, { useState } from 'react';
import { useWallet } from '../../context/WalletContext';
import { Loan } from '../../types';
import { formatAmount } from '../../utils/formatters';
import { ethers } from 'ethers';
import { fundLoan } from '../../api/listings';
import { MOCK_ENABLED } from '../../config';
import { mockFundTransaction } from '../../utils/mockData';

interface FundFormProps {
  loan: Loan;
  onSuccess: () => void;
}

const FundForm: React.FC<FundFormProps> = ({ loan, onSuccess }) => {
  const { account, isConnected, openModal } = useWallet();
  const [amount, setAmount] = useState<string>('');
  const [useUSDC, setUseUSDC] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers and decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const handleFund = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected || !account) {
      openModal();
      return;
    }
    
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount to invest');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Convert ETH to Wei
      const amountInWei = ethers.parseEther(amount).toString();
      
      // Use mock or real API based on config
      const result = MOCK_ENABLED
        ? await mockFundTransaction(loan.loanId, account, amountInWei)
        : await fundLoan(loan.loanId, account, amountInWei, useUSDC);
      
      setTxHash(result.txHash);
      setSuccess(true);
      onSuccess();
    } catch (error) {
      console.error('Error funding loan:', error);
      setError('Failed to process investment. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-5">
      <h3 className="text-lg font-semibold mb-4">Invest in this opportunity</h3>
      
      {success && txHash ? (
        <div className="bg-success-50 border border-success-200 rounded-lg p-4 mb-4">
          <h4 className="font-medium text-success-800 mb-2">Investment Successful!</h4>
          <p className="text-success-700 text-sm mb-2">
            Your transaction has been submitted and is being processed.
          </p>
          <a
            href={`https://etherscan.io/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary-600 hover:text-primary-700 underline"
          >
            View transaction on Etherscan
          </a>
        </div>
      ) : (
        <form onSubmit={handleFund}>
          {error && (
            <div className="bg-error-50 border border-error-200 rounded-lg p-3 mb-4 text-sm text-error-700">
              {error}
            </div>
          )}
          
          <div className="mb-4">
            <label htmlFor="amount" className="block text-sm font-medium text-neutral-700 mb-1">
              Amount to Invest
            </label>
            <div className="relative">
              <input
                id="amount"
                type="text"
                value={amount}
                onChange={handleAmountChange}
                placeholder="0.00"
                className="input w-full pr-16"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <span className="text-neutral-500">{useUSDC ? 'USDC' : 'ETH'}</span>
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Investment Currency
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setUseUSDC(false)}
                className={`flex-1 btn ${
                  !useUSDC ? 'btn-primary' : 'btn-secondary'
                }`}
              >
                ETH
              </button>
              <button
                type="button"
                onClick={() => setUseUSDC(true)}
                className={`flex-1 btn ${
                  useUSDC ? 'btn-primary' : 'btn-secondary'
                }`}
              >
                USDC
              </button>
            </div>
          </div>
          
          <div className="text-sm text-neutral-600 mb-4">
            <p className="mb-2">
              Available to fund: {formatAmount(
                ethers.parseEther(
                  (Number(ethers.formatEther(loan.principal)) - Number(ethers.formatEther(loan.funded || '0'))).toString()
                ).toString()
              )}
            </p>
            <p>
              Interest rate: {(loan.startBps / 100).toFixed(2)}%
            </p>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full btn btn-primary py-3"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processing...</span>
              </div>
            ) : (
              <span>Invest Now</span>
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default FundForm;