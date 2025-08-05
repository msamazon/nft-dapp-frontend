import React, { useState, useEffect } from 'react';
import { useAccount, useContractRead, useContractWrite, useNetwork } from 'wagmi';
import { toast } from 'react-hot-toast';
import { getContractAddresses, NFT_ABI } from '../config/contracts';
import { Coins, Send, ExternalLink, Image } from 'lucide-react';

const TokensPanel = () => {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const contractAddresses = getContractAddresses(chain?.id);

  const [userNFTs, setUserNFTs] = useState([]);
  const [transferTokenId, setTransferTokenId] = useState('');
  const [transferToAddress, setTransferToAddress] = useState('');
  const [isLoadingNFTs, setIsLoadingNFTs] = useState(false);

  // Get user's NFT balance
  const { data: nftBalance } = useContractRead({
    address: contractAddresses?.NFT_ADDRESS,
    abi: NFT_ABI,
    functionName: 'balanceOf',
    args: [address],
    enabled: isConnected && !!contractAddresses?.NFT_ADDRESS,
    watch: true,
  });

  // Get total NFT supply to know the range of token IDs
  const { data: totalSupply } = useContractRead({
    address: contractAddresses?.NFT_ADDRESS,
    abi: NFT_ABI,
    functionName: 'totalSupply',
    enabled: !!contractAddresses?.NFT_ADDRESS,
    watch: true,
  });

  // Transfer NFT function
  const { write: transferNFT, isLoading: isTransferring } = useContractWrite({
    address: contractAddresses?.NFT_ADDRESS,
    abi: NFT_ABI,
    functionName: 'transferFrom',
    onSuccess: () => {
      toast.success('NFT transferido com sucesso!');
      setTransferTokenId('');
      setTransferToAddress('');
      loadUserNFTs(); // Reload NFTs
    },
    onError: (error) => {
      toast.error(`Erro na transferência: ${error.message}`);
    },
  });

  // Function to load user's NFTs
  const loadUserNFTs = async () => {
    if (!isConnected || !contractAddresses?.NFT_ADDRESS || !totalSupply) {
      return;
    }

    setIsLoadingNFTs(true);
    const nfts = [];

    try {
      // Check each token ID to see if user owns it
      for (let tokenId = 1; tokenId <= Number(totalSupply); tokenId++) {
        try {
          // This would need to be done with a contract read
          // For now, we'll simulate this - in a real app, you'd use a graph protocol or events
          const response = await fetch(`/api/nft-owner/${tokenId}`);
          if (response.ok) {
            const data = await response.json();
            if (data.owner?.toLowerCase() === address?.toLowerCase()) {
              nfts.push({
                tokenId,
                tokenURI: data.tokenURI || '',
                metadata: data.metadata || null
              });
            }
          }
        } catch (error) {
          // Skip this token ID
          continue;
        }
      }

      setUserNFTs(nfts);
    } catch (error) {
      console.error('Error loading NFTs:', error);
    } finally {
      setIsLoadingNFTs(false);
    }
  };

  // Alternative method: Create a mock NFT list based on balance
  const createMockNFTList = () => {
    if (!nftBalance || Number(nftBalance) === 0) {
      setUserNFTs([]);
      return;
    }

    const mockNFTs = [];
    for (let i = 1; i <= Number(nftBalance); i++) {
      mockNFTs.push({
        tokenId: i,
        tokenURI: `https://api.example.com/metadata/${i}.json`,
        metadata: {
          name: `My NFT #${i}`,
          description: `Este é o NFT número ${i} da coleção`,
          image: `https://api.dicebear.com/7.x/shapes/svg?seed=${i}`,
          attributes: [
            { trait_type: "Rarity", value: "Common" },
            { trait_type: "Generation", value: "First" }
          ]
        }
      });
    }
    setUserNFTs(mockNFTs);
  };

  useEffect(() => {
    // Use mock data for demonstration
    // In production, you would implement proper NFT enumeration
    createMockNFTList();
  }, [nftBalance, address, contractAddresses]);

  const handleTransfer = () => {
    if (!transferTokenId || !transferToAddress) {
      toast.error('Preencha todos os campos');
      return;
    }

    if (!userNFTs.some(nft => nft.tokenId.toString() === transferTokenId)) {
      toast.error('Você não possui este NFT');
      return;
    }

    transferNFT({
      args: [address, transferToAddress, parseInt(transferTokenId)],
    });
  };

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Conecte sua carteira para ver seus NFTs</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Meus NFTs</h1>
        <p className="text-gray-600">Gerencie sua coleção de tokens não fungíveis</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* NFT Collection */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <Coins className="w-5 h-5 text-purple-600" />
                <h2 className="text-xl font-semibold text-gray-900">Sua Coleção</h2>
              </div>
              <div className="text-sm text-gray-500">
                {nftBalance ? nftBalance.toString() : '0'} NFT(s)
              </div>
            </div>

            {isLoadingNFTs ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                <p className="text-gray-500 mt-2">Carregando NFTs...</p>
              </div>
            ) : userNFTs.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Image className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum NFT encontrado</h3>
                <p className="text-gray-500 mb-4">
                  Você ainda não possui NFTs. Que tal comprar seu primeiro?
                </p>
                <button
                  onClick={() => window.location.href = '/users'}
                  className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
                >
                  Comprar NFT
                </button>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {userNFTs.map((nft) => (
                  <div key={nft.tokenId} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <div className="aspect-square bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                      {nft.metadata?.image ? (
                        <img 
                          src={nft.metadata.image} 
                          alt={nft.metadata.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div className="flex items-center justify-center h-full" style={{display: nft.metadata?.image ? 'none' : 'flex'}}>
                        <div className="text-center">
                          <Image className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                          <div className="text-sm text-gray-500">NFT #{nft.tokenId}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {nft.metadata?.name || `NFT #${nft.tokenId}`}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        {nft.metadata?.description || 'Token único da coleção'}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500">
                          Token ID: {nft.tokenId}
                        </div>
                        {nft.tokenURI && (
                          <a
                            href={nft.tokenURI}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-600 hover:text-purple-700"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                      
                      {nft.metadata?.attributes && (
                        <div className="mt-3 space-y-1">
                          {nft.metadata.attributes.slice(0, 2).map((attr, index) => (
                            <div key={index} className="flex justify-between text-xs">
                              <span className="text-gray-500">{attr.trait_type}:</span>
                              <span className="text-gray-700">{attr.value}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Transfer Panel */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Send className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Transferir NFT</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Token ID
                </label>
                <select
                  value={transferTokenId}
                  onChange={(e) => setTransferTokenId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={userNFTs.length === 0}
                >
                  <option value="">Selecione um NFT</option>
                  {userNFTs.map((nft) => (
                    <option key={nft.tokenId} value={nft.tokenId}>
                      NFT #{nft.tokenId} - {nft.metadata?.name || 'Sem nome'}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Endereço de destino
                </label>
                <input
                  type="text"
                  value={transferToAddress}
                  onChange={(e) => setTransferToAddress(e.target.value)}
                  placeholder="0x..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                />
              </div>
              
              <button
                onClick={handleTransfer}
                disabled={isTransferring || !transferTokenId || !transferToAddress || userNFTs.length === 0}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isTransferring ? 'Transferindo...' : 'Transferir NFT'}
              </button>
            </div>
          </div>

          {/* Collection Stats */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Estatísticas</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">NFTs possuídos:</span>
                <span className="font-semibold">{nftBalance ? nftBalance.toString() : '0'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total da coleção:</span>
                <span className="font-semibold">{totalSupply ? totalSupply.toString() : '0'}</span>
              </div>
              {nftBalance && totalSupply && Number(totalSupply) > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Participação:</span>
                  <span className="font-semibold">
                    {((Number(nftBalance) / Number(totalSupply)) * 100).toFixed(1)}%
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Help Info */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h4 className="font-medium text-blue-800 mb-2">Sobre NFTs</h4>
            <div className="text-sm text-blue-700 space-y-1">
              <p>• Cada NFT é único e não pode ser duplicado</p>
              <p>• Você pode transferir para qualquer endereço</p>
              <p>• As transferências são permanentes</p>
              <p>• Verifique sempre o endereço de destino</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokensPanel;
