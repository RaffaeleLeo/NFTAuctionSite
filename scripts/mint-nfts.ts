import { ethers } from "hardhat";
import sqlite3 from 'sqlite3';

async function main() {
    const [owner] = await ethers.getSigners();
    const NFT = await ethers.getContractFactory("NFT");
    const nft = await NFT.deploy();

    console.log("NFT Contract deployed to:", nft.tokenURI);

    const tokenURI = "https://gateway.pinata.cloud/ipfs/ipfs/Qmax9pXv3wTgSi4DsNa2msGuZL6nAuhm4bV1QBcKG47rGM";
    const txn = await nft.mintNFT(owner.address, tokenURI);
    await txn.wait();

    console.log("chainId: ", txn.blockNumber)
    console.log("NFT minted:", txn.hash);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});