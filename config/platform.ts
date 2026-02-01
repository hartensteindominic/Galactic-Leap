// Platform configuration
export const PLATFORM_CONFIG = {
  // Fee wallet address - all platform fees are sent here
  FEE_WALLET_ADDRESS: '0x13B87B819252A81381C3Ce35e3Bd33199F4c6650',
  
  // Platform fee percentage (e.g., 2.5 = 2.5%)
  PLATFORM_FEE_PERCENTAGE: 2.5,
  
  // Minimum transaction amount in ETH
  MIN_TRANSACTION_AMOUNT: 0.001,
} as const;

export default PLATFORM_CONFIG;
