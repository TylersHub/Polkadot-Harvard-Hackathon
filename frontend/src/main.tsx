import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { SWRConfig } from 'swr';
import App from './App';
import { WalletProvider } from './context/WalletContext';
import { ListingsProvider } from './context/ListingsContext';
import './index.css';

// SWR configuration
const swrConfig = {
  fetcher: (url: string) => fetch(url).then((res) => res.json()),
  revalidateOnFocus: false,
  revalidateIfStale: true,
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SWRConfig value={swrConfig}>
      <BrowserRouter>
        <WalletProvider>
          <ListingsProvider>
            <App />
          </ListingsProvider>
        </WalletProvider>
      </BrowserRouter>
    </SWRConfig>
  </StrictMode>
);