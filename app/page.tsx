import Link from 'next/link';
import { PLATFORM_CONFIG } from '@/config/platform';

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Galactic Leap</h1>
          <p className="text-xl text-gray-600">
            The future of art buying and social connection
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="p-6 border rounded-lg shadow-lg">
            <h2 className="text-3xl font-semibold mb-4">🎨 Art Marketplace</h2>
            <p className="mb-4 text-gray-700">
              Discover, buy, and sell digital art. Our platform ensures secure transactions
              with transparent fee structure.
            </p>
            <Link 
              href="/marketplace" 
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Browse Marketplace
            </Link>
          </div>

          <div className="p-6 border rounded-lg shadow-lg">
            <h2 className="text-3xl font-semibold mb-4">👥 Social Platform</h2>
            <p className="mb-4 text-gray-700">
              Connect with artists and collectors. Share your work, get feedback, and
              build your creative network.
            </p>
            <Link 
              href="/social" 
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
            >
              Explore Community
            </Link>
          </div>
        </div>

        <div className="bg-gray-100 p-6 rounded-lg">
          <h3 className="text-2xl font-semibold mb-3">Platform Information</h3>
          <div className="space-y-2 text-gray-700">
            <p>
              <strong>Platform Fee:</strong> {PLATFORM_CONFIG.PLATFORM_FEE_PERCENTAGE}% per transaction
            </p>
            <p>
              <strong>Fee Wallet:</strong>{' '}
              <code className="bg-gray-200 px-2 py-1 rounded text-sm">
                {PLATFORM_CONFIG.FEE_WALLET_ADDRESS}
              </code>
            </p>
            <p>
              <strong>Minimum Transaction:</strong> {PLATFORM_CONFIG.MIN_TRANSACTION_AMOUNT} ETH
            </p>
          </div>
        </div>

        <footer className="mt-12 pt-8 border-t text-center text-gray-600">
          <p>
            All platform fees are automatically transferred to the designated wallet address.
          </p>
        </footer>
      </div>
    </main>
  );
}
