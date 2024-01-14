import { ethers } from 'hardhat';
import { expect } from 'chai';
import { Signer } from 'ethers';
import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers';

describe("MyNFT", function(){

    async function deploy() {
        const[myNFT,owner,address1] = await ethers.getSigners();
        const MyNFTFactory = await ethers.getContractFactory("MyNFT");
        const MyNFT = await MyNFTFactory.deploy();

        return{ MyNFT,myNFT,owner,address1 };
    }

    describe("Deployment", function(){
        it('Should mint a new NFT and set token URI', async function () {
            const tokenURI = 'https://example.com/metadata/1.json';
            const {myNFT,owner,address1} = await loadFixture(deploy);
            expect(await myNFT.)
        });

    }

});