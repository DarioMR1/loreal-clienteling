export const StoreChain = {
  LIVERPOOL: "liverpool",
  PALACIO: "palacio",
  OWNED: "owned",
} as const;

export type StoreChain = (typeof StoreChain)[keyof typeof StoreChain];

export const STORE_CHAINS = Object.values(StoreChain);
