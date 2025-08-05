import { getDefaultWallets } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum, sepolia, hardhat } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { infuraProvider } from 'wagmi/providers/infura';

// Configure chains & providers
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    hardhat, // Para desenvolvimento local
    sepolia, // Para testes
    mainnet,
    polygon,
    optimism,
    arbitrum,
  ],
  [
    // Adicione suas chaves de API aqui se necessário
    // alchemyProvider({ apiKey: process.env.REACT_APP_ALCHEMY_ID }),
    // infuraProvider({ apiKey: process.env.REACT_APP_INFURA_ID }),
    publicProvider()
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'NFT DApp',
  projectId: process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
  chains
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

export { wagmiConfig, chains };
