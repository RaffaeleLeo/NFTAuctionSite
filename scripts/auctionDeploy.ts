import { ethers } from "hardhat";

/**
 * function that mint the NFT and start the auction
 */
async function main() {
    //use the owner address instead  
    // const [owner] = await ethers.getSigners();
    //
    const owner = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
    //NFT contract creation
    const NFT = await ethers.getContractFactory("NFT");
    //NFT contract deployment
    const nft = await NFT.deploy();
    // console.log("NFT Contract deployed to:", nft.tokenURI);
    console.log("NFT Contract deployed to:",await nft.getAddress());

    // Auction based on the first image of the NFT
    const tokenId = 1;

    // auction contract creation
    const AuctionFactory = await ethers.getContractFactory("Auction");
    // auction contract deployment
    const Auction = await AuctionFactory.deploy();

    await Auction.waitForDeployment();

    // // lets the auction sell the owner's token
    // await nft.approve(Auction,tokenId);

    // console.log("Auction Contract",Auction);
    console.log("Auction Contract deployed to:",await Auction.getAddress());

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

