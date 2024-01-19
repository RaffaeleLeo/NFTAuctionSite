// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFT is ERC721URIStorage {
    uint256 private _tokenId;

    constructor() ERC721("MyNFT", "MNFT") {}

    function mintNFT(address to, string memory tokenURI) public returns (uint256) {
        _tokenId++;
        _mint(to, _tokenId);
        _setTokenURI(_tokenId, tokenURI);
        return _tokenId;
    }

    // Public getter for the current tokenId
    function getCurrentTokenId() public view returns (uint256) {
        return _tokenId;
    }
}
