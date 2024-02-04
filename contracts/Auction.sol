// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

//npm install @openzeppelin/contracts
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "hardhat/console.sol";


contract Auction {

    // address of the auction owner
    address public owner;
    // contract of the NFT of the auction
    IERC721 public nftContract;
    // NFT ID
    uint256 public tokenId;
    // NFT floor price
    uint256 public minPrice;
    // Current state of the auction identified by the address of the highest buyer
    address public highestBidder;
    // Value of the highest offert
    uint256 public highestBid;
    // starting auction time
    uint256 public start;

    event BidPlaced(address bidder, uint256 bidAmount);
    event BidRefounded(address bidder, uint256 bidAmount);
    event AuctionTerminated(address winner,IERC721 nftContract, uint256 tokenId);
    event AuctionStarted(IERC721 nftContract);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }


    modifier onlyNFTOwner() {
        require(nftContract.ownerOf(tokenId) == msg.sender, "Not the NFT owner");
        _;
    }


    //constructor of the auction
    constructor(){
    }
    //begins an auction
    function begin(address _nftContract, uint256 _tokenId, uint256 _minPrice) external {
        owner = msg.sender;
        console.log("owner",owner);
        nftContract = IERC721(_nftContract);
        tokenId = _tokenId;
        minPrice = _minPrice;
        start = block.timestamp;
        emit AuctionStarted(nftContract);
    }

    // function to place a bid
    function placeBid() external payable {
        require(msg.sender != highestBidder, "You already have the highest bid");
        require(msg.value > highestBid, "Bid amount is not higher than the current highest bid");

        uint256 previousBid = highestBid; // Salviamo l'offerta precedente
        address previousBidder = highestBidder; // Salviamo il precedente offerente

        // Aggiorniamo l'offerta più alta e l'offerente più alto
        highestBidder = msg.sender;
        highestBid = msg.value;

        //first bid
        if(previousBidder==address(0)){
            require(msg.value >= minPrice, "The bid is lower than the minimum price for the Auction");
        }

        // Rimborso il precedente offerente
        if (previousBidder != address(0)) {
            payable(previousBidder).transfer(previousBid);
            emit BidRefounded(previousBidder, previousBid);
        }

        emit BidPlaced(msg.sender, highestBid);

    }


    // function when the auction is over for the winner
    function finalizeAuction() external onlyOwner {
        //commentati per i test rimuovere dopo
        //require(block.timestamp >= start + 7 days, "Auction has not ended yet");        
        // Transfer NFT to the highest bidder
        nftContract.safeTransferFrom(owner, highestBidder, tokenId);
        // Transfer funds to the auction owner
        payable(owner).transfer(highestBid);

        emit AuctionTerminated(highestBidder,nftContract,tokenId);
    }

    // * receive function
    receive() external payable {}

    // * fallback function
    fallback() external payable {}
}
