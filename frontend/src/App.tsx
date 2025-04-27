import React from "react";
import { Routes, Route } from "react-router-dom";
import { useWallet } from "./context/WalletContext";

// Layouts
import MainLayout from "./layouts/MainLayout";

// Pages
import HomePage from "./pages/HomePage";
import ListingsPage from "./pages/ListingsPage";
import ListingDetailPage from "./pages/ListingDetailPage";
import CreateListingPage from "./pages/CreateListingPage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";

// Components
import WalletConnectModal from "./components/wallet/WalletConnectModal";

function App() {
  const { isModalOpen } = useWallet();

  return (
    <div className="min-h-screen bg-neutral-50">
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="listings" element={<ListingsPage />} />
          <Route path="listings/:id" element={<ListingDetailPage />} />
          <Route path="create-listing" element={<CreateListingPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>

      {isModalOpen && <WalletConnectModal />}
    </div>
  );
}

export default App;
