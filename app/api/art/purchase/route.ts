import { NextRequest, NextResponse } from 'next/server';
import { PLATFORM_CONFIG } from '@/config/platform';

interface PurchaseRequest {
  listingId: number;
  buyerAddress: string;
  amount: number;
}

/**
 * POST /api/art/purchase
 * Handle art purchase requests and calculate fees
 */
export async function POST(request: NextRequest) {
  try {
    const body: PurchaseRequest = await request.json();
    const { listingId, buyerAddress, amount } = body;

    // Validate request
    if (!listingId || !buyerAddress || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (amount < PLATFORM_CONFIG.MIN_TRANSACTION_AMOUNT) {
      return NextResponse.json(
        { error: `Minimum transaction amount is ${PLATFORM_CONFIG.MIN_TRANSACTION_AMOUNT} ETH` },
        { status: 400 }
      );
    }

    // Calculate fees
    const fee = (amount * PLATFORM_CONFIG.PLATFORM_FEE_PERCENTAGE) / 100;
    const sellerAmount = amount - fee;

    // Return transaction details
    return NextResponse.json({
      success: true,
      transaction: {
        listingId,
        buyerAddress,
        totalAmount: amount,
        platformFee: fee,
        sellerAmount,
        feeWallet: PLATFORM_CONFIG.FEE_WALLET_ADDRESS,
        feePercentage: PLATFORM_CONFIG.PLATFORM_FEE_PERCENTAGE,
      },
      message: 'Transaction details calculated. Complete purchase through Web3 wallet.',
    });
  } catch (error) {
    console.error('Purchase API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/art/purchase
 * Get platform fee information
 */
export async function GET() {
  return NextResponse.json({
    platformFee: PLATFORM_CONFIG.PLATFORM_FEE_PERCENTAGE,
    feeWallet: PLATFORM_CONFIG.FEE_WALLET_ADDRESS,
    minTransaction: PLATFORM_CONFIG.MIN_TRANSACTION_AMOUNT,
  });
}
