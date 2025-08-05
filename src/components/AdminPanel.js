import React, { useState, useEffect } from 'react';
import { useAccount, useContractRead, useContractWrite, useNetwork } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { toast } from 'react-hot-toast';
import { getContractAddresses, TOKEN_ABI, NFT_ABI } from '../config/contracts';
import { Coins, DollarSign, Eye } from 'lucide-react';

const AdminPanel = () => {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const contractAddresses = getContractAddresses(chain?.id);

  const [mintAmount, setMintAmount] = useState('');
  const [mintToAddress, setMintToAddress] = useState('');
  const [newPrice, setNewPrice] = useState('');

  // Check if user is owner of contracts
  const { data: tokenOwner } = useContractRead({
    address: contractAddresses?.TOKEN_ADDRESS,
    abi: TOKEN_ABI,
    functionName: 'owner',
    enabled: !!contractAddresses?.TOKEN_ADDRESS,
  });

  const { data: nftOwner } = useContractRead({
    address: contractAddresses?.NFT_ADDRESS,
    abi: NFT_ABI,
    functionName: 'owner',
    enabled: !!contractAddresses?.NFT_ADDRESS,
  });

  // Get current NFT price
  const { data: currentPrice } = useContractRead({
    address: contractAddresses?.NFT_ADDRESS,
    abi: NFT_ABI,
    functionName: 'price',
    enabled: !!contractAddresses?.NFT_ADDRESS,
    watch: true,
  });

  const isTokenOwner = tokenOwner?.toLowerCase() === address?.toLowerCase();
  const isNftOwner = nftOwner?.toLowerCase() === address?.toLowerCase();
  const isAnyOwner = isTokenOwner || isNftOwner;

  // Contract write functions
  const { write: mintTokens, isLoading: isMintingTokens } = useContractWrite({
    address: contractAddresses?.TOKEN_ADDRESS,
    abi: TOKEN_ABI,
    functionName: 'mintAndTransfer',
    onSuccess: () => {
      toast.success('Tokens cunhados com sucesso!');
      setMintAmount('');
      setMintToAddress('');
    },
    onError: (error) => {
      toast.error(`Erro ao cunhar tokens: ${error.message}`);
    },
  });

  const { write: updatePrice, isLoading: isUpdatingPrice } = useContractWrite({
    address: contractAddresses?.NFT_ADDRESS,
    abi: NFT_ABI,
    functionName: 'setPrice',
    onSuccess: () => {
      toast.success('Preço atualizado com sucesso!');
      setNewPrice('');
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar preço: ${error.message}`);
    },
  });

  const handleMintTokens = () => {
    if (!mintAmount || !mintToAddress) {
      toast.error('Preencha todos os campos');
      return;
    }

    try {
      const amount = parseEther(mintAmount);
      mintTokens({
        args: [mintToAddress, amount],
      });
    } catch (error) {
      toast.error('Valor inválido');
    }
  };

  const handleUpdatePrice = () => {
    if (!newPrice) {
      toast.error('Digite o novo preço');
      return;
    }

    try {
      const price = parseEther(newPrice);
      updatePrice({
        args: [price],
      });
    } catch (error) {
      toast.error('Preço inválido');
    }
  };

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Conecte sua carteira para acessar o painel administrativo</p>
      </div>
    );
  }

  if (!isAnyOwner) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-lg font-medium text-red-800 mb-2">Acesso Negado</h3>
          <p className="text-red-600">
            Você não é o proprietário dos contratos. Apenas o owner pode acessar esta seção.
          </p>
          <div className="mt-4 text-sm text-red-500">
            <p>Seu endereço: {address?.slice(0, 6)}...{address?.slice(-4)}</p>
            {tokenOwner && (
              <p>Owner do Token: {tokenOwner.slice(0, 6)}...{tokenOwner.slice(-4)}</p>
            )}
            {nftOwner && (
              <p>Owner do NFT: {nftOwner.slice(0, 6)}...{nftOwner.slice(-4)}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Painel de Administração</h1>
        <p className="text-gray-600">Gerencie tokens ERC-20 e preços dos NFTs</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Mint Tokens Section */}
        {isTokenOwner && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Coins className="w-5 h-5 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900">Cunhar Tokens ERC-20</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Endereço de destino
                </label>
                <input
                  type="text"
                  value={mintToAddress}
                  onChange={(e) => setMintToAddress(e.target.value)}
                  placeholder="0x..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantidade (em tokens)
                </label>
                <input
                  type="number"
                  value={mintAmount}
                  onChange={(e) => setMintAmount(e.target.value)}
                  placeholder="100"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Os tokens serão cunhados com 18 casas decimais
                </p>
              </div>
              
              <button
                onClick={handleMintTokens}
                disabled={isMintingTokens || !mintAmount || !mintToAddress}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isMintingTokens ? 'Cunhando...' : 'Cunhar Tokens'}
              </button>
            </div>
          </div>
        )}

        {/* Price Management Section */}
        {isNftOwner && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center space-x-2 mb-4">
              <DollarSign className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Gerenciar Preço NFT</h2>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <Eye className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Preço Atual</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {currentPrice ? formatEther(currentPrice) : '0'} Tokens
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Novo preço (em tokens)
                </label>
                <input
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  placeholder="25"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Preço será definido com 18 casas decimais
                </p>
              </div>
              
              <button
                onClick={handleUpdatePrice}
                disabled={isUpdatingPrice || !newPrice}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isUpdatingPrice ? 'Atualizando...' : 'Atualizar Preço'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Admin Info */}
      <div className="mt-8 bg-blue-50 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">Informações Administrativas</h3>
        <div className="space-y-1 text-sm text-blue-700">
          <p>• Você é owner do contrato ERC-20: {isTokenOwner ? '✅ Sim' : '❌ Não'}</p>
          <p>• Você é owner do contrato ERC-721: {isNftOwner ? '✅ Sim' : '❌ Não'}</p>
          <p>• Apenas owners podem cunhar tokens e alterar preços</p>
          <p>• Todos os valores são processados com 18 casas decimais</p>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
