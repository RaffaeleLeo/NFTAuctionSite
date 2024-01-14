//https://medium.com/coinmonks/auction-smart-contracts-a-deep-dive-ccef76a2c802
// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract Auction {
    address payable public auctioneer;
    address payable public highestBidder;
    uint256 public highestBid;
    uint256 public auctionEndTime;
    bool public ended;
    
    event HighestBidIncreased(address bidder, uint256 amount);
    event AuctionEnded(address winner, uint256 amount);
    
    constructor(uint256 biddingTime) {
        auctioneer = payable(msg.sender);
        auctionEndTime = block.timestamp + biddingTime;
    }
    
    function bid() public payable {
        require(block.timestamp <= auctionEndTime, "Auction has ended");
        require(msg.value > highestBid, "Bid not high enough");
        
        if (highestBid != 0) {
            highestBidder.transfer(highestBid);
        }
        
        highestBidder = payable(msg.sender);
        highestBid = msg.value;
        emit HighestBidIncreased(msg.sender, msg.value);
    }
    
    function endAuction() public {
        require(msg.sender == auctioneer, "Only auctioneer can end the auction");
        require(block.timestamp >= auctionEndTime, "Auction has not ended yet");
        require(!ended, "Auction already ended");
        
        ended = true;
        emit AuctionEnded(highestBidder, highestBid);
        
        auctioneer.transfer(address(this).balance);
    }
}