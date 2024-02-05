// test/Auction.test.ts
import { loadFixture, time } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers} from "hardhat";


describe("Auction", function () {

  async function deploy() {
    
    const [owner, bidder1,bidder2] = await ethers.getSigners();
    const NFTFactory = await ethers.getContractFactory("NFT");
    const NFT = await NFTFactory.deploy();
    const tokenURI = "nome"
    NFT.mintNFT(owner,tokenURI);

    const tokenId = 1;
    const reservePrice = 100

    const AuctionFactory = await ethers.getContractFactory("Auction");
    // const Auction = await AuctionFactory.deploy(NFT,tokenId,reservePrice);
    const Auction = await AuctionFactory.deploy();
    Auction.begin(NFT,tokenId,reservePrice);


    //lets the auction sell the owner's token
    await NFT.approve(Auction,tokenId);

    return {Auction,NFT,owner,bidder1,bidder2, tokenId,reservePrice}
  }

    describe("Deployment",function(){

      it("NFT owner", async function () {
        const {NFT, owner} = await loadFixture(deploy);
        expect(await NFT.ownerOf(1)).to.equal(owner);
      });

      it("Auction owner", async function () {
        const {Auction, owner} = await loadFixture(deploy);
        expect(await Auction.owner()).to.equal(owner.address);
      });

      it("Auction and NFT owner", async function () {
        const {Auction, NFT} = await loadFixture(deploy);
        expect(await Auction.owner()).to.equal(await NFT.ownerOf(1));
      });

      it("Auction Token ID", async function () {
        const {Auction, tokenId} = await loadFixture(deploy);
        expect(await Auction.tokenId()).to.equal(tokenId);
      });

      it("Auction start price 0", async function () {
        const {Auction} = await loadFixture(deploy);
        expect(await Auction.highestBid()).to.equal(0);
      });

      it("First Bid",async function () {
        const {Auction, bidder1} = await loadFixture(deploy);
        await Auction.connect(bidder1)
          .placeBid({value: ethers.parseEther("1")});
          // .placeBid({value: 1});
        // expect(await Auction.highestBid()).to.equal(1);
        expect(await Auction.highestBidder()).to.equal(bidder1);
      })

      it("Should not allow lower bids", async function () {
        const {Auction, bidder1, bidder2} = await loadFixture(deploy);
        await Auction.connect(bidder1)
          .placeBid({value: ethers.parseEther("2")});

        await expect(Auction.connect(bidder2)
          .placeBid({value: ethers.parseEther("1")}))
          .to.be.revertedWith("Bid amount is not higher than the current highest bid");
      });

      it("Increase bid", async function () {
        const {Auction, bidder1, bidder2} = await loadFixture(deploy);
        await Auction.connect(bidder1)
          .placeBid({value: ethers.parseEther("1")});
        // const initialBidderBalance = await ethers.provider.getBalance(bidder1.address);
 
        await expect(Auction.connect(bidder2)
          .placeBid({value: ethers.parseEther("2")}));
        
        await Auction.waitForDeployment();
          
        expect(await Auction.highestBidder()).to.equal(bidder2);
      });

      it("Terminate Auction", async function () {
        const {Auction,owner, bidder1, bidder2,NFT} = await loadFixture(deploy);
        const initialBidderBalance = await ethers.provider.getBalance(bidder2);
        await Auction.connect(bidder1)
          .placeBid({value: ethers.parseEther("1")});

        await expect(Auction.connect(bidder2)
          .placeBid({value: ethers.parseEther("2")}));

        await Auction.waitForDeployment();

        expect(await ethers.provider.getBalance(Auction)).to.be.equal(ethers.parseEther("2"));



        await Auction.connect(owner).finalizeAuction();
        const finalBidderBalance = await ethers.provider.getBalance(bidder2.address);
        expect(finalBidderBalance).to.be.lessThan(initialBidderBalance);
        //New NFT owner = bidder2
        expect(await NFT.ownerOf(1)).to.be.equal(bidder2);

      });

      it("bidwar address", async function () {
        const {Auction, bidder1, bidder2} = await loadFixture(deploy);
        await Auction.connect(bidder1)
          .placeBid({value: ethers.parseEther("1")});
        // const initialBidderBalance = await ethers.provider.getBalance(bidder1.address);
 
        await Auction.connect(bidder2)
          .placeBid({value: ethers.parseEther("2")});

        await Auction.connect(bidder1)
          .placeBid({value: ethers.parseEther("3")}); 
        
        await Auction.waitForDeployment();
          
        expect(await Auction.highestBidder()).to.equal(bidder1);
      });

      it("bidwar value", async function () {
        const {Auction, bidder1, bidder2} = await loadFixture(deploy);
        await Auction.connect(bidder1)
          .placeBid({value: ethers.parseEther("10")});
        // const initialBidderBalance = await ethers.provider.getBalance(bidder1.address);
 
        await Auction.connect(bidder2)
          .placeBid({value: ethers.parseEther("12")});

        await Auction.connect(bidder1)
          .placeBid({value: ethers.parseEther("13")}); 
        
        await Auction.waitForDeployment();

        const a = await ethers.provider.getBalance(Auction);
        console.log(a);

        expect(await Auction.highestBid()).to.equal(ethers.parseEther("13"));
      });


    });

});

