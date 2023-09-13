import * as chain from '@wagmi/chains';
import { Explorers, NativeCurrency } from 'src/types';

export const chainArray: chain.Chain[] = [
  // Ethereum
  chain.mainnet,
  chain.goerli,
  chain.sepolia,
  // Polygon
  chain.polygon,
  chain.polygonMumbai,
  // Arbitrum
  chain.arbitrum,
  chain.arbitrumGoerli,
  // Optimism
  chain.optimism,
  chain.optimismGoerli,
  // zkSync
  chain.zkSync,
  chain.zkSyncTestnet,
  // Gnosis
  chain.gnosis,
  // BSC
  chain.bsc,
  chain.bscTestnet,
  // Avalanche
  chain.avalanche,
  chain.avalancheFuji,
  // Fantom
  chain.fantom,
  chain.fantomTestnet,
  // Taraxa
  // chain.taraxa,
  // chain.taraxaTestnet,
  // EVMOS
  // chain.evmos,
  // chain.evmosTestnet,
  // Iotex
  // chain.iotex,
  // chain.iotexTestnet,
  // Metis
  // chain.metis,
  // chain.metisGoerli,
  // Dev
  chain.localhost,
  chain.hardhat,
  // chain.foundry,
];

export const chains: { [chainId: number]: chain.Chain } = chainArray.reduce((obj, chain) => {
  return {
    ...obj,
    [chain.id]: chain,
  };
}, {});

export const sortedChains: { [key: string]: chain.Chain[] } = {
  Ethereum: [chain.mainnet, chain.goerli, chain.sepolia],
  Polygon: [chain.polygon, chain.polygonMumbai],
  Arbitrum: [chain.arbitrum, chain.arbitrumGoerli],
  Optimism: [chain.optimism, chain.optimismGoerli],
  zkSync: [chain.zkSync, chain.zkSyncTestnet],
  Gnosis: [chain.gnosis],
  BSC: [chain.bsc, chain.bscTestnet],
  Avalanche: [chain.avalanche, chain.avalancheFuji],
  Fantom: [chain.fantom, chain.fantomTestnet],
  // Taraxa: [chain.taraxa, chain.taraxaTestnet],
  // EVMOS: [chain.evmos, chain.evmosTestnet],
  // Iotex: [chain.iotex, chain.iotexTestnet],
  // Metis: [chain.metis, chain.metisGoerli],
  Development: [chain.localhost, chain.hardhat], //, chain.foundry],
};

export const explorers: Explorers = chainArray.reduce(
  (explorers, chain) => ({
    ...explorers,
    [chain.id]: chain.blockExplorers?.default,
  }),
  {}
);

export const nativeCurrency: NativeCurrency = chainArray.reduce(
  (nativeCurrency, chain) => ({
    ...nativeCurrency,
    [chain.id]: chain.nativeCurrency,
  }),
  {}
);

export const rpcUrls: { [chainId: number]: string | undefined } = chainArray.reduce(
  (rpcUrls, chain) => ({
    ...rpcUrls,
    [chain.id]: chain.rpcUrls.public.http[0],
  }),
  {}
);
