import { ethers } from "hardhat";

async function main() {
    const [owner] = await ethers.getSigners();
    const NFT = await ethers.getContractFactory("NFT");
    const nft = await NFT.deploy();

    console.log("NFT Contract deployed to:", nft.tokenURI);

    const tokenURI = "https://mytokenmetadata.com/nft/1";
    const txn = await nft.mintNFT(owner.address, tokenURI);
    await txn.wait();

    console.log("chainId: ", txn.blockNumber)
    console.log("NFT minted:", txn.hash);

    const tokenId = 1;
    const reservePrice = 100
    const AuctionFactory = await ethers.getContractFactory("Auction");
    const Auction = await AuctionFactory.deploy(nft,tokenId,reservePrice);
    await Auction.waitForDeployment();
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});