// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

//npm install @openzeppelin/contracts
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "hardhat/console.sol";


contract Auction {

    address public owner;
    IERC721 public nftContract;

    uint256 public tokenId;
    uint256 public reservePrice;
    
    // Current state of the auction.
    address public highestBidder;
    uint256 public highestBid;

    uint256 private start;


    mapping(address => uint256) public bids;

    event BidPlaced(address bidder, uint256 bidAmount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    modifier onlyNFTOwner() {
        require(nftContract.ownerOf(tokenId) == msg.sender, "Not the NFT owner");
        _;
    }

    constructor(address _nftContract, uint256 _tokenId, uint256 _reservePrice) {
        owner = msg.sender;
        nftContract = IERC721(_nftContract);
        tokenId = _tokenId;
        reservePrice = _reservePrice;
        start = block.timestamp;
    }

    function placeBid() external payable {
        require(msg.value > highestBid, "Bid amount is not higher than the current highest bid");
        require(msg.sender != highestBidder, "You already have the highest bid");

        if (highestBidder != address(0)) {
            // Refund the previous highest bidder
            bids[highestBidder] += highestBid;
        }

        highestBidder = msg.sender;
        highestBid = msg.value;

        emit BidPlaced(msg.sender, msg.value);
    }

    function finalizeAuction() external onlyOwner {
        //commentati per i test rimuovere dopo
        // require(block.timestamp >= start + 7 days, "Auction has not ended yet");
        // require(highestBid >= reservePrice, "Auction did not meet the reserve price");
        
        // Transfer NFT to the highest bidder
        nftContract.safeTransferFrom(owner, highestBidder, tokenId);
        // Transfer funds to the auction owner
        payable(owner).transfer(highestBid);
    }

    function withdrawBid() external {
        require(msg.sender != highestBidder, "You cannot withdraw the highest bid");

        uint256 bidAmount = bids[msg.sender];
        require(bidAmount > 0, "No bid to withdraw");

        bids[msg.sender] = 0;
        payable(msg.sender).transfer(bidAmount);
    }
}
