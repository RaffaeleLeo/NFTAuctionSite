const MyNFT = artifacts.require("MyNFT");

contract("MyNFT", accounts => {
    it("should mint an NFT", async () => {
        const instance = await MyNFT.deployed();
        const owner = await instance.ownerOf(1);
        assert.equal(owner, accounts[0], "First NFT wasn't minted to the deployer");
    });
});
