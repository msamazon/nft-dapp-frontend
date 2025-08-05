import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { WagmiConfig } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

import { wagmiConfig, chains } from './config/wagmi';
import Header from './components/Header';
import AdminPanel from './components/AdminPanel';
import UserPanel from './components/UserPanel';
import TokensPanel from './components/TokensPanel';
import Navigation from './components/Navigation';

import '@rainbow-me/rainbowkit/styles.css';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider chains={chains}>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <Header />
              <Navigation />
              
              <main className="container mx-auto px-4 py-8">
                <Routes>
                  <Route path="/" element={<Navigate to="/users" replace />} />
                  <Route path="/admin" element={<AdminPanel />} />
                  <Route path="/users" element={<UserPanel />} />
                  <Route path="/tokens" element={<TokensPanel />} />
                </Routes>
              </main>
              
              <Toaster 
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                }}
              />
            </div>
          </Router>
        </RainbowKitProvider>
      </WagmiConfig>
    </QueryClientProvider>
  );
}

export default App;
