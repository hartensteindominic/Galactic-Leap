'use client';

import { useState } from 'react';
import Link from 'next/link';
import { calculateFee, formatAddress } from '@/utils/payment';
import { PLATFORM_CONFIG } from '@/config/platform';

interface ArtListing {
  id: number;
  title: string;
  artist: string;
  price: number;
  imageUrl: string;
  description: string;
}

// Mock data for demonstration
const mockListings: ArtListing[] = [
  {
    id: 1,
    title: 'Cosmic Dreams',
    artist: '0x1234...5678',
    price: 0.5,
    imageUrl: '/placeholder-art.jpg',
    description: 'A stunning digital artwork depicting cosmic landscapes',
  },
  {
    id: 2,
    title: 'Digital Horizons',
    artist: '0xabcd...ef01',
    price: 1.2,
    imageUrl: '/placeholder-art.jpg',
    description: 'Abstract digital art exploring the boundaries of imagination',
  },
  {
    id: 3,
    title: 'Neon Genesis',
    artist: '0x9876...5432',
    price: 0.8,
    imageUrl: '/placeholder-art.jpg',
    description: 'Vibrant neon-inspired artwork',
  },
];

export default function MarketplacePage() {
  const [selectedArt, setSelectedArt] = useState<ArtListing | null>(null);

  const handleBuy = (listing: ArtListing) => {
    setSelectedArt(listing);
  };

  const confirmPurchase = () => {
    if (!selectedArt) return;
    
    const feeDetails = calculateFee(selectedArt.price);
    alert(
      `Purchase initiated!\n\n` +
      `Total: ${feeDetails.total} ETH\n` +
      `Platform Fee (${feeDetails.feePercentage}%): ${feeDetails.fee} ETH → ${PLATFORM_CONFIG.FEE_WALLET_ADDRESS}\n` +
      `Artist Receives: ${feeDetails.sellerAmount} ETH\n\n` +
      `Note: Connect your Web3 wallet to complete the transaction.`
    );
    setSelectedArt(null);
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold mb-2">Art Marketplace</h1>
          <p className="text-gray-600">
            Browse and purchase digital art. Platform fee: {PLATFORM_CONFIG.PLATFORM_FEE_PERCENTAGE}%
          </p>
        </header>

        <div className="grid md:grid-cols-3 gap-6">
          {mockListings.map((listing) => {
            const feeDetails = calculateFee(listing.price);
            
            return (
              <div key={listing.id} className="border rounded-lg overflow-hidden shadow-lg">
                <div className="bg-gray-200 h-48 flex items-center justify-center">
                  <span className="text-gray-400">Art Preview</span>
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{listing.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Artist: <code className="bg-gray-100 px-1 rounded">{listing.artist}</code>
                  </p>
                  <p className="text-sm mb-4">{listing.description}</p>
                  
                  <div className="border-t pt-4 space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="font-semibold">Price:</span>
                      <span>{listing.price} ETH</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Platform Fee:</span>
                      <span>{feeDetails.fee.toFixed(4)} ETH</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Artist Gets:</span>
                      <span>{feeDetails.sellerAmount.toFixed(4)} ETH</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleBuy(listing)}
                    className="w-full mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Purchase Confirmation Modal */}
        {selectedArt && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4">Confirm Purchase</h2>
              <p className="mb-4">
                You are about to purchase <strong>{selectedArt.title}</strong>
              </p>
              
              <div className="bg-gray-100 p-4 rounded mb-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Price:</span>
                  <span className="font-semibold">{selectedArt.price} ETH</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Platform Fee ({PLATFORM_CONFIG.PLATFORM_FEE_PERCENTAGE}%):</span>
                  <span>{calculateFee(selectedArt.price).fee.toFixed(4)} ETH</span>
                </div>
                <div className="border-t pt-2">
                  <p className="text-xs text-gray-500 mb-1">Fee transferred to:</p>
                  <code className="text-xs bg-gray-200 px-2 py-1 rounded block break-all">
                    {PLATFORM_CONFIG.FEE_WALLET_ADDRESS}
                  </code>
                </div>
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={() => setSelectedArt(null)}
                  className="flex-1 border border-gray-300 py-2 rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmPurchase}
                  className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
