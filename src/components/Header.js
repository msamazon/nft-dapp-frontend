import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useBalance, useNetwork } from 'wagmi';
import { formatEther } from 'viem';
import { getContractAddresses, TOKEN_ABI } from '../config/contracts';

const Header = () => {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  
  // Get token balance
  const contractAddresses = getContractAddresses(chain?.id);
  const { data: tokenBalance } = useBalance({
    address: address,
    token: contractAddresses?.TOKEN_ADDRESS,
    enabled: isConnected && !!contractAddresses?.TOKEN_ADDRESS,
    watch: true,
  });

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">NFT DApp</h1>
                <p className="text-xs text-gray-500">ERC-20 + ERC-721</p>
              </div>
            </div>
          </div>

          {/* Token Balance & Wallet Connection */}
          <div className="flex items-center space-x-4">
            {/* Token Balance Display */}
            {isConnected && tokenBalance && (
              <div className="hidden md:flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2">
                <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xs">T</span>
                </div>
                <div className="text-sm">
                  <div className="font-medium text-gray-900">
                    {parseFloat(formatEther(tokenBalance.value)).toLocaleString(undefined, {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2
                    })}
                  </div>
                  <div className="text-xs text-gray-500">{tokenBalance.symbol}</div>
                </div>
              </div>
            )}

            {/* Mobile Token Balance */}
            {isConnected && tokenBalance && (
              <div className="md:hidden flex items-center space-x-1 bg-gray-100 rounded-lg px-2 py-1">
                <div className="w-5 h-5 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xs">T</span>
                </div>
                <span className="text-sm font-medium">
                  {parseFloat(formatEther(tokenBalance.value)).toLocaleString(undefined, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 1
                  })}
                </span>
              </div>
            )}

            {/* Connect Button */}
            <ConnectButton 
              showBalance={{
                smallScreen: false,
                largeScreen: true,
              }}
              chainStatus="icon"
              accountStatus={{
                smallScreen: 'avatar',
                largeScreen: 'full',
              }}
            />
          </div>
        </div>

        {/* Network Info */}
        {isConnected && chain && (
          <div className="pb-2">
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <div className={`w-2 h-2 rounded-full ${
                chain.id === 1337 ? 'bg-yellow-500' : 
                chain.id === 11155111 ? 'bg-purple-500' : 
                'bg-green-500'
              }`}></div>
              <span>Connected to {chain.name}</span>
              {contractAddresses?.TOKEN_ADDRESS && (
                <span className="text-gray-400">•</span>
              )}
              {contractAddresses?.TOKEN_ADDRESS && (
                <span className="font-mono">
                  Token: {contractAddresses.TOKEN_ADDRESS.slice(0, 6)}...{contractAddresses.TOKEN_ADDRESS.slice(-4)}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
