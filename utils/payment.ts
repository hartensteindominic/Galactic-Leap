import { ethers } from 'ethers';
import { PLATFORM_CONFIG } from '@/config/platform';

/**
 * Calculate platform fee for a given amount
 * @param amount Transaction amount in ETH
 * @returns Object containing total, fee, and seller amount
 */
export function calculateFee(amount: number) {
  const feeAmount = (amount * PLATFORM_CONFIG.PLATFORM_FEE_PERCENTAGE) / 100;
  const sellerAmount = amount - feeAmount;
  
  return {
    total: amount,
    fee: feeAmount,
    sellerAmount: sellerAmount,
    feePercentage: PLATFORM_CONFIG.PLATFORM_FEE_PERCENTAGE,
  };
}

/**
 * Transfer fee to platform wallet
 * @param provider Ethereum provider
 * @param signer Transaction signer
 * @param amount Amount in ETH
 */
export async function transferFee(
  provider: ethers.BrowserProvider,
  signer: ethers.Signer,
  amount: string
) {
  const tx = await signer.sendTransaction({
    to: PLATFORM_CONFIG.FEE_WALLET_ADDRESS,
    value: ethers.parseEther(amount),
  });
  
  await tx.wait();
  return tx;
}

/**
 * Process art purchase with automatic fee distribution
 * @param provider Ethereum provider
 * @param signer Transaction signer
 * @param sellerAddress Seller's wallet address
 * @param priceInEth Price in ETH
 */
export async function processArtPurchase(
  provider: ethers.BrowserProvider,
  signer: ethers.Signer,
  sellerAddress: string,
  priceInEth: number
) {
  const { fee, sellerAmount } = calculateFee(priceInEth);
  
  // Send fee to platform wallet
  const feeTx = await signer.sendTransaction({
    to: PLATFORM_CONFIG.FEE_WALLET_ADDRESS,
    value: ethers.parseEther(fee.toString()),
  });
  await feeTx.wait();
  
  // Send remaining amount to seller
  const sellerTx = await signer.sendTransaction({
    to: sellerAddress,
    value: ethers.parseEther(sellerAmount.toString()),
  });
  await sellerTx.wait();
  
  return {
    feeTx,
    sellerTx,
    fee,
    sellerAmount,
  };
}

/**
 * Validate transaction amount
 * @param amount Amount in ETH
 * @returns boolean
 */
export function validateTransactionAmount(amount: number): boolean {
  return amount >= PLATFORM_CONFIG.MIN_TRANSACTION_AMOUNT;
}

/**
 * Format wallet address for display
 * @param address Ethereum address
 * @returns Shortened address
 */
export function formatAddress(address: string): string {
  if (!address || address.length < 10) return address;
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}
