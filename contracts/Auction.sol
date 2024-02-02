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
    uint256 public reservePrice;
    // Current state of the auction identified by the address of the highest buyer
    address public highestBidder;
    // Value of the highest offert
    uint256 public highestBid;
    // starting auction time
    uint256 public start;
    // dictionary of the addresses who made an offert
    mapping(address => uint256) public bids;

    event BidPlaced(address bidder, uint256 bidAmount);
    event BidUpdated(address bidder, uint256 bidAmount,uint256 totalAmount);



    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }


    modifier onlyNFTOwner() {
        require(nftContract.ownerOf(tokenId) == msg.sender, "Not the NFT owner");
        _;
    }


    // constructor of the Auction contract
    constructor(address _nftContract, uint256 _tokenId, uint256 _reservePrice) {
        owner = msg.sender;
        nftContract = IERC721(_nftContract);
        tokenId = _tokenId;
        reservePrice = _reservePrice;
        start = block.timestamp;
    }

    // function to place a bid
    function placeBid() external payable {
        require(msg.sender != highestBidder, "You already have the highest bid");
        require(msg.value > highestBid, "Bid amount is not higher than the current highest bid");
        // if there is at least one offert
        if (highestBidder != address(0)) {
            // update the dictionary with losing bidders
            bids[highestBidder] += highestBid;
        }
        // update the highest offert
        highestBidder = msg.sender;
        highestBid = msg.value;

        emit BidPlaced(msg.sender, msg.value);
    }

    function updateBid() external payable{
        require(msg.sender != highestBidder, "You already have the highest bid");

        uint256 prevbidAmount = bids[msg.sender];
        uint256 bidAmount = msg.value;

        if(prevbidAmount>0){
            bidAmount +=prevbidAmount;
        }

        require(bidAmount > highestBid, "Bid amount is not higher than the current highest bid");
        // if there is at least one offert
        if (highestBidder != address(0)) {
            // update the dictionary with losing bidders
            bids[highestBidder] += highestBid;
        }
        // update the highest offert
        highestBidder = msg.sender;
        highestBid = bidAmount;

        emit BidUpdated(msg.sender, msg.value, bidAmount);

    }


    // function when the auction is over for the winner
    function finalizeAuction() external onlyOwner {
        //commentati per i test rimuovere dopo
        require(block.timestamp >= start + 7 days, "Auction has not ended yet");
        require(highestBid >= reservePrice, "Auction did not meet the reserve price");
        
        // Transfer NFT to the highest bidder
        nftContract.safeTransferFrom(owner, highestBidder, tokenId);
        // Transfer funds to the auction owner
        payable(owner).transfer(highestBid);
    }

    // function when the auction is over for the losers
    function withdrawBid() external {
        require(msg.sender != highestBidder, "You cannot withdraw the highest bid");
        uint256 bidAmount = bids[msg.sender];
        require(bidAmount > 0, "No bid to withdraw");
        bids[msg.sender] = 0;
        payable(msg.sender).transfer(bidAmount);
    }
    // * receive function
    receive() external payable {}

    // * fallback function
    fallback() external payable {}
}
