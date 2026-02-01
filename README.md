# Galactic Leap - Art Marketplace & Social Platform

An art buying platform and social media platform where all fees are transferred to wallet `0x13B87B819252A81381C3Ce35e3Bd33199F4c6650`.

## Features

### 🎨 Art Marketplace
- Browse and purchase digital art
- List art for sale
- Transparent fee structure (2.5% platform fee)
- Automatic fee distribution to platform wallet

### 👥 Social Platform
- User profiles with wallet integration
- Post and share content
- Follow artists and collectors
- Community engagement features

## Platform Configuration

The platform is configured with the following settings:

- **Platform Fee**: 2.5% of each transaction
- **Fee Wallet Address**: `0x13B87B819252A81381C3Ce35e3Bd33199F4c6650`
- **Minimum Transaction**: 0.001 ETH

All platform fees are **automatically** transferred to the designated wallet address during each art purchase transaction.

## Technical Implementation

### Fee Management

The platform implements fee management at multiple levels:

1. **Smart Contract Level** (`contracts/ArtMarketplace.sol`):
   - Hardcoded fee wallet address: `0x13B87B819252A81381C3Ce35e3Bd33199F4c6650`
   - Automatic fee calculation and distribution
   - Secure payment handling with Solidity

2. **Application Configuration** (`config/platform.ts`):
   - Centralized configuration for fee settings
   - Easy to maintain and update

3. **Payment Utilities** (`utils/payment.ts`):
   - Fee calculation functions
   - Transaction processing helpers
   - Web3 integration utilities

4. **API Endpoints** (`app/api/art/purchase/route.ts`):
   - RESTful API for purchase processing
   - Fee information endpoint
   - Transaction validation

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Web3 wallet (e.g., MetaMask) for blockchain transactions

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Development

The application runs on `http://localhost:3000` by default.

- **Home**: `/` - Landing page with platform overview
- **Marketplace**: `/marketplace` - Browse and buy art
- **Social**: `/social` - Community and social features

### Deploying the Smart Contract

The smart contract in `contracts/ArtMarketplace.sol` can be deployed to Ethereum or compatible networks:

```bash
# Compile and deploy using your preferred tool (Hardhat, Truffle, Remix, etc.)
```

The contract has the fee wallet address hardcoded as a constant for security.

## Fee Flow

When a user purchases art:

1. Buyer initiates purchase for total price
2. Platform calculates 2.5% fee
3. Smart contract automatically:
   - Transfers fee to `0x13B87B819252A81381C3Ce35e3Bd33199F4c6650`
   - Transfers remaining amount to seller
4. Transaction is confirmed on-chain

## Project Structure

```
congenial-couscous/
├── app/
│   ├── api/art/purchase/     # Purchase API endpoints
│   ├── marketplace/           # Marketplace pages
│   ├── social/                # Social platform pages
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Home page
│   └── globals.css            # Global styles
├── config/
│   └── platform.ts            # Platform configuration (fee wallet)
├── contracts/
│   └── ArtMarketplace.sol     # Smart contract with fee management
├── utils/
│   └── payment.ts             # Payment and fee utilities
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
├── next.config.js             # Next.js configuration
└── README.md                  # This file
```

## Technology Stack

- **Framework**: Next.js 16 with TypeScript
- **Styling**: Tailwind CSS
- **Blockchain**: Ethereum (ethers.js v6)
- **Smart Contracts**: Solidity ^0.8.0

## Security Considerations

- Fee wallet address is hardcoded in smart contract as immutable
- All transactions are executed on-chain for transparency
- Smart contract includes validation and error handling
- No administrative functions to change fee wallet (security by design)

## License

ISC

## Support

For questions or issues, please refer to the repository documentation.

