// test/Auction.test.ts
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers} from "hardhat";
import { token } from "../typechain-types/@openzeppelin/contracts";

const delay = ms => new Promise(res => setTimeout(res, ms));

describe("duchAuction", function () {


  async function deploy() {
    
    const [owner, bidder1,bidder2] = await ethers.getSigners();
    const NFTFactory = await ethers.getContractFactory("NFT");
    const NFT = await NFTFactory.deploy();
    const tokenURI = "nome"
    NFT.mintNFT(owner,tokenURI);

    const tokenId = 1;
    const startingPrice = 10000000;//gwei
    const discountRate = 100000;

    const AuctionFactory = await ethers.getContractFactory("dutchAuction");
    const Auction = await AuctionFactory.deploy(startingPrice,discountRate,NFT,tokenId);

    return {Auction,NFT,owner,bidder1,bidder2, tokenId, tokenURI,startingPrice}
  }

    describe("Deployment",function(){

      it("NFT owner", async function () {
        const {NFT, owner} = await loadFixture(deploy);
        expect(await NFT.ownerOf(1)).to.equal(owner);
      });

      it("NFT URI", async function () {
        const {NFT, tokenURI} = await loadFixture(deploy);
        expect(await NFT.tokenURI(1)).to.equal(tokenURI);
      });

      it("Auction seller", async function () {
        const {Auction, owner} = await loadFixture(deploy);
        expect(await Auction.seller()).to.equal(owner.address);
      });

      it("Auction seller = NFT owner", async function () {
        const {Auction, NFT} = await loadFixture(deploy);
        expect(await Auction.seller()).to.equal(await NFT.ownerOf(1));
      });

      it("Auction Token ID", async function () {
        const {Auction, tokenId} = await loadFixture(deploy);
        expect(await Auction.nftId()).to.equal(tokenId);
      });

      it("Auction NFT Contract", async function () {
        const {Auction, NFT} = await loadFixture(deploy);
        expect(await Auction.nft()).to.equal(NFT);
      });

      it("Auction start price", async function () {
        const {Auction,startingPrice} = await loadFixture(deploy);
        expect(await Auction.getPrice()).to.equal(startingPrice);
        // await delay(30000);
        console.log(await Auction.getPrice()); 
      });

      it("Buy",async function () {
        const {Auction, bidder1} = await loadFixture(deploy);
        const currentPrice = await Auction.getPrice();
        await Auction.connect(bidder1).buy({
          value: currentPrice,
        });
        // expect(await Auction.highestBid()).to.equal(1);
        // expect(await Auction.highestBidder()).to.equal(bidder1);
      })

      // it("Should not allow lower bids", async function () {
      //   const {Auction, bidder1, bidder2} = await loadFixture(deploy);
      //   await Auction.connect(bidder1)
      //     .placeBid({value: 2});

      //   await expect(Auction.connect(bidder2)
      //     .placeBid({value: 1}))
      //     .to.be.revertedWith("Bid amount is not higher than the current highest bid");
      // });

      // it("Increase bid", async function () {
      //   const {Auction, bidder1, bidder2} = await loadFixture(deploy);
      //   await Auction.connect(bidder1)
      //     .placeBid({value: 1});
          
      //   await expect(Auction.connect(bidder2)
      //     .placeBid({value: 20}));
          
      //   expect(await Auction.highestBidder()).to.equal(bidder2);
      // });



      
      



    });

});

