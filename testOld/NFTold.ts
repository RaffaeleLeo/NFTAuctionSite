//npm install --save-dev @openzeppelin/test-environment
import {accounts, contract, web3} from "@openzeppelin/test-environment";
import { expect } from "chai";
import { BigNumber } from "bignumber.js";



const [deployer, userMinter] = accounts;

const MyNFTContract = contract.fromArtifact("NFT");

describe("NFT", function () {
  beforeEach(async function () {
    this.contract = await MyNFTContract.new({ from: deployer });
  });

  it("It should mint NFT successfully", async function () {
    const tokenURI = "ape_nft_one";

    const mintResult = await this.contract.mint(
      tokenURI,
      userMinter,
      web3.utils.toWei("12", "ether"),
      { from: userMinter }
    );

    const price = web3.utils.fromWei(
      new BigNumber(mintResult.logs[1].args.price).toString(),
      "ether"
    );
    expect(mintResult.logs[1].args.nftID.toNumber()).to.eq(1);
    expect(mintResult.logs[1].args.uri).to.eq(tokenURI);
    expect(mintResult.logs[1].args.minter).to.eq(userMinter);
    expect(price).to.eq("12");
  });

  it("It should update NFT price ", async function () {
    const tokenURI = "ape_nft_two";
    const mintResult = await this.contract.mint(
      tokenURI,
      userMinter,
      web3.utils.toWei("10", "ether"),
      { from: userMinter }
    );

    const updateResult = await this.contract.updatePrice(
      mintResult.logs[0].args.tokenId.toNumber(),
      web3.utils.toWei("20", "ether"),
      { from: userMinter }
    );

    const oldPrice = web3.utils.fromWei(
      new BigNumber(updateResult.logs[0].args.oldPrice).toString(),
      "ether"
    );

    const newPrice = web3.utils.fromWei(
      new BigNumber(updateResult.logs[0].args.newPrice).toString(),
      "ether"
    );

    expect(updateResult.logs[0].args.owner).to.eq(userMinter);
    expect(oldPrice).to.eq("10");
    expect(newPrice).to.eq("20");
  });
});