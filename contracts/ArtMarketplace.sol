// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title ArtMarketplace
 * @dev Smart contract for art buying platform with automatic fee distribution
 */
contract ArtMarketplace {
    // Platform fee wallet - hardcoded as per requirement
    address payable public constant FEE_WALLET = payable(0x13B87B819252A81381C3Ce35e3Bd33199F4c6650);
    
    // Platform fee percentage (2.5% = 250 basis points)
    uint256 public constant FEE_PERCENTAGE = 250;
    uint256 public constant BASIS_POINTS = 10000;
    
    struct ArtListing {
        address payable seller;
        uint256 price;
        bool active;
        string tokenURI;
    }
    
    mapping(uint256 => ArtListing) public listings;
    uint256 public listingCounter;
    
    event ArtListed(uint256 indexed listingId, address indexed seller, uint256 price);
    event ArtSold(uint256 indexed listingId, address indexed buyer, address indexed seller, uint256 price, uint256 fee);
    event FeePaid(address indexed feeWallet, uint256 amount);
    
    /**
     * @dev List art for sale
     * @param price Price in wei
     * @param tokenURI Metadata URI for the art
     */
    function listArt(uint256 price, string memory tokenURI) external returns (uint256) {
        require(price > 0, "Price must be greater than 0");
        
        uint256 listingId = listingCounter++;
        listings[listingId] = ArtListing({
            seller: payable(msg.sender),
            price: price,
            active: true,
            tokenURI: tokenURI
        });
        
        emit ArtListed(listingId, msg.sender, price);
        return listingId;
    }
    
    /**
     * @dev Buy art and automatically transfer fee to platform wallet
     * @param listingId ID of the listing
     */
    function buyArt(uint256 listingId) external payable {
        ArtListing storage listing = listings[listingId];
        require(listing.active, "Listing not active");
        require(msg.value >= listing.price, "Insufficient payment");
        
        // Calculate fee
        uint256 fee = (listing.price * FEE_PERCENTAGE) / BASIS_POINTS;
        uint256 sellerAmount = listing.price - fee;
        
        // Mark as sold
        listing.active = false;
        
        // Transfer fee to platform wallet
        (bool feeSuccess, ) = FEE_WALLET.call{value: fee}("");
        require(feeSuccess, "Fee transfer failed");
        emit FeePaid(FEE_WALLET, fee);
        
        // Transfer remaining amount to seller
        (bool sellerSuccess, ) = listing.seller.call{value: sellerAmount}("");
        require(sellerSuccess, "Seller payment failed");
        
        // Refund excess payment
        if (msg.value > listing.price) {
            (bool refundSuccess, ) = payable(msg.sender).call{value: msg.value - listing.price}("");
            require(refundSuccess, "Refund failed");
        }
        
        emit ArtSold(listingId, msg.sender, listing.seller, listing.price, fee);
    }
    
    /**
     * @dev Cancel a listing
     * @param listingId ID of the listing
     */
    function cancelListing(uint256 listingId) external {
        ArtListing storage listing = listings[listingId];
        require(listing.seller == msg.sender, "Not the seller");
        require(listing.active, "Listing not active");
        
        listing.active = false;
    }
    
    /**
     * @dev Get listing details
     * @param listingId ID of the listing
     */
    function getListing(uint256 listingId) external view returns (
        address seller,
        uint256 price,
        bool active,
        string memory tokenURI
    ) {
        ArtListing storage listing = listings[listingId];
        return (listing.seller, listing.price, listing.active, listing.tokenURI);
    }
}
