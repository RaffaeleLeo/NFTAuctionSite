// test/Auction.test.ts
import { expect } from "chai";
import { ethers, waffle } from "hardhat";
import { Auction, Auction__factory, NFT__factory } from "../typechain";

const { parseEther } = ethers.utils;
const { deployContract } = waffle;

describe("Auction", function () {
  let owner: any, bidder1: any, bidder2: any, auction: Auction, nftContract: any;

  before(async () => {
    [owner, bidder1, bidder2] = await ethers.getSigners();

    // Deploy NFT contract
    const NFTFactory = (await ethers.getContractFactory("NFT")) as NFT__factory;
    nftContract = await NFTFactory.connect(owner).deploy("MyNFT", "NFT");

    // Mint NFT and approve the auction contract to transfer it
    await nftContract.connect(owner).mint(bidder1.address);
    await nftContract.connect(bidder1).approve(nftContract.address, 1);

    // Deploy Auction contract
    const AuctionFactory = (await ethers.getContractFactory("Auction")) as Auction__factory;
    auction = await AuctionFactory.connect(owner).deploy(nftContract.address, 1, parseEther("1")); // Assuming tokenId is 1 and reserve price is 1 ETH
  });

  it("Should allow placing bids", async function () {
    await auction.connect(bidder1).placeBid({ value: parseEther("1.5") });
    const bidAmount = await auction.bids(bidder1.address);
    expect(bidAmount).to.equal(parseEther("1.5"));
  });

  it("Should not allow lower bids", async function () {
    await expect(auction.connect(bidder2).placeBid({ value: parseEther("1.4") })).to.be.revertedWith("Bid amount is not higher than the current highest bid");
  });

  it("Should not allow the highest bidder to place a new bid", async function () {
    await expect(auction.connect(bidder1).placeBid({ value: parseEther("2") })).to.be.revertedWith("You already have the highest bid");
  });

  it("Should allow withdrawing bids", async function () {
    await auction.connect(bidder2).placeBid({ value: parseEther("1.6") });
    await auction.connect(bidder2).withdrawBid();
    const bidAmount = await auction.bids(bidder2.address);
    expect(bidAmount).to.equal(0);
  });

  it("Should finalize auction and transfer NFT and funds", async function () {
    await auction.connect(bidder1).placeBid({ value: parseEther("2") });
    await auction.connect(owner).finalizeAuction();

    const ownerBalanceBefore = await ethers.provider.getBalance(owner.address);
    const bidderBalanceBefore = await ethers.provider.getBalance(bidder1.address);

    // Assuming gas cost is negligible for simplicity
    const ownerBalanceAfter = await ethers.provider.getBalance(owner.address);
    const bidderBalanceAfter = await ethers.provider.getBalance(bidder1.address);

    // Check that the NFT has been transferred to the highest bidder
    const newOwner = await nftContract.ownerOf(1);
    expect(newOwner).to.equal(bidder1.address);

    // Check that the funds have been transferred to the auction owner
    expect(ownerBalanceAfter.sub(ownerBalanceBefore)).to.equal(parseEther("2"));
    expect(bidderBalanceAfter.sub(bidderBalanceBefore)).to.equal(0); // Bidder's balance should be unchanged

    // Check that the auction contract balance is 0
    const auctionBalance = await ethers.provider.getBalance(auction.address);
    expect(auctionBalance).to.equal(0);
  });
});
