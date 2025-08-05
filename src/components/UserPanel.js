import React, { useState, useEffect } from 'react';
import { useAccount, useContractRead, useContractWrite, useNetwork, useBalance } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { toast } from 'react-hot-toast';
import { getContractAddresses, TOKEN_ABI, NFT_ABI } from '../config/contracts';
import { ShoppingCart, CheckCircle, AlertCircle, Coins, Eye } from 'lucide-react';

const UserPanel = () => {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const contractAddresses = getContractAddresses(chain?.id);

  const [purchaseStep, setPurchaseStep] = useState(0); // 0: initial, 1: approved, 2: minting

  // Get NFT price
  const { data: nftPrice } = useContractRead({
    address: contractAddresses?.NFT_ADDRESS,
    abi: NFT_ABI,
    functionName: 'price',
    enabled: !!contractAddresses?.NFT_ADDRESS,
    watch: true,
  });

  // Get user token balance
  const { data: tokenBalance } = useBalance({
    address: address,
    token: contractAddresses?.TOKEN_ADDRESS,
    enabled: isConnected && !!contractAddresses?.TOKEN_ADDRESS,
    watch: true,
  });

  // Check if user has sufficient balance
  const { data: hasSufficientBalance } = useContractRead({
    address: contractAddresses?.NFT_ADDRESS,
    abi: NFT_ABI,
    functionName: 'hasBalance',
    args: [address],
    enabled: isConnected && !!contractAddresses?.NFT_ADDRESS,
    watch: true,
  });

  // Check if user has approved the NFT contract
  const { data: hasAllowance } = useContractRead({
    address: contractAddresses?.NFT_ADDRESS,
    abi: NFT_ABI,
    functionName: 'hasAllowance',
    args: [address],
    enabled: isConnected && !!contractAddresses?.NFT_ADDRESS,
    watch: true,
  });

  // Get user's NFT balance
  const { data: nftBalance } = useContractRead({
    address: contractAddresses?.NFT_ADDRESS,
    abi: NFT_ABI,
    functionName: 'balanceOf',
    args: [address],
    enabled: isConnected && !!contractAddresses?.NFT_ADDRESS,
    watch: true,
  });

  // Contract write functions
  const { write: approveTokens, isLoading: isApproving } = useContractWrite({
    address: contractAddresses?.TOKEN_ADDRESS,
    abi: TOKEN_ABI,
    functionName: 'approve',
    onSuccess: () => {
      toast.success('Aprovação concedida!');
      setPurchaseStep(1);
    },
    onError: (error) => {
      toast.error(`Erro na aprovação: ${error.message}`);
    },
  });

  const { write: mintNFT, isLoading: isMinting } = useContractWrite({
    address: contractAddresses?.NFT_ADDRESS,
    abi: NFT_ABI,
    functionName: 'mint',
    onSuccess: () => {
      toast.success('NFT comprado com sucesso! 🎉');
      setPurchaseStep(0);
    },
    onError: (error) => {
      toast.error(`Erro ao comprar NFT: ${error.message}`);
      setPurchaseStep(0);
    },
  });

  const handleApprove = () => {
    if (!nftPrice) {
      toast.error('Erro ao obter preço do NFT');
      return;
    }

    approveTokens({
      args: [contractAddresses.NFT_ADDRESS, nftPrice],
    });
  };

  const handleMintNFT = () => {
    setPurchaseStep(2);
    mintNFT();
  };

  // Reset purchase step when allowance changes
  useEffect(() => {
    if (hasAllowance) {
      setPurchaseStep(1);
    } else {
      setPurchaseStep(0);
    }
  }, [hasAllowance]);

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Conecte sua carteira para comprar NFTs</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Comprar NFT</h1>
        <p className="text-gray-600">Adquira NFTs únicos pagando com tokens ERC-20</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Purchase Panel */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            {/* Price Display */}
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <Eye className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">Preço do NFT</h2>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {nftPrice ? formatEther(nftPrice) : '0'} Tokens
                </div>
                <p className="text-sm text-gray-600">
                  Por NFT • Pagamento em tokens ERC-20
                </p>
              </div>
            </div>

            {/* Purchase Process */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Processo de Compra</h3>
              
              {/* Step 1: Check Balance */}
              <div className={`flex items-center space-x-3 p-4 rounded-lg border ${
                hasSufficientBalance 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                {hasSufficientBalance ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600" />
                )}
                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    1. Verificar Saldo
                  </div>
                  <div className={`text-sm ${hasSufficientBalance ? 'text-green-700' : 'text-red-700'}`}>
                    {hasSufficientBalance 
                      ? 'Você tem saldo suficiente' 
                      : 'Saldo insuficiente para comprar NFT'
                    }
                  </div>
                </div>
              </div>

              {/* Step 2: Approve Tokens */}
              <div className={`flex items-center space-x-3 p-4 rounded-lg border ${
                hasAllowance 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-yellow-50 border-yellow-200'
              }`}>
                {hasAllowance ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                )}
                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    2. Aprovar Tokens
                  </div>
                  <div className={`text-sm ${hasAllowance ? 'text-green-700' : 'text-yellow-700'}`}>
                    {hasAllowance 
                      ? 'Tokens aprovados para transferência' 
                      : 'Precisa aprovar o contrato NFT'
                    }
                  </div>
                </div>
                {!hasAllowance && hasSufficientBalance && (
                  <button
                    onClick={handleApprove}
                    disabled={isApproving}
                    className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
                  >
                    {isApproving ? 'Aprovando...' : 'Aprovar'}
                  </button>
                )}
              </div>

              {/* Step 3: Mint NFT */}
              <div className={`flex items-center space-x-3 p-4 rounded-lg border ${
                hasAllowance && hasSufficientBalance
                  ? 'bg-blue-50 border-blue-200' 
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <ShoppingCart className={`w-5 h-5 ${
                  hasAllowance && hasSufficientBalance ? 'text-blue-600' : 'text-gray-400'
                }`} />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    3. Comprar NFT
                  </div>
                  <div className={`text-sm ${
                    hasAllowance && hasSufficientBalance ? 'text-blue-700' : 'text-gray-500'
                  }`}>
                    {hasAllowance && hasSufficientBalance
                      ? 'Pronto para comprar seu NFT'
                      : 'Complete os passos anteriores'
                    }
                  </div>
                </div>
                {hasAllowance && hasSufficientBalance && (
                  <button
                    onClick={handleMintNFT}
                    disabled={isMinting}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors font-medium"
                  >
                    {isMinting ? 'Comprando...' : 'Comprar NFT'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar with user info */}
        <div className="space-y-6">
          {/* Token Balance */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Coins className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Seu Saldo</h3>
            </div>
            <div className="space-y-3">
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {tokenBalance ? 
                    parseFloat(formatEther(tokenBalance.value)).toLocaleString(undefined, {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2
                    }) : '0'
                  }
                </div>
                <div className="text-sm text-gray-600">
                  {tokenBalance?.symbol || 'Tokens'}
                </div>
              </div>
              {nftPrice && tokenBalance && (
                <div className="text-sm text-gray-500">
                  Suficiente para {Math.floor(Number(formatEther(tokenBalance.value)) / Number(formatEther(nftPrice)))} NFT(s)
                </div>
              )}
            </div>
          </div>

          {/* NFT Collection */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sua Coleção</h3>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {nftBalance ? nftBalance.toString() : '0'}
              </div>
              <div className="text-sm text-gray-600">
                NFTs possuídos
              </div>
              {nftBalance && Number(nftBalance) > 0 && (
                <div className="mt-3">
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Ver meus NFTs →
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Purchase Info */}
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <h4 className="font-medium text-yellow-800 mb-2">Como funciona?</h4>
            <div className="text-sm text-yellow-700 space-y-1">
              <p>1. Verifique se tem saldo suficiente</p>
              <p>2. Aprove o contrato para usar seus tokens</p>
              <p>3. Compre seu NFT único</p>
              <p>4. O NFT será transferido para sua carteira</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPanel;
