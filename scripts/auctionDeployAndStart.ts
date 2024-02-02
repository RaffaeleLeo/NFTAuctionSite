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
    //vuoto??
    // console.log("NFT Contract deployed to:", nft.tokenURI);
    console.log("NFT Contract deployed to:",await nft.getAddress());

    //NFT data
    const tokenURI = 'https://silver-traditional-marmoset-57.mypinata.cloud/ipfs/QmWNogCchWmFyauGeDHvCTmA6azAvdcED644wTxkAaybxs';
    //NFT creation
    // const txn = await nft.mintNFT(owner, tokenURI);
    // await txn.wait();

    // console.log("chainId: ", txn.blockNumber);
    // console.log("NFT minted:", txn.hash);

    // Auction based on the first image of the NFT
    const tokenId = 1;
    // minimum price set in wei
    const reservePrice = 100;
    // auction contract creation
    const AuctionFactory = await ethers.getContractFactory("Auction");
    // auction contract deployment
    // const Auction = await AuctionFactory.deploy(nft,tokenId,reservePrice);
    const Auction = await AuctionFactory.deploy();
    // Auction.begin(nft,tokenId,reservePrice);

    await Auction.waitForDeployment();

    // lets the auction sell the owner's token
    await nft.approve(Auction,tokenId);

    // console.log("Auction Contract",Auction);
    console.log("Auction Contract deployed to:",await Auction.getAddress());

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

