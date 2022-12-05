import { chain } from '@wagmi/core';
import { Explorers, NativeCurrency } from 'src/types';

export const chains = [chain.goerli, chain.sepolia, chain.mainnet, chain.polygon];

export const explorers: Explorers = chains.reduce(
  (explorers, chain) => ({
    ...explorers,
    [chain.id]: chain.blockExplorers?.default,
  }),
  {}
);

export const nativeCurrency: NativeCurrency = chains.reduce(
  (nativeCurrency, chain) => ({
    ...nativeCurrency,
    [chain.id]: chain.nativeCurrency,
  }),
  {}
);
