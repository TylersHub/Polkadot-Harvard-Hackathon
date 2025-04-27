import axios from 'axios';
import { API_BASE_URL } from '../config';
import { CreateLoanPayload, Loan } from '../types';

// Fetch all loan listings
export const fetchListings = async (): Promise<Loan[]> => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/listings`);
    return data;
  } catch (error) {
    console.error('Error fetching listings:', error);
    throw error;
  }
};

// Fetch a single loan listing by ID
export const fetchListingById = async (id: string): Promise<Loan> => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/listings/${id}`);
    return data;
  } catch (error) {
    console.error(`Error fetching listing with id ${id}:`, error);
    throw error;
  }
};

// Create a new loan listing
export const createListing = async (payload: CreateLoanPayload): Promise<Loan> => {
  try {
    const { data } = await axios.post(`${API_BASE_URL}/listings`, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return data;
  } catch (error) {
    console.error('Error creating listing:', error);
    throw error;
  }
};

// Fund a loan
export const fundLoan = async (
  loanId: number,
  investor: string,
  amount: string,
  useUSDC: boolean
): Promise<{ txHash: string }> => {
  try {
    const { data } = await axios.post(
      `${API_BASE_URL}/fund`,
      {
        loanId,
        investor,
        amount,
        useUSDC,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return data;
  } catch (error) {
    console.error(`Error funding loan with id ${loanId}:`, error);
    throw error;
  }
};

// Withdraw from a loan
export const withdrawFromLoan = async (
  loanId: number,
  investor: string
): Promise<{ txHash: string }> => {
  try {
    const { data } = await axios.post(
      `${API_BASE_URL}/withdraw`,
      {
        loanId,
        investor,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return data;
  } catch (error) {
    console.error(`Error withdrawing from loan with id ${loanId}:`, error);
    throw error;
  }
};